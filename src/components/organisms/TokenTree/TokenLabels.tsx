import { Text } from '@react-three/drei';
import type { GraphNode, ThemeMode } from '../../../tokens/graph-builder';
import type { NodePosition } from './layout';

const LABEL_OFFSET_X = 0.45;

interface TokenLabelsProps {
  nodes: GraphNode[];
  positions: Map<string, NodePosition>;
  isolated: boolean;
  theme: ThemeMode;
}

export function TokenLabels({ nodes, positions, isolated, theme }: TokenLabelsProps) {
  const fontSize = isolated ? 0.3 : 0.16;
  const color = theme === 'dark' ? '#94a3b8' : '#475569';

  return (
    <group>
      {nodes.map((node) => {
        const p = positions.get(node.id);
        if (!p) return null;
        return (
          <Text
            key={node.id}
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
