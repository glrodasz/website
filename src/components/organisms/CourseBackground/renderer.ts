import { FLASH_MS, TRAIL_MS, type Network, type Wave } from './network';

/** Colors resolved from the Site.Course-background component tokens. */
export interface Palette {
  synapse: string;
  neuron: string;
  signal: string;
  /** Dark surfaces get additive glow; on light surfaces additive blending would wash out to white. */
  glowBlend: GlobalCompositeOperation;
}

// Relative opacities. Contrast per theme comes from the token colors, so these stay theme-agnostic.
const SYNAPSE_ALPHA = 0.2;
const NEURON_ALPHA = 0.5;
const TRAIL_ALPHA = 0.75;
const AFTERGLOW_ALPHA = 0.35;
const GLOW_ALPHA = 0.55;
const DEPTH_BUCKETS = [0.55, 0.8, 1] as const;
const DRIFT_SPEED = 0.00045; // rad/ms → one idle sway every ~14 s

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** Quick rise, slow decay. */
const flash = (t: number) => (t <= 0 || t >= 1 ? 0 : t < 0.15 ? t / 0.15 : 1 - easeOut((t - 0.15) / 0.85));

export class NetworkRenderer {
  private net: Network | null = null;
  private palette: Palette | null = null;
  private px = new Float32Array(0);
  private py = new Float32Array(0);
  private lit = new Float64Array(0);
  private mask: CanvasGradient | null = null;
  private glow: HTMLCanvasElement | null = null;
  private signalClear = 'transparent';

  private readonly ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  setNetwork(net: Network): void {
    this.net = net;
    this.px = new Float32Array(net.neurons.length);
    this.py = new Float32Array(net.neurons.length);
    this.lit = new Float64Array(net.neurons.length);
    const { fade } = net;
    this.mask = fade.kind === 'linear'
      ? this.ctx.createLinearGradient(fade.x0, 0, fade.x1, 0)
      : this.ctx.createRadialGradient(fade.cx, fade.cy, fade.r0, fade.cx, fade.cy, fade.r1);
    if (fade.kind === 'linear') {
      this.mask.addColorStop(0, 'rgba(0,0,0,0)');
      this.mask.addColorStop(1, 'rgba(0,0,0,1)');
    } else {
      this.mask.addColorStop(0, 'rgba(0,0,0,1)');
      this.mask.addColorStop(1, 'rgba(0,0,0,0)');
    }
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
    // Fade gradients to the signal color at zero alpha, not to transparent black,
    // so glow edges never go muddy on light surfaces.
    const [r, g, b] = parseColor(this.ctx, palette.signal);
    this.signalClear = `rgba(${r}, ${g}, ${b}, 0)`;
    this.glow = makeGlowSprite(palette.signal, this.signalClear);
  }

  /** Paint one frame. `now` and every wave timestamp share the same clock. */
  draw(waves: Wave[], now: number, driftTime = now): void {
    const { ctx, net, palette, mask } = this;
    if (!net || !palette || !mask) return;
    const { neurons, synapses } = net;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, net.width, net.height);

    // Idle drift: nearer neurons sway a little more, which sells the depth.
    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];
      const amp = net.drift * (0.4 + n.depth * 0.6);
      this.px[i] = n.x + Math.cos(driftTime * DRIFT_SPEED * 0.8 + n.phase * 1.7) * amp * 0.6;
      this.py[i] = n.y + Math.sin(driftTime * DRIFT_SPEED + n.phase) * amp;
    }

    // Structure: synapses batched into one path per depth bucket.
    ctx.strokeStyle = palette.synapse;
    ctx.lineWidth = 1;
    DEPTH_BUCKETS.forEach((weight, bucket) => {
      ctx.beginPath();
      for (const s of synapses) {
        if (Math.min(Math.floor(s.depth * DEPTH_BUCKETS.length), DEPTH_BUCKETS.length - 1) !== bucket) continue;
        ctx.moveTo(this.px[s.a], this.py[s.a]);
        ctx.lineTo(this.px[s.b], this.py[s.b]);
      }
      ctx.globalAlpha = SYNAPSE_ALPHA * weight;
      ctx.stroke();
    });

    ctx.fillStyle = palette.neuron;
    for (let i = 0; i < neurons.length; i++) {
      const d = neurons[i].depth;
      ctx.globalAlpha = NEURON_ALPHA * (0.55 + d * 0.45);
      ctx.beginPath();
      ctx.arc(this.px[i], this.py[i], net.radius * (0.75 + d * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    // Activity: which neurons fired most recently.
    this.lit.fill(-Infinity);
    for (const wave of waves) {
      for (const f of wave.fires) {
        if (f.at <= now && f.at > this.lit[f.neuron]) this.lit[f.neuron] = f.at;
      }
    }

    // Synapse trails and afterglow.
    ctx.strokeStyle = palette.signal;
    ctx.lineCap = 'round';
    for (const wave of waves) {
      for (const hop of wave.hops) {
        const t = (now - hop.start) / hop.duration;
        if (t < 0) continue;
        const ax = this.px[hop.from], ay = this.py[hop.from];
        const bx = this.px[hop.to], by = this.py[hop.to];
        if (t <= 1) {
          const head = easeInOut(t);
          const tail = Math.max(0, head - 0.45);
          const hx = ax + (bx - ax) * head, hy = ay + (by - ay) * head;
          const tx = ax + (bx - ax) * tail, ty = ay + (by - ay) * tail;
          const grad = ctx.createLinearGradient(tx, ty, hx, hy);
          grad.addColorStop(0, this.signalClear);
          grad.addColorStop(1, palette.signal);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = TRAIL_ALPHA;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        } else {
          const after = (now - hop.start - hop.duration) / TRAIL_MS;
          if (after >= 1) continue;
          ctx.strokeStyle = palette.signal;
          ctx.globalAlpha = AFTERGLOW_ALPHA * (1 - easeOut(after));
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }

    // Lit neurons: glow, core and an expanding ripple.
    for (let i = 0; i < neurons.length; i++) {
      if (this.lit[i] === -Infinity) continue;
      const t = (now - this.lit[i]) / FLASH_MS;
      const k = flash(t);
      if (k <= 0) continue;
      const r = net.radius * (0.75 + neurons[i].depth * 0.4);
      this.drawGlow(this.px[i], this.py[i], r * 7 * (0.6 + 0.4 * k), GLOW_ALPHA * k);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = palette.signal;
      ctx.globalAlpha = k;
      ctx.beginPath();
      ctx.arc(this.px[i], this.py[i], r * (1 + 0.45 * k), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.signal;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6 * (1 - easeOut(t));
      ctx.beginPath();
      ctx.arc(this.px[i], this.py[i], r + 16 * easeOut(t), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Travelling signals on top.
    for (const wave of waves) {
      for (const hop of wave.hops) {
        const t = (now - hop.start) / hop.duration;
        if (t < 0 || t > 1) continue;
        const head = easeInOut(t);
        const x = this.px[hop.from] + (this.px[hop.to] - this.px[hop.from]) * head;
        const y = this.py[hop.from] + (this.py[hop.to] - this.py[hop.from]) * head;
        this.drawGlow(x, y, net.radius * 4.5, GLOW_ALPHA);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = palette.signal;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, net.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Fade the whole frame away from the copy.
    ctx.globalCompositeOperation = 'destination-in';
    ctx.globalAlpha = 1;
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, net.width, net.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  private drawGlow(x: number, y: number, radius: number, alpha: number): void {
    if (!this.glow || !this.palette || alpha <= 0) return;
    const { ctx } = this;
    ctx.globalCompositeOperation = this.palette.glowBlend;
    ctx.globalAlpha = alpha;
    ctx.drawImage(this.glow, x - radius, y - radius, radius * 2, radius * 2);
  }
}

/** Pre-rendered soft glow; far cheaper than `shadowBlur`, especially on mobile Safari. */
function makeGlowSprite(color: string, clear: string): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const g = sprite.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, color);
    grad.addColorStop(1, clear);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return sprite;
}

/** Any CSS color → [r, g, b], parsed by letting the canvas normalise it. */
function parseColor(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  const previous = ctx.fillStyle;
  ctx.fillStyle = color;
  const normalised = String(ctx.fillStyle);
  ctx.fillStyle = previous;
  if (normalised.startsWith('#')) {
    return [1, 3, 5].map((i) => parseInt(normalised.slice(i, i + 2), 16)) as [number, number, number];
  }
  const [r = 0, g = 0, b = 0] = (normalised.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b];
}

/** Relative luminance (0–1) of any CSS color. */
export function luminance(ctx: CanvasRenderingContext2D, color: string): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = parseColor(ctx, color);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
