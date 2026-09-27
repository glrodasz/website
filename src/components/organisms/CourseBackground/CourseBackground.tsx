import { useEffect, useRef } from 'react';
import {
  HOP_MS,
  WAVE_GAP_MAX_MS,
  WAVE_GAP_MIN_MS,
  buildNetwork,
  mulberry32,
  planWave,
  type Network,
  type Wave,
} from './network';
import { NetworkRenderer, luminance, type Palette } from './renderer';
import './CourseBackground.css';

export interface CourseBackgroundProps {
  className?: string;
}

const TOKEN = '--components-tokens--site--course-background';
const SURFACE_TOKEN = '--components-tokens--site--course-card--surface-color';
const MAX_PIXEL_RATIO = 2;
/** A frame gap longer than this means the loop was paused (tab hidden, scrolled away). */
const RESUME_GAP_MS = 1000;

function readPalette(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Palette | null {
  const style = getComputedStyle(canvas);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const synapse = read(`${TOKEN}--synapse-color`);
  const neuron = read(`${TOKEN}--neuron-color`);
  const signal = read(`${TOKEN}--signal-color`);
  const surface = read(SURFACE_TOKEN);
  if (!synapse || !neuron || !signal) return null;
  return {
    synapse,
    neuron,
    signal,
    glowBlend: surface && luminance(ctx, surface) > 0.4 ? 'source-over' : 'lighter',
  };
}

/**
 * Animated neural network drawn behind the AI-first course card.
 *
 * Layout follows the card's own width, not the viewport: wide cards get a full network in
 * the free column right of the copy; narrow cards (mobile, the half-width Home card) get a
 * smaller one tucked into the top-right corner. Colors come from component tokens and are
 * re-read whenever `<html data-theme>` changes.
 */
export const CourseBackground: React.FC<CourseBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const renderer = new NetworkRenderer(ctx);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let net: Network | null = null;
    let hasPalette = false;
    let visible = typeof IntersectionObserver === 'undefined';
    let rafId = 0;
    let running = false;
    let waves: Wave[] = [];
    let nextWaveAt = 0;
    let lastFrame = 0;

    // Reduced motion: one frozen moment of a single forward pass, so it still reads as a network.
    const drawStill = () => {
      if (!net || !hasPalette) return;
      const wave = planWave(net, mulberry32(3), 0);
      renderer.draw([wave], HOP_MS * 2.6, 0);
    };

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (!net) return;
      if (now - lastFrame > RESUME_GAP_MS) {
        waves = [];
        nextWaveAt = now + 300;
      }
      lastFrame = now;
      if (now >= nextWaveAt) {
        waves.push(planWave(net, Math.random, now));
        nextWaveAt = now + WAVE_GAP_MIN_MS + Math.random() * (WAVE_GAP_MAX_MS - WAVE_GAP_MIN_MS);
      }
      waves = waves.filter((w) => now < w.end);
      renderer.draw(waves, now);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const sync = () => {
      const shouldRun = visible && !reducedMotion && !!net && hasPalette;
      if (shouldRun && !running) {
        running = true;
        lastFrame = performance.now();
        nextWaveAt = Math.min(nextWaveAt, lastFrame + 300);
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        stop();
      }
      if (!running) {
        if (reducedMotion) drawStill();
        else if (net && hasPalette) renderer.draw(waves, performance.now());
      }
    };

    const applyPalette = () => {
      const palette = readPalette(canvas, ctx);
      hasPalette = !!palette;
      if (palette) renderer.setPalette(palette);
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      net = buildNetwork(width, height);
      renderer.setNetwork(net);
      waves = [];
      sync();
    };

    applyPalette();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // ThemeProvider flips data-theme in its own effect, after ours has run, so a `theme`
    // prop would always be one render stale. Watching the attribute is exact.
    const themeObserver = new MutationObserver(() => {
      applyPalette();
      sync();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const intersectionObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        }, { rootMargin: '120px' });
    intersectionObserver?.observe(canvas);

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      sync();
    };
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver?.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  const classNames = ['qd-course-background', className].filter(Boolean).join(' ');
  return <canvas ref={canvasRef} className={classNames} aria-hidden="true" />;
};
