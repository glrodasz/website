import { describe, expect, it } from 'vitest';
import { NARROW_MAX_WIDTH, buildGraph, getFraming, mulberry32, planCascade, MS_PER_UNIT } from './graph';

// Real card sizes: Courses card on desktop, Home half-width card on desktop, phone cards.
const SIZES = {
  wide: [1092, 547],
  home: [558, 520],
  phone: [358, 347],
  tallPhone: [358, 820],
} as const;

const dist = (g: ReturnType<typeof buildGraph>, i: number, j: number) => {
  const a = g.nodes[i], b = g.nodes[j];
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
};

describe('getFraming', () => {
  it('keeps full-width copy only on phone-width cards', () => {
    expect(getFraming(SIZES.wide[0])).toBe('wide');
    expect(getFraming(SIZES.home[0])).toBe('wide'); // Home card on desktop still gets the copy column
    expect(getFraming(NARROW_MAX_WIDTH)).toBe('wide');
    expect(getFraming(NARROW_MAX_WIDTH - 1)).toBe('narrow');
    expect(getFraming(SIZES.phone[0])).toBe('narrow');
  });
});

describe('buildGraph', () => {
  it('is deterministic for a given size and seed', () => {
    expect(buildGraph(...SIZES.wide)).toEqual(buildGraph(...SIZES.wide));
  });

  it.each(Object.values(SIZES))('builds a bounded, hub-studded cloud (%i×%i)', (w, h) => {
    const g = buildGraph(w, h);
    expect(g.nodes.length).toBeGreaterThanOrEqual(45);
    expect(g.nodes.length).toBeLessThanOrEqual(80);
    const hubs = g.nodes.filter((n) => n.hub).length;
    expect(hubs).toBeGreaterThanOrEqual(3);
    expect(hubs / g.nodes.length).toBeLessThanOrEqual(0.12);
    for (const n of g.nodes) {
      expect(Math.abs(n.x)).toBeLessThanOrEqual(g.radii.x);
      expect(Math.abs(n.y)).toBeLessThanOrEqual(g.radii.y);
      expect(Math.abs(n.z)).toBeLessThanOrEqual(g.radii.z);
    }
  });

  it('wires a plexus: unique short edges, and no isolated node', () => {
    for (const [w, h] of Object.values(SIZES)) {
      const g = buildGraph(w, h);
      const keys = g.edges.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`);
      expect(new Set(keys).size).toBe(keys.length);
      g.edges.forEach(([a, b]) => {
        expect(a).not.toBe(b);
        // Either within reach, or the fallback link to a node's single nearest neighbour.
        const nearestOfA = Math.min(...g.nodes.map((_, j) => (j === a ? Infinity : dist(g, a, j))));
        const nearestOfB = Math.min(...g.nodes.map((_, j) => (j === b ? Infinity : dist(g, b, j))));
        const d = dist(g, a, b);
        expect(d <= g.maxDist || d === nearestOfA || d === nearestOfB).toBe(true);
      });
      g.neighbors.forEach((list) => expect(list.length).toBeGreaterThan(0));
    }
  });
});

describe('planCascade', () => {
  it('spreads causally along existing edges at a constant speed', () => {
    const g = buildGraph(...SIZES.wide);
    const rng = mulberry32(42);
    for (let run = 0; run < 40; run++) {
      const start = run * 10_000;
      const c = planCascade(g, rng, start);
      const firedAt = new Map(c.fires.map((f) => [f.node, f.at]));

      expect(g.nodes[c.fires[0].node].hub).toBe(true);
      expect(c.fires[0].at).toBe(start);
      expect(c.hops.length).toBeGreaterThan(0);
      for (const hop of c.hops) {
        expect(g.neighbors[hop.from]).toContain(hop.to);
        expect(hop.duration).toBeCloseTo(dist(g, hop.from, hop.to) * MS_PER_UNIT, 6);
        // A pulse leaves only after its source fired, and its target fires when it lands.
        expect(hop.start).toBeGreaterThanOrEqual(firedAt.get(hop.from)!);
        expect(firedAt.get(hop.to)).toBeCloseTo(hop.start + hop.duration, 6);
      }
      // Each node fires at most once per cascade.
      expect(new Set(c.fires.map((f) => f.node)).size).toBe(c.fires.length);
      expect(c.end).toBeGreaterThan(Math.max(...c.fires.map((f) => f.at)));
    }
  });
});
