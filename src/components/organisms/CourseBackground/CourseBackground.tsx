import { useEffect, useRef } from 'react';
import { NARROW_MAX_WIDTH } from './graph';
import type { NeuralScene, ScenePalette } from './scene';
import './CourseBackground.css';

export interface CourseBackgroundProps {
  className?: string;
}

const TOKEN = '--components-tokens--site--course-background';
const SURFACE_TOKEN = '--components-tokens--site--course-card--surface-color';
const WIDE_PIXEL_RATIO = 2;
const NARROW_PIXEL_RATIO = 1.5;

/** Relative luminance (0–1) of a CSS color, via a throwaway 2D context. */
function luminance(color: string): number {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return 0;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function readPalette(el: HTMLElement): ScenePalette | null {
  const style = getComputedStyle(el);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const synapse = read(`${TOKEN}--synapse-color`);
  const neuron = read(`${TOKEN}--neuron-color`);
  const signal = read(`${TOKEN}--signal-color`);
  const haze = read(`${TOKEN}--haze-color`);
  const surface = read(SURFACE_TOKEN);
  if (!synapse || !neuron || !signal || !haze) return null;
  return { synapse, neuron, signal, haze, lightSurface: !!surface && luminance(surface) > 0.4 };
}

/**
 * Animated 3D neural network behind the AI-first course card.
 *
 * A Three.js "plexus" cloud framed from the middle of the card to its right edge, with
 * depth-of-field bokeh, star-flare hubs and pulse cascades, over drifting smoke.
 * Parallax follows the pointer (fine pointers only) and the card's scroll position.
 * Three.js is loaded lazily, so it stays out of the main bundle. Colors come from the
 * Site.Course-background tokens and are re-read whenever `<html data-theme>` changes.
 */
export const CourseBackground: React.FC<CourseBackgroundProps> = ({ className }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const card = root?.parentElement;
    if (!root || !canvas || !card) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let reducedMotion = motionQuery.matches;
    let visible = typeof IntersectionObserver === 'undefined';
    let scene: NeuralScene | null = null;
    let disposed = false;
    let running = false;
    let rafId = 0;

    /** -1 while the card enters at the bottom of the viewport, 0 centred, 1 as it leaves at the top. */
    const scrollProgress = () => {
      const rect = card.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
      return Math.max(-1, Math.min(1, (viewport / 2 - centre) / (viewport / 2 + rect.height / 2)));
    };

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (!scene) return;
      scene.setScroll(scrollProgress());
      scene.frame(now);
    };

    const sync = () => {
      if (!scene) return;
      const shouldRun = visible && !reducedMotion;
      if (shouldRun && !running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
      if (!running && reducedMotion) scene.still();
    };

    const applyPalette = () => {
      const palette = readPalette(root);
      if (palette) scene?.setPalette(palette);
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!scene || width === 0 || height === 0) return;
      const cap = width < NARROW_MAX_WIDTH ? NARROW_PIXEL_RATIO : WIDE_PIXEL_RATIO;
      scene.resize(width, height, Math.min(window.devicePixelRatio || 1, cap));
      if (!running) sync();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer.matches || e.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      scene?.setPointer(x, y);
    };
    const onPointerLeave = () => scene?.setPointer(0, 0);

    const resizeObserver = new ResizeObserver(resize);
    // ThemeProvider flips data-theme in its own effect, after ours has run, so a `theme` prop
    // would always be one render stale. Watching the attribute is exact.
    const themeObserver = new MutationObserver(() => {
      applyPalette();
      if (!running) sync();
    });
    const intersectionObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        }, { rootMargin: '120px' });
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      sync();
    };

    // Three.js ships in its own chunk, fetched only when a card with this background mounts.
    import('./scene')
      .then(({ createNeuralScene }) => {
        if (disposed) return;
        try {
          scene = createNeuralScene(canvas);
        } catch {
          return; // No WebGL: the card simply shows without its background.
        }
        applyPalette();
        resize();
        resizeObserver.observe(canvas);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        intersectionObserver?.observe(canvas);
        motionQuery.addEventListener('change', onMotionChange);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
        sync();
      })
      .catch(() => {
        // Chunk failed to load (offline, deploy skew): the card shows without its background.
      });

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver?.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      scene?.dispose();
      scene = null;
    };
  }, []);

  const classNames = ['qd-course-background', className].filter(Boolean).join(' ');
  return (
    <div ref={rootRef} className={classNames} aria-hidden="true">
      <div className="qd-course-background__stage">
        <canvas ref={canvasRef} className="qd-course-background__canvas" />
      </div>
    </div>
  );
};
