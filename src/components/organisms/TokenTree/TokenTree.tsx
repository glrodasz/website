/**
 * Main 3D visualization canvas for the token reference tree.
 */

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import type { GraphNode, TokenGraph } from '../../../tokens/graph-builder';
import { computeLayout, computeGroupLabels, LAYER_X } from './layout';
import { TokenNodes } from './TokenNodes';
import { TokenEdges } from './TokenEdges';

export interface TokenTreeFilters {
  enabledComponents: Set<string>;
  enabledCategories: Set<string>;
  showSystemLight: boolean;
  showSystemDark: boolean;
}

interface TokenTreeProps {
  graph: TokenGraph;
  filters: TokenTreeFilters;
}

const LAYER_LABELS: Array<{ label: string; x: number; color: string }> = [
  { label: 'GLOBAL', x: LAYER_X.global, color: '#94a3b8' },
  { label: 'SYSTEM · LIGHT', x: LAYER_X['system-light'], color: '#f1f5f9' },
  { label: 'SYSTEM · DARK', x: LAYER_X['system-dark'], color: '#9ca3af' },
  { label: 'COMPONENT', x: LAYER_X.component, color: '#7dd3fc' },
];

export function TokenTree({ graph, filters }: TokenTreeProps) {
  const positions = useMemo(() => computeLayout(graph.nodes), [graph.nodes]);
  const groupLabels = useMemo(
    () => computeGroupLabels(graph.nodes, positions),
    [graph.nodes, positions],
  );

  const visibleNodes = useMemo(() => {
    return graph.nodes.filter((n) => {
      if (n.level === 'component') return filters.enabledComponents.has(n.componentName ?? '');
      if (n.level === 'system-light') return filters.showSystemLight && filters.enabledCategories.has(n.category);
      if (n.level === 'system-dark') return filters.showSystemDark && filters.enabledCategories.has(n.category);
      return filters.enabledCategories.has(n.category); // global
    });
  }, [graph.nodes, filters]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const hoveredId = hovered?.id ?? null;

  // Compute related edges + nodes for hover highlight.
  const { relatedNodeIds, highlightEdgeIndices } = useMemo(() => {
    if (!hoveredId) return { relatedNodeIds: null, highlightEdgeIndices: null };
    const nodeIds = new Set<string>([hoveredId]);
    const edgeIdxs = new Set<number>();
    graph.edges.forEach((e, i) => {
      if (e.from === hoveredId || e.to === hoveredId) {
        edgeIdxs.add(i);
        nodeIds.add(e.from);
        nodeIds.add(e.to);
      }
    });
    // Walk one additional hop so component→system→global is visible at once.
    const firstNeighbors = new Set(nodeIds);
    graph.edges.forEach((e, i) => {
      if (firstNeighbors.has(e.from) || firstNeighbors.has(e.to)) {
        edgeIdxs.add(i);
        nodeIds.add(e.from);
        nodeIds.add(e.to);
      }
    });
    return { relatedNodeIds: nodeIds, highlightEdgeIndices: edgeIdxs };
  }, [hoveredId, graph.edges]);

  return (
    <Canvas camera={{ position: [0, 6, 45], fov: 50 }} style={{ background: '#0b1018' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />

      {/* Layer titles */}
      {LAYER_LABELS.map((l) => (
        <Text
          key={l.label}
          position={[l.x, 18, 0]}
          fontSize={1.1}
          color={l.color}
          anchorX="center"
          anchorY="middle"
        >
          {l.label}
        </Text>
      ))}

      {/* Group labels */}
      {groupLabels.map((g) => (
        <Text
          key={`${g.level}-${g.key}`}
          position={[g.position.x, g.position.y + 0.4, g.position.z]}
          fontSize={0.32}
          color="#64748b"
          anchorX="center"
          anchorY="bottom"
        >
          {g.key}
        </Text>
      ))}

      <TokenEdges
        edges={graph.edges}
        positions={positions}
        visibleNodeIds={visibleNodeIds}
        highlightEdgeIndices={highlightEdgeIndices}
      />

      <TokenNodes
        nodes={visibleNodes}
        positions={positions}
        hoveredId={hoveredId}
        relatedIds={relatedNodeIds}
        onHover={setHovered}
      />

      {hovered && (
        <Html
          position={[
            positions.get(hovered.id)?.x ?? 0,
            (positions.get(hovered.id)?.y ?? 0) + 0.6,
            positions.get(hovered.id)?.z ?? 0,
          ]}
          distanceFactor={12}
          style={{ pointerEvents: 'none' }}
        >
          <div className="token-tree__tooltip">
            <div className="token-tree__tooltip-level">{hovered.level}</div>
            <div className="token-tree__tooltip-path">{hovered.path}</div>
            <div className="token-tree__tooltip-row">
              <span className="token-tree__tooltip-key">CSS var</span>
              <code>{hovered.cssVarName}</code>
            </div>
            <div className="token-tree__tooltip-row">
              <span className="token-tree__tooltip-key">Value</span>
              <span className="token-tree__tooltip-value">
                {hovered.type === 'color' && /^#[0-9a-fA-F]{6,8}$/.test(hovered.resolvedValue) && (
                  <span
                    className="token-tree__tooltip-swatch"
                    style={{ background: hovered.resolvedValue.slice(0, 7) }}
                  />
                )}
                <code>{hovered.resolvedValue}</code>
              </span>
            </div>
          </div>
        </Html>
      )}
    </Canvas>
  );
}
