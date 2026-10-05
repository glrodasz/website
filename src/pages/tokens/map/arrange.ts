/**
 * Arrangement of a token map view: folding rows into group rows, ordering each
 * column to cut down edge crossings, and the 2D geometry of rows and links.
 *
 * Positions come from constants rather than DOM measurement, so the 2D
 * renderer never has to measure and re-render, and the 3D layers can follow
 * the same row order. Pure — no DOM, no three.
 */

import type { MapLink, MapRow, MapView } from './lineage';

export type MapColumn = 'global' | 'system' | 'component' | 'ui';
/** Columns from left to right: tokens flow from global values to the CSS that uses them. */
export const MAP_COLUMNS: readonly MapColumn[] = ['global', 'system', 'component', 'ui'];

/** A column with more rows than this collapses into group rows. */
export const COLLAPSE_AT = 30;
/** Groups smaller than this are never collapsed. */
export const MIN_GROUP = 3;
const MAX_SWATCHES = 4;

/** The group row that stands for a set of member rows. */
export interface RowGroup {
  id: string;
  label: string;
  title: string;
  section: string;
}

interface Bucket {
  group: RowGroup;
  members: MapRow[];
}

/** Rows split into blocks by `key`, in order of first appearance. */
function blocksBy(rows: readonly MapRow[], key: (r: MapRow) => string): MapRow[][] {
  const blocks = new Map<string, MapRow[]>();
  for (const row of rows) {
    const k = key(row);
    const block = blocks.get(k);
    if (block) block.push(row);
    else blocks.set(k, [row]);
  }
  return [...blocks.values()];
}

/** Buckets rows by group, in order of first appearance. */
function bucket(rows: readonly MapRow[], groupOf: (r: MapRow) => RowGroup): Bucket[] {
  return blocksBy(rows, (r) => groupOf(r).id).map((members) => ({
    group: groupOf(members[0]),
    members,
  }));
}

/** Up to `count` items spread evenly across the list, so a palette shows its range. */
function spread<T>(items: readonly T[], count: number): T[] {
  if (items.length <= count) return [...items];
  return Array.from({ length: count }, (_, i) => items[Math.floor((i * items.length) / count)]);
}

function mergeRows({ group, members }: Bucket): MapRow {
  const sum = (key: 'memberCount' | 'matches') => members.reduce((total, r) => total + r[key], 0);
  // Members share consumers (most CSS files use several of a group's tokens); count each once.
  const unseen = [...new Set(members.flatMap((r) => r.unseen))];
  return {
    ...group,
    column: members[0].column,
    kind: 'group',
    memberCount: sum('memberCount'),
    swatches: spread([...new Set(members.flatMap((r) => r.swatches))], MAX_SWATCHES),
    matches: sum('matches'),
    elsewhere: unseen.length,
    unseen,
    isFocus: members.some((r) => r.isFocus),
    collapse: null,
  };
}

/**
 * Rows reordered so each section is one run: top-level groups share a
 * heading, but other sections can sit between them.
 */
function sectionRuns(rows: readonly MapRow[]): MapRow[] {
  return blocksBy(rows, (r) => r.section).flat();
}

/** Folds every row into its group row (the overview). */
export function groupColumn(rows: readonly MapRow[], groupOf: (r: MapRow) => RowGroup): MapRow[] {
  return sectionRuns(bucket(rows, groupOf).map(mergeRows));
}

/**
 * Collapses a long column into group rows. Groups in `expanded` keep their
 * members, marked so the renderer can fold them back with `toggleId`.
 */
export function collapseColumn(
  rows: MapRow[],
  groupOf: (r: MapRow) => RowGroup,
  expanded: ReadonlySet<string>,
): MapRow[] {
  if (rows.length <= COLLAPSE_AT) return rows;
  const collapsed = bucket(rows, groupOf).flatMap((b): MapRow[] => {
    const toggleId = b.group.id;
    if (b.members.length < MIN_GROUP) return b.members;
    if (expanded.has(toggleId)) return b.members.map((r) => ({ ...r, collapse: 'expanded', toggleId }));
    return [{ ...mergeRows(b), collapse: 'collapsed', toggleId }];
  });
  // Small and expanded top-level groups stay under their own heading, between collapsed ones.
  return sectionRuns(collapsed);
}

function indexById(rows: readonly MapRow[]): Map<string, number> {
  return new Map(rows.map((r, i) => [r.id, i]));
}

/** Pairs of links between two adjacent columns (`left` sits left of `right`) that cross. */
export function countCrossings(left: MapRow[], right: MapRow[], links: MapLink[]): number {
  const leftIndex = indexById(left);
  const rightIndex = indexById(right);
  const ends: [number, number][] = [];
  for (const l of links) {
    const a = leftIndex.get(l.left);
    const b = rightIndex.get(l.right);
    if (a !== undefined && b !== undefined) ends.push([a, b]);
  }
  let crossings = 0;
  for (let i = 0; i < ends.length; i++) {
    for (let j = i + 1; j < ends.length; j++) {
      if ((ends[i][0] - ends[j][0]) * (ends[i][1] - ends[j][1]) < 0) crossings++;
    }
  }
  return crossings;
}

/**
 * Sorts rows by the weighted mean position of their neighbours in `anchor`.
 * Sections, and the members of an expanded group inside them, move as
 * blocks so neither is ever split; with `keepSectionOrder` sections stay
 * where they are and only their rows move. Rows without links keep their
 * original index, scaled to the anchor's length.
 */
function sortByBarycenter(
  rows: MapRow[],
  anchor: MapRow[],
  links: MapLink[],
  keepSectionOrder: boolean,
): MapRow[] {
  const anchorIndex = indexById(anchor);
  const scale = anchor.length / rows.length;
  const centerOf = new Map<string, number>();
  rows.forEach((row, i) => {
    let total = 0;
    let weight = 0;
    for (const l of links) {
      const other = l.left === row.id ? l.right : l.right === row.id ? l.left : undefined;
      const j = other === undefined ? undefined : anchorIndex.get(other);
      if (j === undefined) continue;
      total += j * l.weight;
      weight += l.weight;
    }
    centerOf.set(row.id, weight > 0 ? total / weight : i * scale);
  });

  const center = (r: MapRow) => centerOf.get(r.id) ?? 0;
  const mean = (block: MapRow[]) => block.reduce((s, r) => s + center(r), 0) / block.length;
  const byCenter = (block: MapRow[]) => block.sort((a, b) => center(a) - center(b));
  const byMean = (blocks: MapRow[][]) => blocks.sort((a, b) => mean(a) - mean(b));
  // Members of an expanded group share its toggleId; every other row moves alone.
  const sections = blocksBy(rows, (r) => r.section).map((section) =>
    byMean(blocksBy(section, (r) => r.toggleId ?? r.id).map(byCenter)).flat(),
  );
  return (keepSectionOrder ? sections : byMean(sections)).flat();
}

/** Which column to sort against which neighbour, in sweep order. */
function sweepPlan(v: MapView): [MapColumn, MapColumn][] {
  const focus = MAP_COLUMNS.findIndex((c) => v.columns[c].some((r) => r.isFocus));
  // Overview: system and UI keep their natural order; their neighbours follow them.
  if (focus < 0) return [['global', 'system'], ['component', 'ui']];
  const plan: [MapColumn, MapColumn][] = [];
  for (let i = focus + 1; i < MAP_COLUMNS.length; i++) plan.push([MAP_COLUMNS[i], MAP_COLUMNS[i - 1]]);
  for (let i = focus - 1; i >= 0; i--) plan.push([MAP_COLUMNS[i], MAP_COLUMNS[i + 1]]);
  return plan;
}

/**
 * Orders the rows of each column to reduce edge crossings: outward from the
 * focus column (which keeps its natural order), or against the system and UI
 * columns in the overview. UI tiers keep their atomic order; only the files
 * inside a tier move. A step that would add crossings is skipped, so the
 * result never has more crossings than the order it was given.
 */
export function orderColumns(v: MapView): MapView {
  const columns = { ...v.columns };
  const crossingsAround = (column: MapColumn, rows: MapRow[]) => {
    const i = MAP_COLUMNS.indexOf(column);
    const left = MAP_COLUMNS[i - 1];
    const right = MAP_COLUMNS[i + 1];
    return (
      (left ? countCrossings(columns[left], rows, v.links) : 0) +
      (right ? countCrossings(rows, columns[right], v.links) : 0)
    );
  };
  for (const [column, anchor] of sweepPlan(v)) {
    if (columns[column].length < 2) continue;
    const sorted = sortByBarycenter(columns[column], columns[anchor], v.links, column === 'ui');
    if (crossingsAround(column, sorted) <= crossingsAround(column, columns[column])) {
      columns[column] = sorted;
    }
  }
  return { ...v, columns };
}

/** Row geometry in px. */
export const ROW = { h: 28, gap: 4, sectionH: 22, sectionGap: 10, padTop: 8 } as const;

/** Horizontal extent of each column, in % of the map width. */
export const COLUMN_X: Record<MapColumn, { left: number; right: number }> = {
  global: { left: 0, right: 19 },
  system: { left: 27, right: 46 },
  component: { left: 54, right: 73 },
  ui: { left: 81, right: 100 },
};

export interface SectionHeading {
  column: MapColumn;
  label: string;
  top: number;
  /** The first row under the heading, so the heading can precede it in reading order. */
  rowId: string;
}

export interface RowLayout {
  top: ReadonlyMap<string, number>;
  sections: SectionHeading[];
  height: number;
}

/** Stacks one column from y = 0: a heading where a section starts, a wider gap between sections. */
function stackColumn(column: MapColumn, rows: readonly MapRow[]) {
  const top = new Map<string, number>();
  const sections: SectionHeading[] = [];
  let y = ROW.padTop;
  let previous: MapRow | undefined;
  for (const row of rows) {
    if (previous) y += previous.section === row.section ? ROW.gap : ROW.gap + ROW.sectionGap;
    if (row.section !== previous?.section) {
      sections.push({ column, label: row.section, top: y, rowId: row.id });
      y += ROW.sectionH;
    }
    top.set(row.id, y);
    y += ROW.h;
    previous = row;
  }
  return { top, sections, height: y + ROW.padTop };
}

/**
 * Pixel tops of every row and section heading. On a focus, shorter columns
 * are centred against the tallest so a short focus column sits level with
 * its fan-out; on the overview every column starts at the top.
 */
export function layoutRows(v: MapView): RowLayout {
  const stacks = MAP_COLUMNS.map((column) => stackColumn(column, v.columns[column]));
  const height = Math.max(...stacks.map((s) => s.height));
  const top = new Map<string, number>();
  const sections: SectionHeading[] = [];
  for (const stack of stacks) {
    const offset = v.focusId === null ? 0 : (height - stack.height) / 2;
    for (const [id, y] of stack.top) top.set(id, y + offset);
    for (const s of stack.sections) sections.push({ ...s, top: s.top + offset });
  }
  return { top, sections, height };
}

/** SVG path for a link, in viewBox units: x in % of the width (0–100), y in px. */
export function linkPath(
  l: MapLink,
  top: ReadonlyMap<string, number>,
  columnOf: (id: string) => MapColumn,
): string {
  const x1 = COLUMN_X[columnOf(l.left)].right;
  const x2 = COLUMN_X[columnOf(l.right)].left;
  const y1 = (top.get(l.left) ?? 0) + ROW.h / 2;
  const y2 = (top.get(l.right) ?? 0) + ROW.h / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
}
