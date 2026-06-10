import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import type { GraphNode, ThemeMode } from '../../../tokens/graph-builder';
import type { NodePosition } from './layout';

/**
 * Self-hosted font for all in-canvas labels. Without an explicit font,
 * troika-three-text resolves glyphs through cdn.jsdelivr.net at runtime;
 * if that CDN is blocked the <Text> suspends forever and React hides the
 * whole route.
 */
export const LABEL_FONT = '/fonts/inter-medium.ttf';

const LABEL_OFFSET_X = 0.45;

/**
 * Below this many visible nodes (i.e. when filters narrow the graph) every
 * node gets a label; above it only chain/selection labels render — per-node
 * troika Text meshes for the full ~1,400-node graph are slow and unreadable.
 */
const FULL_LABEL_THRESHOLD = 120;

interface TokenLabelsProps {
  nodes: GraphNode[];
  positions: Map<string, NodePosition>;
  relatedIds: Set<string> | null;
  selectedId: string | null;
  isolated: boolean;
  theme: ThemeMode;
}

export function TokenLabels({
  nodes,
  positions,
  relatedIds,
  selectedId,
  isolated,
  theme,
}: TokenLabelsProps) {
  const fontSize = isolated ? 0.3 : 0.16;
  const color = theme === 'dark' ? '#94a3b8' : '#475569';

  const labeledNodes = useMemo(() => {
    if (isolated || nodes.length <= FULL_LABEL_THRESHOLD) return nodes;
    return nodes.filter(
      (n) => n.id === selectedId || (relatedIds !== null && relatedIds.has(n.id)),
    );
  }, [nodes, isolated, relatedIds, selectedId]);

  return (
    <group>
      {labeledNodes.map((node) => {
        const p = positions.get(node.id);
        if (!p) return null;
        return (
          <Text
            key={node.id}
            font={LABEL_FONT}
            position={[p.x + LABEL_OFFSET_X, p.y, p.z]}
            fontSize={fontSize}
            color={color}
            anchorX="left"
            anchorY="middle"
            maxWidth={isolated ? 12 : 6}
          >
            {node.displayLabel}
          </Text>
        );
      })}
    </group>
  );
}
