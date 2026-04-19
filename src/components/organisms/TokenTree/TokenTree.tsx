/**
 * Main 3D visualization canvas for the token reference tree.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { GraphNode, ThemeMode, TokenGraph } from '../../../tokens/graph-builder';
import { computeLayout, computeLayout2D, computeIsolatedLayout, computeGroupLabels, LAYER_X } from './layout';
import { TokenNodes } from './TokenNodes';
import { TokenEdges } from './TokenEdges';
import { TokenLabels } from './TokenLabels';

export interface TokenTreeFilters {
  enabledComponents: Set<string>;
  enabledCategories: Set<string>;
  theme: ThemeMode;
  focusedComponent: string | null;
  viewMode: '2d' | '3d';
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
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const hoveredId = hovered?.id ?? null;

  /**
   * Walks outgoing references from a seed set (consumer → target).
   * Component → system → global is a two-hop forward walk; we deliberately do
   * NOT walk edges backward so that focusing a single component does not drag
   * in every other component that happens to share a system token.
   *
   * Only follows edges visible in the current theme.
   */
  const expandChain = (seed: Set<string>): {
    nodeIds: Set<string>;
    edgeIdxs: Set<number>;
  } => {
    const nodeIds = new Set(seed);
    const edgeIdxs = new Set<number>();
    let frontier: Set<string> = new Set(seed);
    for (let hop = 0; hop < 2; hop++) {
      const nextFrontier = new Set<string>();
      graph.edges.forEach((e, i) => {
        if (e.mode !== 'both' && e.mode !== filters.theme) return;
        if (frontier.has(e.from)) {
          edgeIdxs.add(i);
          if (!nodeIds.has(e.to)) {
            nodeIds.add(e.to);
            nextFrontier.add(e.to);
          }
        }
      });
      frontier = nextFrontier;
      if (frontier.size === 0) break;
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

  // Isolate mode: component is focused and chain has nodes.
  const chainNodes = useMemo(
    () => (relatedNodeIds ? graph.nodes.filter((n) => relatedNodeIds.has(n.id)) : []),
    [graph.nodes, relatedNodeIds],
  );
  const isolated = filters.focusedComponent !== null && chainNodes.length > 0;

  const positions = useMemo(() => {
    if (isolated) return computeIsolatedLayout(chainNodes);
    if (filters.viewMode === '2d') return computeLayout2D(graph.nodes);
    return computeLayout(graph.nodes);
  }, [graph.nodes, filters.viewMode, isolated, chainNodes]);

  const visibleNodes = useMemo(() => {
    if (isolated) return chainNodes;
    return graph.nodes.filter((n) => {
      if (n.level === 'component') return filters.enabledComponents.has(n.componentName ?? '');
      return filters.enabledCategories.has(n.category);
    });
  }, [graph.nodes, filters, isolated, chainNodes]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const groupLabels = useMemo(
    () => computeGroupLabels(visibleNodes, positions),
    [visibleNodes, positions],
  );

  // Reset camera when viewMode changes or when entering/leaving isolate mode.
  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    const cam = ctrl.object as THREE.PerspectiveCamera;
    if (filters.viewMode === '2d') {
      cam.position.set(0, 0, 80);
    } else {
      cam.position.set(0, 6, 45);
    }
    cam.lookAt(0, 0, 0);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.viewMode, isolated]);

  const background = filters.theme === 'dark' ? '#0b1018' : '#f1f5f9';
  const layerLabels = layerLabelsFor(filters.theme);

  return (
    <div className="token-tree">
      <Canvas camera={{ position: [0, 0, 80], fov: 50 }} style={{ background }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableRotate={filters.viewMode === '3d'}
      />

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
        isolated={isolated}
      />

      <TokenNodes
        nodes={visibleNodes}
        positions={positions}
        seedIds={isolated ? null : seedIds}
        relatedIds={isolated ? null : relatedNodeIds}
        theme={filters.theme}
        onHover={setHovered}
      />

      <TokenLabels
        nodes={visibleNodes}
        positions={positions}
        isolated={isolated}
        theme={filters.theme}
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
      <button
        type="button"
        className="token-tree__recenter"
        onClick={() => controlsRef.current?.reset()}
        aria-label="Recenter camera"
        title="Recenter camera"
      >
        ⌖
      </button>
    </div>
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
