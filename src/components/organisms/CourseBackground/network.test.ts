import { describe, expect, it } from 'vitest';
import { HOP_MS, WIDE_MIN_WIDTH, buildNetwork, getLayoutMode, mulberry32, planWave } from './network';

// Real card sizes: Courses featured card on desktop, Home half-width card, a phone-width card.
const SIZES = {
  wide: [1092, 547],
  compact: [558, 422],
  phone: [358, 290],
  tallPhone: [358, 820],
} as const;

describe('getLayoutMode', () => {
  it('uses the wide layout only when the card has a free column beside the copy', () => {
    expect(getLayoutMode(SIZES.wide[0])).toBe('wide');
    expect(getLayoutMode(WIDE_MIN_WIDTH)).toBe('wide');
    expect(getLayoutMode(WIDE_MIN_WIDTH - 1)).toBe('compact');
    expect(getLayoutMode(772)).toBe('compact'); // Home card on a tablet
    expect(getLayoutMode(SIZES.phone[0])).toBe('compact');
  });
});

describe('buildNetwork', () => {
  it('is deterministic for a given size and seed', () => {
    expect(buildNetwork(...SIZES.wide)).toEqual(buildNetwork(...SIZES.wide));
  });

  it('keeps the wide network right of the copy column and inside the card', () => {
    const net = buildNetwork(...SIZES.wide);
    expect(net.layers.length).toBeGreaterThanOrEqual(4);
    expect(net.layers.length).toBeLessThanOrEqual(6);
    for (const n of net.neurons) {
      expect(n.x).toBeGreaterThanOrEqual(600);
      expect(n.x).toBeLessThanOrEqual(SIZES.wide[0]);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(SIZES.wide[1]);
    }
  });

  it.each([SIZES.compact, SIZES.phone, SIZES.tallPhone])('tucks the compact network into the top-right corner (%i×%i)', (w, h) => {
    const net = buildNetwork(w, h);
    expect(net.mode).toBe('compact');
    expect(net.layers.length).toBeGreaterThanOrEqual(4);
    expect(net.fade.kind).toBe('radial');
    for (const n of net.neurons) {
      expect(n.x).toBeGreaterThanOrEqual(w * 0.45);
      expect(n.y).toBeLessThanOrEqual(Math.min(h * 0.5, w * 0.6));
    }
  });

  it('only connects adjacent layers, and leaves no neuron orphaned', () => {
    for (const [w, h] of Object.values(SIZES)) {
      const net = buildNetwork(w, h);
      const last = net.layers.length - 1;
      for (const s of net.synapses) {
        expect(net.neurons[s.b].layer).toBe(net.neurons[s.a].layer + 1);
      }
      net.neurons.forEach((n, i) => {
        if (n.layer > 0) expect(net.synapses.some((s) => s.b === i)).toBe(true);
      });
      net.neurons.forEach((n, i) => {
        if (n.layer < last) expect(net.outgoing[i].length).toBeGreaterThan(0);
      });
    }
  });
});

describe('planWave', () => {
  it('propagates causally along existing synapses', () => {
    const net = buildNetwork(...SIZES.wide);
    const rng = mulberry32(42);
    for (let run = 0; run < 25; run++) {
      const start = run * 5000;
      const wave = planWave(net, rng, start);
      const firedAt = new Map(wave.fires.map((f) => [f.neuron, f.at]));

      expect(wave.fires.filter((f) => net.neurons[f.neuron].layer === 0).length).toBeGreaterThan(0);
      for (const hop of wave.hops) {
        expect(net.outgoing[hop.from]).toContain(hop.to);
        expect(hop.duration).toBe(HOP_MS);
        // A signal leaves only after its source fired, and its target fires when it lands.
        expect(hop.start).toBeGreaterThanOrEqual(firedAt.get(hop.from)!);
        expect(firedAt.get(hop.to)!).toBeGreaterThanOrEqual(hop.start + hop.duration);
      }
      expect(wave.end).toBeGreaterThan(Math.max(...wave.fires.map((f) => f.at)));
    }
  });

  it.each(Object.values(SIZES))('always reaches the output layer (%i×%i)', (w, h) => {
    const net = buildNetwork(w, h);
    const rng = mulberry32(9);
    const last = net.layers.length - 1;
    for (let run = 0; run < 50; run++) {
      const wave = planWave(net, rng, 0);
      expect(wave.fires.some((f) => net.neurons[f.neuron].layer === last)).toBe(true);
    }
  });
});
