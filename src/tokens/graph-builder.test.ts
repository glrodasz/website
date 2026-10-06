import { describe, expect, it } from 'vitest';
import { buildTokenGraph } from './graph-builder';

const graph = buildTokenGraph();
const aliases = graph.edges
  .filter((e) => e.kind === 'component-system')
  .map((e) => ({ component: graph.nodesById.get(e.from)!, system: graph.nodesById.get(e.to)! }));

describe('buildTokenGraph component dark values', () => {
  it('gives a component token the dark value of the system token it aliases', () => {
    const themed = aliases.filter(({ system }) => system.resolvedValueDark !== undefined);
    expect(themed.length).toBeGreaterThan(0);
    for (const { component, system } of themed) {
      expect(component.resolvedValueDark).toBe(system.resolvedValueDark);
    }
  });

  it('leaves the dark value unset when the system token has no dark override', () => {
    const constant = aliases.filter(({ system }) => system.resolvedValueDark === undefined);
    expect(constant.length).toBeGreaterThan(0);
    for (const { component } of constant) expect(component.resolvedValueDark).toBeUndefined();
  });

  it('leaves raw component tokens without a dark value', () => {
    const aliased = new Set(aliases.map(({ component }) => component.id));
    const raw = graph.nodes.filter((n) => n.level === 'component' && !aliased.has(n.id));
    expect(raw.length).toBeGreaterThan(0);
    for (const node of raw) expect(node.resolvedValueDark).toBeUndefined();
  });
});
