/**
 * 3D positions for the token map: one layer per column along x, rows stacked
 * down y in the same order as the 2D map, and long columns wrapped into slabs
 * along z. Pure — the three.js scene only reads these numbers.
 */

import { COLLAPSE_AT } from './arrange';
import { MAP_COLUMNS, toOpaqueHex, type MapColumn, type MapRow, type MapView } from './lineage';

export const LAYER_GAP = 14;
export const ROW_GAP = 1.4;
/**
 * A single slab leaves every node a free side for its label; next to a second
 * slab, one of the two has none. Every overview column, and every focus
 * column once the 2D map has collapsed it, fits one slab, so only an
 * expanded group wraps.
 */
export const ROWS_PER_SLAB = COLLAPSE_AT;
export const SLAB_GAP = 3.2;

export const LAYER_X: Record<MapColumn, number> = {
  global: -1.5 * LAYER_GAP,
  system: -0.5 * LAYER_GAP,
  component: 0.5 * LAYER_GAP,
  ui: 1.5 * LAYER_GAP,
};

/** Level hues of the 2D map, with system toned down from its near-white. */
export const LAYER_COLORS: Record<MapColumn, string> = {
  global: '#94a3b8',
  system: '#cbd5e1',
  component: '#7dd3fc',
  ui: '#fbbf24',
};

export type Vec3 = [number, number, number];

/**
 * Columns longer than ROWS_PER_SLAB split into evenly filled slabs, the first
 * nearest the camera; every slab is centred on y and the slabs on z.
 */
export function layout3D(v: MapView): Map<string, Vec3> {
  const positions = new Map<string, Vec3>();
  for (const column of MAP_COLUMNS) {
    const rows = v.columns[column];
    const slabs = Math.ceil(rows.length / ROWS_PER_SLAB);
    const perSlab = Math.ceil(rows.length / slabs);
    rows.forEach((row, i) => {
      const slab = Math.floor(i / perSlab);
      const slabRows = Math.min(perSlab, rows.length - slab * perSlab);
      const y = ((slabRows - 1) / 2 - (i % perSlab)) * ROW_GAP;
      const z = ((slabs - 1) / 2 - slab) * SLAB_GAP;
      positions.set(row.id, [LAYER_X[column], y, z]);
    });
  }
  return positions;
}

export interface SceneNode {
  id: string;
  column: MapColumn;
  kind: MapRow['kind'];
  label: string;
  /** `#RRGGBB` */
  color: string;
  size: number;
  position: Vec3;
}

function colorOf(row: MapRow): string {
  const swatch = row.kind === 'token' ? row.swatches[0] : undefined;
  return (swatch && toOpaqueHex(swatch)) || LAYER_COLORS[row.column];
}

function sizeOf(row: MapRow): number {
  if (row.kind === 'ui') return 0.5;
  if (row.kind === 'group') return Math.min(0.9, 0.32 + 0.12 * Math.sqrt(row.memberCount));
  return 0.32;
}

export function toSceneNodes(v: MapView): SceneNode[] {
  const positions = layout3D(v);
  return MAP_COLUMNS.flatMap((column) =>
    v.columns[column].map((row) => ({
      id: row.id,
      column,
      kind: row.kind,
      label: row.label,
      color: colorOf(row),
      size: sizeOf(row),
      position: positions.get(row.id)!,
    })),
  );
}
