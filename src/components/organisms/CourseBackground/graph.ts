// Pure geometry + timing for the CourseBackground "plexus" network.
// No DOM or WebGL here, so every decision about layout and cascades is unit-testable.

export type Framing = 'wide' | 'narrow';

export interface GraphNode {
  x: number;       // world units; the cloud is centred on the origin
  y: number;
  z: number;
  size: number;    // relative point size
  hub: boolean;    // hubs are bigger and always carry a star flare
  seed: number;    // 0–1, drives idle drift and twinkle
}

export interface Graph {
  framing: Framing;
  nodes: GraphNode[];
  edges: Array<[number, number]>;
  neighbors: number[][];
  radii: { x: number; y: number; z: number };
  maxDist: number;
}

export interface Hop {
  from: number;
  to: number;
  start: number;   // ms, same clock as the caller's `now`
  duration: number;
}

export interface Fire {
  node: number;
  at: number;
}

export interface Cascade {
  hops: Hop[];
  fires: Fire[];
  end: number;     // when every trace of the cascade has faded
}

// — Framing ——————————————————————————————————————————————————

/** Cards narrower than this are phones (or the 2-column Home grid); their copy stays full width. */
export const NARROW_MAX_WIDTH = 520;

/** Where the cloud's centre sits across the card, and how much of the card's width it spans. */
export const FRAMING = {
  wide: { center: 0.73, span: 0.5 },
  narrow: { center: 0.78, span: 0.62 },
} as const;

/** Vertical half-extent of the cloud in world units; the camera is fitted to it. */
export const CLOUD_RADIUS_Y = 10;
/** Share of the card height the cloud fills (just over 1, so it bleeds past the edges). */
export const CLOUD_FILL = 1.3;
const CLOUD_RADIUS_Z = 7;

// — Timing (ms) ——————————————————————————————————————————————————

export const MS_PER_UNIT = 120;     // pulse travel speed along an edge
export const FLASH_MS = 1200;       // node flare after a pulse lands
export const ENERGY_MS = 900;       // edge afterglow once a pulse has passed
export const CASCADE_GAP_MIN_MS = 1600;
export const CASCADE_GAP_MAX_MS = 2800;

export function getFraming(width: number): Framing {
  return width < NARROW_MAX_WIDTH ? 'narrow' : 'wide';
}

/** Small, fast, seedable PRNG so the cloud is identical across resizes and theme changes. */
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
const dist = (a: GraphNode, b: GraphNode) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

export function buildGraph(width: number, height: number, seed = 11): Graph {
  const framing = getFraming(width);
  const rng = mulberry32(seed);

  // Fit the cloud's width to its share of the card, measured in the camera's world units.
  const unitsPerPx = (CLOUD_RADIUS_Y * 2) / (Math.max(height, 1) * CLOUD_FILL);
  const radii = {
    x: clamp((width * FRAMING[framing].span * unitsPerPx) / 2, 5, 16),
    y: CLOUD_RADIUS_Y,
    z: CLOUD_RADIUS_Z,
  };
  const count = Math.round(clamp((width * height) / 7500, 45, 80));
  const minGap = 1.6;

  // Rejection-sample a soft ellipsoid: denser toward the middle, never clumped.
  const nodes: GraphNode[] = [];
  for (let attempt = 0; nodes.length < count && attempt < count * 60; attempt++) {
    const u = rng() * 2 - 1, v = rng() * 2 - 1, w = rng() * 2 - 1;
    const r2 = u * u + v * v + w * w;
    if (r2 > 1 || r2 === 0) continue;
    const pull = Math.pow(r2, 0.06); // < 1 inside: very gently gathers points toward the centre
    const node = {
      x: u * pull * radii.x,
      y: v * pull * radii.y,
      z: w * pull * radii.z,
      size: 0,
      hub: false,
      seed: rng(),
    };
    if (nodes.some((n) => dist(n, node) < minGap)) continue;
    nodes.push(node);
  }
  const hubCount = Math.max(3, Math.round(nodes.length * 0.08));
  nodes.forEach((n, i) => {
    n.hub = i < hubCount; // sample order is random, so the first few are as good as any
    n.size = n.hub ? 1.7 + rng() * 0.6 : 0.7 + rng() * 0.45;
  });

  // Plexus wiring: every node links to its nearest neighbours within reach.
  const maxDist = CLOUD_RADIUS_Y * 0.55;
  const k = 3;
  const seen = new Set<number>();
  const edges: Array<[number, number]> = [];
  const neighbors: number[][] = nodes.map(() => []);
  const link = (a: number, b: number) => {
    const key = Math.min(a, b) * nodes.length + Math.max(a, b);
    if (a === b || seen.has(key)) return;
    seen.add(key);
    edges.push([a, b]);
    neighbors[a].push(b);
    neighbors[b].push(a);
  };
  nodes.forEach((n, i) => {
    const byDistance = nodes
      .map((m, j) => ({ j, d: dist(n, m) }))
      .filter((e) => e.j !== i)
      .sort((p, q) => p.d - q.d);
    byDistance.slice(0, k).forEach((e) => {
      if (e.d <= maxDist) link(i, e.j);
    });
    // No isolated sparks: fall back to the single nearest neighbour.
    if (neighbors[i].length === 0 && byDistance.length > 0) link(i, byDistance[0].j);
  });

  return { framing, nodes, edges, neighbors, radii, maxDist };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * One burst of activity: a hub fires, then the signal spreads breadth-first along edges for
 * 5–7 hops, each node passing it to 1–2 neighbours it hasn't reached yet. Pulses leave a node
 * only after it fired and travel at a constant speed, so the cascade reads as causal.
 */
export function planCascade(graph: Graph, rng: () => number, start: number): Cascade {
  const { nodes, neighbors } = graph;
  const hubs = nodes.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
  const pool = hubs.length > 0 ? hubs : nodes.map((_, i) => i);
  const source = pool[Math.floor(rng() * pool.length)];

  const hops: Hop[] = [];
  const fires: Fire[] = [{ node: source, at: start }];
  const firedAt = new Map<number, number>([[source, start]]);
  let frontier = [source];
  const depth = 5 + Math.floor(rng() * 3);

  for (let level = 0; level < depth && frontier.length > 0; level++) {
    const next: number[] = [];
    for (const from of frontier) {
      const open = shuffle(neighbors[from].filter((n) => !firedAt.has(n)), rng);
      const fanOut = level === 0 ? 2 + Math.floor(rng() * 2) : 1 + Math.floor(rng() * 2);
      for (const to of open.slice(0, fanOut)) {
        const hopStart = firedAt.get(from)! + rng() * 90;
        const duration = dist(nodes[from], nodes[to]) * MS_PER_UNIT;
        hops.push({ from, to, start: hopStart, duration });
        firedAt.set(to, hopStart + duration);
        fires.push({ node: to, at: hopStart + duration });
        next.push(to);
      }
    }
    frontier = shuffle(next, rng).slice(0, 4);
  }

  const lastFire = Math.max(...fires.map((f) => f.at));
  return { hops, fires, end: lastFire + Math.max(FLASH_MS, ENERGY_MS) };
}
