import { describe, expect, it } from 'vitest';
import { buildTokenGraph, indexEdges } from '../../../tokens/graph-builder';
import { tokenUsages } from '../../../generated/token-usage';
import { LAYER_X, ROWS_PER_SLAB, layout3D, toSceneNodes } from './layout3d';
import { MAP_COLUMNS, buildLineageModel, computeMapView, groupId, type MapView } from './lineage';

const graph = buildTokenGraph();
const model = buildLineageModel(graph, tokenUsages);
const index = indexEdges(graph, 'light');
const filters = {
  search: '',
  enabledCategories: new Set(graph.categories),
  enabledComponents: new Set(graph.componentNames),
};
const viewOf = (focusId: string | null, expanded: string[] = []) =>
  computeMapView(model, index, 'light', filters, focusId, new Set(expanded));

const VIEWS: Record<string, MapView> = {
  overview: viewOf(null),
  'button group': viewOf(groupId('component', 'button')),
  'Shark palette': viewOf(groupId('global', 'Colors.Support.Shark')),
  'single token': viewOf('component::components tokens.button.background-color.primary.default'),
  'Spacing.sm with Site expanded': viewOf('system::system tokens.Spacing.sm', [groupId('component', 'Site')]),
};

const mean = (values: number[]) => values.reduce((s, v) => s + v, 0) / values.length;

describe('layout3D', () => {
  it.each(Object.entries(VIEWS))('places every row once, on its column’s layer (%s)', (_, view) => {
    const positions = layout3D(view);
    const keys = [...positions.values()].map((p) => p.join(','));
    expect(new Set(keys).size).toBe(keys.length);
    for (const column of MAP_COLUMNS) {
      for (const row of view.columns[column]) {
        const position = positions.get(row.id)!;
        expect(position.every(Number.isFinite)).toBe(true);
        expect(position[0]).toBe(LAYER_X[column]);
      }
    }
  });

  it.each(Object.entries(VIEWS))('wraps only long columns into centred slabs (%s)', (_, view) => {
    const positions = layout3D(view);
    for (const column of MAP_COLUMNS) {
      const rows = view.columns[column];
      if (rows.length === 0) continue;
      const points = rows.map((r) => positions.get(r.id)!);
      const slabs = new Set(points.map(([, , z]) => z));
      expect(slabs.size).toBe(rows.length > ROWS_PER_SLAB ? Math.ceil(rows.length / ROWS_PER_SLAB) : 1);
      expect(mean([...slabs])).toBeCloseTo(0);
      for (const z of slabs) expect(mean(points.filter((p) => p[2] === z).map(([, y]) => y))).toBeCloseTo(0);
    }
  });

  it('keeps every column in one slab until a group is expanded', () => {
    const slabsOf = (view: MapView) => {
      const positions = layout3D(view);
      return MAP_COLUMNS.map((c) => new Set(view.columns[c].map((r) => positions.get(r.id)![2])).size);
    };
    const overview = VIEWS.overview;
    for (const focusId of [null, ...MAP_COLUMNS.flatMap((c) => overview.columns[c].map((r) => r.id))]) {
      expect(Math.max(...slabsOf(viewOf(focusId))), String(focusId)).toBeLessThanOrEqual(1);
    }
    expect(slabsOf(VIEWS['Spacing.sm with Site expanded'])).toEqual([1, 1, 2, 1]);
  });

  it('follows the 2D order down each slab', () => {
    const positions = layout3D(VIEWS['button group']);
    const ys = VIEWS['button group'].columns.component.map((r) => positions.get(r.id)![1]);
    expect(ys).toEqual([...ys].sort((a, b) => b - a));
  });
});

describe('toSceneNodes', () => {
  it('colours color tokens with their opaque swatch and everything else by layer', () => {
    const nodes = toSceneNodes(VIEWS['button group']);
    expect(nodes).toHaveLength(MAP_COLUMNS.reduce((n, c) => n + VIEWS['button group'].columns[c].length, 0));
    for (const node of nodes) expect(node.color).toMatch(/^#[0-9a-fA-F]{6}$/);

    const shark = toSceneNodes(VIEWS['Shark palette']).filter((n) => n.column === 'global');
    const swatches = VIEWS['Shark palette'].columns.global.map((r) => r.swatches[0].slice(0, 7));
    expect(shark.map((n) => n.color)).toEqual(swatches);
    const groups = toSceneNodes(VIEWS.overview).filter((n) => n.column === 'global');
    expect(new Set(groups.map((n) => n.color)).size).toBe(1);
  });

  it('sizes tokens, groups by member count, and UI sources', () => {
    const nodes = toSceneNodes(VIEWS.overview);
    const rows = new Map(MAP_COLUMNS.flatMap((c) => VIEWS.overview.columns[c]).map((r) => [r.id, r]));
    for (const node of nodes) {
      if (node.kind === 'ui') expect(node.size).toBe(0.5);
      else expect(node.size).toBeCloseTo(Math.min(0.9, 0.32 + 0.12 * Math.sqrt(rows.get(node.id)!.memberCount)));
    }
    const token = toSceneNodes(VIEWS['single token']).find((n) => n.kind === 'token');
    expect(token?.size).toBe(0.32);
  });
});
