/**
 * Main 3D visualization canvas for the token reference tree.
 */

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import type { GraphNode, ThemeMode, TokenGraph } from '../../../tokens/graph-builder';
import { computeLayout, computeGroupLabels, LAYER_X } from './layout';
import { TokenNodes } from './TokenNodes';
import { TokenEdges } from './TokenEdges';

export interface TokenTreeFilters {
  enabledComponents: Set<string>;
  enabledCategories: Set<string>;
  theme: ThemeMode;
  focusedComponent: string | null;
}

interface TokenTreeProps {
  graph: TokenGraph;
  filters: TokenTreeFilters;
}

function layerLabelsFor(theme: ThemeMode) {
  return [
    { label: 'GLOBAL', x: LAYER_X.global, color: '#94a3b8' },
    {
      label: theme === 'dark' ? 'SYSTEM · DARK' : 'SYSTEM · LIGHT',
      x: LAYER_X.system,
      color: theme === 'dark' ? '#9ca3af' : '#f1f5f9',
    },
    { label: 'COMPONENT', x: LAYER_X.component, color: '#7dd3fc' },
  ];
}

export function TokenTree({ graph, filters }: TokenTreeProps) {
  const positions = useMemo(() => computeLayout(graph.nodes), [graph.nodes]);
  const groupLabels = useMemo(
    () => computeGroupLabels(graph.nodes, positions),
    [graph.nodes, positions],
  );

  const visibleNodes = useMemo(() => {
    return graph.nodes.filter((n) => {
      if (n.level === 'component') return filters.enabledComponents.has(n.componentName ?? '');
      return filters.enabledCategories.has(n.category); // global + system
    });
  }, [graph.nodes, filters]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const hoveredId = hovered?.id ?? null;

  /**
   * Walks the graph two hops from a seed set so that
   * component → system → global chains are highlighted at once.
   * Only follows edges visible in the current theme.
   */
  const expandChain = (seed: Set<string>): {
    nodeIds: Set<string>;
    edgeIdxs: Set<number>;
  } => {
    const nodeIds = new Set(seed);
    const edgeIdxs = new Set<number>();
    for (let hop = 0; hop < 2; hop++) {
      const frontier = new Set(nodeIds);
      graph.edges.forEach((e, i) => {
        if (e.mode !== 'both' && e.mode !== filters.theme) return;
        if (frontier.has(e.from) || frontier.has(e.to)) {
          edgeIdxs.add(i);
          nodeIds.add(e.from);
          nodeIds.add(e.to);
        }
      });
    }
    return { nodeIds, edgeIdxs };
  };

  const { seedIds, relatedNodeIds, highlightEdgeIndices } = useMemo(() => {
    if (hoveredId) {
      const seed = new Set([hoveredId]);
      const { nodeIds, edgeIdxs } = expandChain(seed);
      return { seedIds: seed, relatedNodeIds: nodeIds, highlightEdgeIndices: edgeIdxs };
    }
    if (filters.focusedComponent) {
      const seed = new Set(
        graph.nodes
          .filter((n) => n.level === 'component' && n.componentName === filters.focusedComponent)
          .map((n) => n.id),
      );
      if (seed.size === 0) return { seedIds: null, relatedNodeIds: null, highlightEdgeIndices: null };
      const { nodeIds, edgeIdxs } = expandChain(seed);
      return { seedIds: seed, relatedNodeIds: nodeIds, highlightEdgeIndices: edgeIdxs };
    }
    return { seedIds: null, relatedNodeIds: null, highlightEdgeIndices: null };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredId, filters.focusedComponent, filters.theme, graph.edges, graph.nodes]);

  const background = filters.theme === 'dark' ? '#0b1018' : '#f1f5f9';
  const layerLabels = layerLabelsFor(filters.theme);

  return (
    <Canvas camera={{ position: [0, 6, 45], fov: 50 }} style={{ background }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />

      {layerLabels.map((l) => (
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

      {groupLabels.map((g) => (
        <Text
          key={`${g.level}-${g.key}`}
          position={[g.position.x, g.position.y + 0.4, g.position.z]}
          fontSize={0.32}
          color={filters.theme === 'dark' ? '#64748b' : '#475569'}
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
        theme={filters.theme}
        highlightEdgeIndices={highlightEdgeIndices}
      />

      <TokenNodes
        nodes={visibleNodes}
        positions={positions}
        seedIds={seedIds}
        relatedIds={relatedNodeIds}
        theme={filters.theme}
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
          <HoverTooltip node={hovered} theme={filters.theme} />
        </Html>
      )}
    </Canvas>
  );
}

function HoverTooltip({ node, theme }: { node: GraphNode; theme: ThemeMode }) {
  const themedValue =
    theme === 'dark' && node.resolvedValueDark ? node.resolvedValueDark : node.resolvedValue;
  const hasDarkOverride = node.level === 'system' && node.resolvedValueDark !== undefined;

  return (
    <div className="token-tree__tooltip">
      <div className="token-tree__tooltip-level">
        {node.level}
        {hasDarkOverride ? ' · dark override' : ''}
      </div>
      <div className="token-tree__tooltip-path">{node.path}</div>
      <div className="token-tree__tooltip-row">
        <span className="token-tree__tooltip-key">CSS var</span>
        <code>{node.cssVarName}</code>
      </div>
      <div className="token-tree__tooltip-row">
        <span className="token-tree__tooltip-key">Value</span>
        <span className="token-tree__tooltip-value">
          {node.type === 'color' && /^#[0-9a-fA-F]{6,8}$/.test(themedValue) && (
            <span
              className="token-tree__tooltip-swatch"
              style={{ background: themedValue.slice(0, 7) }}
            />
          )}
          <code>{themedValue}</code>
        </span>
      </div>
      {hasDarkOverride && theme === 'light' && (
        <div className="token-tree__tooltip-row">
          <span className="token-tree__tooltip-key">Dark</span>
          <span className="token-tree__tooltip-value">
            {node.type === 'color' && /^#[0-9a-fA-F]{6,8}$/.test(node.resolvedValueDark!) && (
              <span
                className="token-tree__tooltip-swatch"
                style={{ background: node.resolvedValueDark!.slice(0, 7) }}
              />
            )}
            <code>{node.resolvedValueDark}</code>
          </span>
        </div>
      )}
    </div>
  );
}
