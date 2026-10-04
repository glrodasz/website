import { describe, expect, it } from 'vitest';
import { buildTokenGraph, indexEdges } from '../../../tokens/graph-builder';
import { tokenUsages } from '../../../generated/token-usage';
import {
  COLLAPSE_AT,
  COLUMN_X,
  MIN_GROUP,
  ROW,
  collapseColumn,
  countCrossings,
  layoutRows,
  linkPath,
  orderColumns,
  type RowGroup,
} from './arrange';
import {
  MAP_COLUMNS,
  buildLineageModel,
  computeMapView,
  groupId,
  type MapColumn,
  type MapRow,
  type MapView,
} from './lineage';

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
  'Button.css': viewOf('ui::src/components/atoms/Button.css'),
  'Spacing.sm': viewOf('system::system tokens.Spacing.sm'),
  'Shark palette': viewOf(groupId('global', 'Colors.Support.Shark')),
  'Site namespace': viewOf(groupId('component', 'Site')),
};

function totalCrossings(v: MapView): number {
  return MAP_COLUMNS.slice(1).reduce(
    (n, column, i) => n + countCrossings(v.columns[MAP_COLUMNS[i]], v.columns[column], v.links),
    0,
  );
}

/** The same view with each column's rows rearranged. */
function rearranged(v: MapView, arrange: (rows: MapRow[]) => MapRow[]): MapView {
  const columns = { ...v.columns };
  for (const column of MAP_COLUMNS) columns[column] = arrange([...v.columns[column]]);
  return { ...v, columns };
}

function row(id: string, section: string | null, extra: Partial<MapRow> = {}): MapRow {
  return {
    id,
    column: 'system',
    kind: 'token',
    label: id,
    title: id,
    section,
    memberCount: 1,
    swatches: [],
    matches: 1,
    elsewhere: 0,
    isFocus: false,
    collapse: null,
    ...extra,
  };
}

describe('collapseColumn', () => {
  // Rows `a0…`, `b0…`, `c0…` belong to groups a, b, c.
  const groupOf = (r: MapRow): RowGroup => ({ id: r.id[0], label: r.id[0], title: r.id[0], section: null });
  const rowsOf = (sizes: Record<string, number>) =>
    Object.entries(sizes).flatMap(([g, n]) =>
      Array.from({ length: n }, (_, i) =>
        row(`${g}${i}`, g, { swatches: [`#00000${i % 10}`], elsewhere: 1 }),
      ),
    );

  it('leaves columns of up to COLLAPSE_AT rows alone', () => {
    const rows = rowsOf({ a: COLLAPSE_AT });
    expect(collapseColumn(rows, groupOf, new Set())).toBe(rows);
  });

  it('folds long columns into group rows, except groups below MIN_GROUP', () => {
    const rows = rowsOf({ a: 20, b: COLLAPSE_AT - 20, c: MIN_GROUP - 1 });
    const collapsed = collapseColumn(rows, groupOf, new Set());
    expect(collapsed.map((r) => r.id)).toEqual(['a', 'b', 'c0', 'c1']);
    expect(collapsed[0]).toMatchObject({
      kind: 'group',
      collapse: 'collapsed',
      toggleId: 'a',
      memberCount: 20,
      matches: 20,
      elsewhere: 20,
      column: 'system',
    });
    expect(collapsed[0].swatches).toHaveLength(4);
    expect(collapsed[2].collapse).toBeNull();
  });

  it('keeps the members of expanded groups, marked for folding back', () => {
    const collapsed = collapseColumn(rowsOf({ a: 20, b: 20 }), groupOf, new Set(['a']));
    expect(collapsed).toHaveLength(21);
    expect(collapsed[0]).toMatchObject({ id: 'a0', collapse: 'expanded', toggleId: 'a' });
    expect(collapsed[20]).toMatchObject({ id: 'b', collapse: 'collapsed' });
  });

  it('collapses a single namespace by property and re-points links to the group rows', () => {
    const button = VIEWS['button group'];
    expect(button.columns.component.length).toBeLessThanOrEqual(10);
    expect(button.columns.component.map((r) => r.id)).toContain(groupId('component', 'button.text-color'));

    const pairs = button.links.map((l) => `${l.left}\n${l.right}`);
    expect(new Set(pairs).size).toBe(pairs.length);
    const rowIds = new Set(MAP_COLUMNS.flatMap((c) => button.columns[c].map((r) => r.id)));
    expect(button.links.every((l) => rowIds.has(l.left) && rowIds.has(l.right))).toBe(true);

    const componentIds = new Set(button.columns.component.map((r) => r.id));
    const weight = button.links
      .filter((l) => componentIds.has(l.right))
      .reduce((n, l) => n + l.weight, 0);
    const aliases = graph.edges.filter(
      (e) => e.kind === 'component-system' && graph.nodesById.get(e.from)?.componentName === 'button',
    );
    expect(weight).toBe(aliases.length);
  });

  it('expands one group in place without touching the others', () => {
    const textColor = groupId('component', 'button.text-color');
    const expanded = viewOf(groupId('component', 'button'), [textColor]);
    const rows = expanded.columns.component.filter((r) => r.toggleId === textColor);
    expect(rows).toHaveLength(16);
    expect(rows.every((r) => r.collapse === 'expanded' && r.kind === 'token')).toBe(true);
    expect(expanded.columns.component).toHaveLength(VIEWS['button group'].columns.component.length + 15);
  });
});

describe('countCrossings', () => {
  it('counts pairs of links that swap order between the columns', () => {
    const left = [row('a', null), row('b', null)];
    const right = [row('x', null), row('y', null)];
    const link = (l: string, r: string) => ({ left: l, right: r, weight: 1 });
    expect(countCrossings(left, right, [link('a', 'x'), link('b', 'y')])).toBe(0);
    expect(countCrossings(left, right, [link('a', 'y'), link('b', 'x')])).toBe(1);
    expect(countCrossings(left, right, [link('a', 'x'), link('a', 'y')])).toBe(0);
  });
});

describe('orderColumns', () => {
  const hash = (s: string) => [...s].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7);
  const reverse = (rows: MapRow[]) => rows.reverse();
  const shuffle = (rows: MapRow[]) => rows.sort((a, b) => hash(a.id) - hash(b.id));

  it.each(Object.entries(VIEWS))('never adds crossings (%s)', (_, view) => {
    for (const input of [view, rearranged(view, reverse), rearranged(view, shuffle)]) {
      expect(totalCrossings(orderColumns(input))).toBeLessThanOrEqual(totalCrossings(input));
    }
  });

  it.each(Object.entries(VIEWS))('keeps sections contiguous and rows intact (%s)', (_, view) => {
    for (const input of [view, rearranged(view, reverse)]) {
      const ordered = orderColumns(input);
      for (const column of MAP_COLUMNS) {
        const rows = ordered.columns[column];
        expect(new Set(rows.map((r) => r.id))).toEqual(new Set(view.columns[column].map((r) => r.id)));
        const runs = rows.map((r) => r.section).filter((s, i, all) => s !== null && s !== all[i - 1]);
        expect(new Set(runs).size).toBe(runs.length);
      }
    }
  });

  it('keeps the focus column in its natural order', () => {
    const button = VIEWS['button group'];
    expect(orderColumns(button).columns.component).toEqual(button.columns.component);
  });

  it('untangles a shuffled overview', () => {
    const shuffled = rearranged(VIEWS.overview, shuffle);
    expect(totalCrossings(orderColumns(shuffled))).toBeLessThan(totalCrossings(shuffled));
  });
});

describe('layoutRows', () => {
  /** [top, height] of every row and heading in a column, top to bottom. */
  function boxesOf(view: MapView, column: MapColumn) {
    const { top, sections } = layoutRows(view);
    return [
      ...view.columns[column].map((r) => [top.get(r.id)!, ROW.h]),
      ...sections.filter((s) => s.column === column).map((s) => [s.top, ROW.sectionH]),
    ].sort((a, b) => a[0] - b[0]);
  }

  it.each(Object.entries(VIEWS))('stacks rows and headings without overlaps (%s)', (_, view) => {
    const { height } = layoutRows(view);
    for (const column of MAP_COLUMNS) {
      boxesOf(view, column).forEach(([y, h], i, boxes) => {
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y + h).toBeLessThanOrEqual(height);
        if (i > 0) expect(y).toBeGreaterThanOrEqual(boxes[i - 1][0] + boxes[i - 1][1]);
      });
    }
  });

  it('centres every column against the tallest', () => {
    const view = VIEWS['Spacing.sm'];
    const { height } = layoutRows(view);
    for (const column of MAP_COLUMNS) {
      const boxes = boxesOf(view, column);
      const [first] = boxes;
      const [lastTop, lastHeight] = boxes[boxes.length - 1];
      expect((first[0] + lastTop + lastHeight) / 2).toBeCloseTo(height / 2);
    }
  });
});

describe('linkPath', () => {
  it('runs from the right edge of the left row to the left edge of the right row', () => {
    const top = new Map([['a', 10], ['b', 50]]);
    const columnOf = (id: string): MapColumn => (id === 'a' ? 'system' : 'component');
    const path = linkPath({ left: 'a', right: 'b', weight: 1 }, top, columnOf);
    const y1 = 10 + ROW.h / 2;
    const y2 = 50 + ROW.h / 2;
    expect(path.startsWith(`M${COLUMN_X.system.right} ${y1}C`)).toBe(true);
    expect(path.endsWith(` ${COLUMN_X.component.left} ${y2}`)).toBe(true);
  });
});
