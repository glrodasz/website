/**
 * Layout algorithm for the token tree 3D graph.
 *
 * Four X-axis layers: global | system-light | system-dark | component.
 * Within each layer, nodes are grouped by category (component name for the
 * component layer), with categories stacked along Z and tokens stacked along Y.
 */

import type { GraphNode, NodeLevel } from '../../../tokens/graph-builder';

export interface NodePosition {
  x: number;
  y: number;
  z: number;
}

export const LAYER_X: Record<NodeLevel, number> = {
  'global': -26,
  'system-light': -9,
  'system-dark': 4,
  'component': 20,
};

const Y_STEP = 0.55;
const Z_STEP = 4.5;

export function computeLayout(nodes: GraphNode[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();

  // Bucket by (level, group-key) where group-key = category for global/system,
  // componentName for component.
  const byLevel = new Map<NodeLevel, Map<string, GraphNode[]>>();
  for (const level of ['global', 'system-light', 'system-dark', 'component'] as NodeLevel[]) {
    byLevel.set(level, new Map());
  }

  for (const node of nodes) {
    const groupKey =
      node.level === 'component' ? (node.componentName ?? 'misc') : node.category;
    const levelMap = byLevel.get(node.level)!;
    if (!levelMap.has(groupKey)) levelMap.set(groupKey, []);
    levelMap.get(groupKey)!.push(node);
  }

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

/**
 * Returns one label per (level, group) placed above the tallest member so the
 * visualization is legible without drawing text for every node.
 */
export function computeGroupLabels(
  nodes: GraphNode[],
  positions: Map<string, NodePosition>,
): GroupLabel[] {
  const labels = new Map<string, GroupLabel>();
  for (const node of nodes) {
    const groupKey =
      node.level === 'component' ? (node.componentName ?? 'misc') : node.category;
    const key = `${node.level}::${groupKey}`;
    const p = positions.get(node.id);
    if (!p) continue;
    const existing = labels.get(key);
    if (!existing || p.y > existing.position.y) {
      labels.set(key, {
        level: node.level,
        key: groupKey,
        position: { x: p.x, y: p.y + 1.2, z: p.z },
      });
    }
  }
  return [...labels.values()];
}
