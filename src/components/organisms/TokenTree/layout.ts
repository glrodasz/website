/**
 * Layout algorithm for the token tree 3D graph.
 *
 * Three X-axis layers: global | system | component.
 * Within each layer, nodes are grouped by type (colors, spacing, border-radius,
 * background-color, etc.) with gaps between groups.
 */

import type { GraphNode, NodeLevel } from '../../../tokens/graph-builder';

export interface NodePosition {
  x: number;
  y: number;
  z: number;
}

export const LAYER_X: Record<NodeLevel, number> = {
  'global': -22,
  'system': 0,
  'component': 22,
};

/**
 * Returns a semantic type key used to group tokens within each layer.
 * Global/System: category (2nd path segment — "colors", "spacing", etc.)
 * Component: property type (3rd path segment — "background-color", "text-color", etc.)
 */
export function tokenGroupKey(node: GraphNode): string {
  if (node.level === 'component') {
    const parts = node.path.split('.');
    return parts[2] ?? 'other';
  }
  return node.category;
}

function bucketByLevelAndGroup(nodes: GraphNode[]): Map<NodeLevel, Map<string, GraphNode[]>> {
  const byLevel = new Map<NodeLevel, Map<string, GraphNode[]>>();
  for (const level of ['global', 'system', 'component'] as NodeLevel[]) {
    byLevel.set(level, new Map());
  }
  for (const node of nodes) {
    const key = tokenGroupKey(node);
    const levelMap = byLevel.get(node.level)!;
    if (!levelMap.has(key)) levelMap.set(key, []);
    levelMap.get(key)!.push(node);
  }
  return byLevel;
}

const Y_STEP = 0.55;
const Z_STEP = 4.5;

export function computeLayout(nodes: GraphNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const byLevel = bucketByLevelAndGroup(nodes);

  for (const [level, groups] of byLevel.entries()) {
    const groupKeys = [...groups.keys()].sort();
    const totalGroups = groupKeys.length;
    const zOffset = ((totalGroups - 1) * Z_STEP) / 2;

    groupKeys.forEach((groupKey, gi) => {
      const members = groups.get(groupKey)!;
      members.sort((a, b) => a.path.localeCompare(b.path));
      const totalMembers = members.length;
      const yOffset = ((totalMembers - 1) * Y_STEP) / 2;

      members.forEach((node, mi) => {
        positions.set(node.id, {
          x: LAYER_X[level],
          y: mi * Y_STEP - yOffset,
          z: gi * Z_STEP - zOffset,
        });
      });
    });
  }

  return positions;
}

export interface GroupLabel {
  level: NodeLevel;
  key: string;
  position: NodePosition;
}

const Y_STEP_2D = 0.55;
const CATEGORY_GAP_2D = 1.8;

/**
 * 2D layout: all nodes in the X-Y plane (Z=0). Type groups are stacked
 * vertically with a gap between them so the graph reads clearly straight-on.
 */
export function computeLayout2D(nodes: GraphNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const byLevel = bucketByLevelAndGroup(nodes);

  for (const [level, groups] of byLevel.entries()) {
    const groupKeys = [...groups.keys()].sort();

    let totalHeight = 0;
    groupKeys.forEach((key, gi) => {
      totalHeight += groups.get(key)!.length * Y_STEP_2D;
      if (gi < groupKeys.length - 1) totalHeight += CATEGORY_GAP_2D;
    });

    let currentY = totalHeight / 2;

    groupKeys.forEach((groupKey, gi) => {
      const members = groups.get(groupKey)!;
      members.sort((a, b) => a.path.localeCompare(b.path));
      members.forEach((node, mi) => {
        positions.set(node.id, {
          x: LAYER_X[level],
          y: currentY - mi * Y_STEP_2D,
          z: 0,
        });
      });
      currentY -= members.length * Y_STEP_2D;
      if (gi < groupKeys.length - 1) currentY -= CATEGORY_GAP_2D;
    });
  }

  return positions;
}

const Y_STEP_ISOLATED = 1.4;
const ISOLATED_GROUP_GAP = 2.4;

/**
 * Isolated layout: used when a single component is focused. Chain nodes
 * are grouped by token type within each layer, with generous spacing.
 */
export function computeIsolatedLayout(chainNodes: GraphNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const byLevel = bucketByLevelAndGroup(chainNodes);

  for (const [level, groups] of byLevel.entries()) {
    const groupKeys = [...groups.keys()].sort();

    let totalHeight = 0;
    groupKeys.forEach((key, gi) => {
      totalHeight += groups.get(key)!.length * Y_STEP_ISOLATED;
      if (gi < groupKeys.length - 1) totalHeight += ISOLATED_GROUP_GAP;
    });

    let currentY = totalHeight / 2;

    groupKeys.forEach((groupKey, gi) => {
      const members = groups.get(groupKey)!;
      members.sort((a, b) => a.path.localeCompare(b.path));
      members.forEach((node, mi) => {
        positions.set(node.id, {
          x: LAYER_X[level],
          y: currentY - mi * Y_STEP_ISOLATED,
          z: 0,
        });
      });
      currentY -= members.length * Y_STEP_ISOLATED;
      if (gi < groupKeys.length - 1) currentY -= ISOLATED_GROUP_GAP;
    });
  }

  return positions;
}

/**
 * Returns one label per (level, group) placed above the tallest member.
 */
export function computeGroupLabels(
  nodes: GraphNode[],
  positions: Map<string, NodePosition>,
): GroupLabel[] {
  const labels = new Map<string, GroupLabel>();
  for (const node of nodes) {
    const gk = tokenGroupKey(node);
    const key = `${node.level}::${gk}`;
    const p = positions.get(node.id);
    if (!p) continue;
    const existing = labels.get(key);
    if (!existing || p.y > existing.position.y) {
      labels.set(key, {
        level: node.level,
        key: gk,
        position: { x: p.x, y: p.y + 1.2, z: p.z },
      });
    }
  }
  return [...labels.values()];
}
