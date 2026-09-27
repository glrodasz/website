// Pure layout + activation planning for the CourseBackground neural network.
// No DOM access here, so every decision about geometry and timing is unit-testable.

export type LayoutMode = 'wide' | 'compact';

export interface Neuron {
  x: number;       // CSS px, card space
  y: number;
  depth: number;   // 0 (far) → 1 (near): drives size, opacity and drift
  layer: number;
  phase: number;   // idle drift phase, radians
}

export interface Synapse {
  a: number;       // neuron index in layer l
  b: number;       // neuron index in layer l + 1
  depth: number;   // mean depth of the two ends
}

/** Where the network is allowed to be seen; applied as a canvas mask. */
export type Fade =
  | { kind: 'linear'; x0: number; x1: number }                   // transparent at x0 → opaque at x1
  | { kind: 'radial'; cx: number; cy: number; r0: number; r1: number }; // opaque inside r0 → transparent at r1

export interface Network {
  mode: LayoutMode;
  width: number;
  height: number;
  neurons: Neuron[];
  layers: number[][];     // neuron indices per layer
  synapses: Synapse[];
  outgoing: number[][];   // neuron index → connected neuron indices in the next layer
  fade: Fade;
  drift: number;          // idle drift amplitude, CSS px
  radius: number;         // base neuron radius, CSS px
}

export interface Hop {
  from: number;
  to: number;
  start: number;          // ms, same clock as the caller's `now`
  duration: number;
}

export interface Fire {
  neuron: number;
  at: number;
}

export interface Wave {
  hops: Hop[];
  fires: Fire[];
  end: number;            // when every trace of the wave has faded
}

// — Layout ————————————————————————————————————————————————

/** Left edge the wide network never crosses: card padding + the copy's max width + breathing room. */
const WIDE_TEXT_CLEARANCE = 640;
const WIDE_EDGE_INSET = 48;
/** Narrowest free column worth drawing a full network in. */
const WIDE_MIN_REGION = 260;

/** Cards at least this wide have a real free column to the right of the copy. */
export const WIDE_MIN_WIDTH = WIDE_TEXT_CLEARANCE + WIDE_MIN_REGION + WIDE_EDGE_INSET;
const WIDE_V_INSET = 36;
const WIDE_LAYER_GAP = 72;
const WIDE_NEURON_GAP = 58;

// Compact spacing scales with the card so a phone-width card still gets a dense little network.
const COMPACT_LAYER_GAP = { ratio: 0.12, min: 42, max: 60 };
const COMPACT_NEURON_GAP = { ratio: 0.09, min: 30, max: 44 };

// — Timing (ms) ——————————————————————————————————————————

export const HOP_MS = 440;          // signal travel along one synapse
export const FLASH_MS = 950;        // neuron glow + ripple after a signal lands
export const TRAIL_MS = 700;        // synapse afterglow once a signal has passed
export const WAVE_GAP_MIN_MS = 2200;
export const WAVE_GAP_MAX_MS = 3400;

export function getLayoutMode(width: number): LayoutMode {
  return width >= WIDE_MIN_WIDTH ? 'wide' : 'compact';
}

/** Small, fast, seedable PRNG so the layout is identical across resizes and theme changes. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Bell-shaped layer sizes: narrow input/output, widest in the middle (e.g. 4-6-7-7-6-4). */
function layerSizes(layerCount: number, minN: number, maxN: number): number[] {
  return Array.from({ length: layerCount }, (_, l) =>
    Math.round(minN + (maxN - minN) * Math.sin((Math.PI * (l + 0.5)) / layerCount)),
  );
}

interface Region {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

function regionFor(mode: LayoutMode, width: number, height: number): Region {
  if (mode === 'wide') {
    return {
      x0: Math.max(width * 0.5, WIDE_TEXT_CLEARANCE),
      x1: width - WIDE_EDGE_INSET,
      y0: WIDE_V_INSET,
      y1: height - WIDE_V_INSET,
    };
  }
  // Compact: tucked into the top-right corner, bleeding slightly off both edges. The height is
  // also capped by the width, so a tall phone card keeps a corner-sized network.
  return {
    x0: width * 0.5,
    x1: width * 1.03,
    y0: -height * 0.04,
    y1: Math.min(height * 0.42, width * 0.55),
  };
}

function fadeFor(mode: LayoutMode, region: Region, width: number): Fade {
  if (mode === 'wide') {
    return { kind: 'linear', x0: region.x0 - 80, x1: region.x0 + 90 };
  }
  const reach = Math.hypot(width - region.x0, region.y1);
  return { kind: 'radial', cx: width, cy: 0, r0: reach * 0.5, r1: reach * 1.12 };
}

export function buildNetwork(width: number, height: number, seed = 7): Network {
  const mode = getLayoutMode(width);
  const rng = mulberry32(seed);
  const region = regionFor(mode, width, height);
  const regionW = Math.max(region.x1 - region.x0, 1);
  const regionH = Math.max(region.y1 - region.y0, 1);

  const scaled = (g: { ratio: number; min: number; max: number }) => clamp(width * g.ratio, g.min, g.max);
  const layerGap = mode === 'wide' ? WIDE_LAYER_GAP : scaled(COMPACT_LAYER_GAP);
  const neuronGap = mode === 'wide' ? WIDE_NEURON_GAP : scaled(COMPACT_NEURON_GAP);
  const layerCount = mode === 'wide'
    ? clamp(Math.round(regionW / layerGap), 4, 6)
    : clamp(Math.round(regionW / layerGap), 4, 5);
  const maxN = mode === 'wide'
    ? clamp(Math.floor(regionH / neuronGap), 4, 7)
    : clamp(Math.floor(regionH / neuronGap), 3, 5);
  const sizes = layerSizes(layerCount, Math.min(3, maxN), maxN);

  const stepX = regionW / Math.max(layerCount - 1, 1);
  const stepY = regionH / maxN;
  const midY = (region.y0 + region.y1) / 2;

  const neurons: Neuron[] = [];
  const layers: number[][] = sizes.map((count, l) =>
    Array.from({ length: count }, (_, n) => {
      const jitterX = (rng() - 0.5) * stepX * 0.22;
      const jitterY = (rng() - 0.5) * stepY * 0.34;
      neurons.push({
        x: region.x0 + l * stepX + (l === 0 || l === layerCount - 1 ? 0 : jitterX),
        y: midY + (n - (count - 1) / 2) * stepY + jitterY,
        depth: rng(),
        layer: l,
        phase: rng() * Math.PI * 2,
      });
      return neurons.length - 1;
    }),
  );

  // Sparse, mostly "local" connectivity reads as a network instead of a hairball:
  // link neurons at similar relative heights, plus a few seeded long-range links.
  const synapses: Synapse[] = [];
  const outgoing: number[][] = neurons.map(() => []);
  const rel = (i: number, count: number) => (count === 1 ? 0.5 : i / (count - 1));
  for (let l = 0; l < layers.length - 1; l++) {
    const from = layers[l];
    const to = layers[l + 1];
    const incoming = new Set<number>();
    const link = (a: number, b: number) => {
      synapses.push({ a, b, depth: (neurons[a].depth + neurons[b].depth) / 2 });
      outgoing[a].push(b);
      incoming.add(b);
    };
    from.forEach((a, i) => {
      to.forEach((b, j) => {
        const near = Math.abs(rel(i, from.length) - rel(j, to.length)) <= 0.36;
        if (near || rng() < 0.12) link(a, b);
      });
    });
    // Guarantee every neuron has a way in and a way out: no orphans, and no wave dead-ends early.
    to.forEach((b, j) => {
      if (!incoming.has(b)) link(from[Math.round(rel(j, to.length) * (from.length - 1))], b);
    });
    from.forEach((a, i) => {
      if (outgoing[a].length === 0) link(a, to[Math.round(rel(i, from.length) * (to.length - 1))]);
    });
  }

  return {
    mode,
    width,
    height,
    neurons,
    layers,
    synapses,
    outgoing,
    fade: fadeFor(mode, region, width),
    drift: mode === 'wide' ? 2.2 : 1.6,
    radius: mode === 'wide' ? 3.2 : 2.7,
  };
}

// — Activation waves ————————————————————————————————————————

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Plan one forward pass starting at `start`: 1–2 inputs fire, and each layer passes the
 * signal to 2–3 connected neurons in the next (1–2 at the output). Hops leave a neuron
 * only after it fired, so the wave is causal and reads as a path, not noise.
 */
export function planWave(net: Network, rng: () => number, start: number): Wave {
  const hops: Hop[] = [];
  const fires: Fire[] = [];
  const firedAt = new Map<number, number>();

  const inputs = shuffle(net.layers[0], rng).slice(0, rng() < 0.5 ? 1 : 2);
  inputs.forEach((n, i) => {
    const at = start + i * 90;
    firedAt.set(n, at);
    fires.push({ neuron: n, at });
  });

  let active = inputs;
  for (let l = 1; l < net.layers.length; l++) {
    const candidates = [...new Set(active.flatMap((a) => net.outgoing[a]))];
    if (candidates.length === 0) break;
    const isOutput = l === net.layers.length - 1;
    const want = isOutput ? 1 + Math.floor(rng() * 2) : 2 + Math.floor(rng() * 2);
    const targets = shuffle(candidates, rng).slice(0, Math.min(want, candidates.length));

    for (const target of targets) {
      const sources = shuffle(active.filter((a) => net.outgoing[a].includes(target)), rng).slice(0, 2);
      let arrival = -Infinity;
      for (const source of sources) {
        const hopStart = firedAt.get(source)! + rng() * 60;
        hops.push({ from: source, to: target, start: hopStart, duration: HOP_MS });
        arrival = Math.max(arrival, hopStart + HOP_MS);
      }
      firedAt.set(target, arrival);
      fires.push({ neuron: target, at: arrival });
    }
    active = targets;
  }

  const lastFire = Math.max(...fires.map((f) => f.at));
  return { hops, fires, end: lastFire + Math.max(FLASH_MS, TRAIL_MS) };
}
