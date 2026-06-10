/**
 * Main 3D visualization canvas for the token reference tree.
 */

import { type ComponentRef, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import type { GraphNode, ThemeMode, TokenGraph } from '../../../tokens/graph-builder';
import { computeLayout, computeLayout2D, computeIsolatedLayout, computeGroupLabels, LAYER_X } from './layout';
import { TokenNodes } from './TokenNodes';
import { TokenEdges } from './TokenEdges';
import { TokenLabels, LABEL_FONT } from './TokenLabels';

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
  selectedId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
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

const LEVEL_LEGEND: { label: string; color: string }[] = [
  { label: 'Global', color: '#9aa0a6' },
  { label: 'System', color: '#cbd5e1' },
  { label: 'Component', color: '#7dd3fc' },
];

export function TokenTree({ graph, filters, selectedId, onSelectNode }: TokenTreeProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hoveredId = hovered?.id ?? null;

  const { coarsePointer, hoverEnabled } = useMemo(
    () => ({
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
      hoverEnabled: window.matchMedia('(hover: hover)').matches,
    }),
    [],
  );

  const handleSelect = (node: GraphNode | null) => {
    if (node) setHasInteracted(true);
    onSelectNode(node);
  };  /**
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
    if (selectedId && graph.nodesById.has(selectedId)) {
      const seed = new Set([selectedId]);
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
  }, [hoveredId, selectedId, filters.focusedComponent, filters.theme, graph.edges, graph.nodes]);

  // Isolate mode: component is focused and chain has nodes.
  const focusChain = useMemo(() => {
    if (!filters.focusedComponent) return [];
    const seed = new Set(
      graph.nodes
        .filter((n) => n.level === 'component' && n.componentName === filters.focusedComponent)
        .map((n) => n.id),
    );
    if (seed.size === 0) return [];
    const { nodeIds } = expandChain(seed);
    return graph.nodes.filter((n) => nodeIds.has(n.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph.nodes, graph.edges, filters.focusedComponent, filters.theme]);

  const isolated = filters.focusedComponent !== null && focusChain.length > 0;

  const positions = useMemo(() => {
    if (isolated) return computeIsolatedLayout(focusChain);
    if (filters.viewMode === '2d') return computeLayout2D(graph.nodes);
    return computeLayout(graph.nodes);
  }, [graph.nodes, filters.viewMode, isolated, focusChain]);

  const visibleNodes = useMemo(() => {
    if (isolated) return focusChain;
    return graph.nodes.filter((n) => {
      if (n.level === 'component') return filters.enabledComponents.has(n.componentName ?? '');
      return filters.enabledCategories.has(n.category);
    });
  }, [graph.nodes, filters, isolated, focusChain]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  // If filters hide the selected node, drop the selection.
  useEffect(() => {
    if (selectedId && !visibleNodeIds.has(selectedId)) onSelectNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, visibleNodeIds]);

  const groupLabels = useMemo(
    () => computeGroupLabels(visibleNodes, positions, isolated ? 'property' : 'component'),
    [visibleNodes, positions, isolated],
  );

  // Reset camera when viewMode changes or when entering/leaving isolate mode.
  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;
    const cam = ctrl.object as THREE.PerspectiveCamera;
    // Pull back further on narrow screens so all three layers fit a
    // portrait phone instead of showing only the gap between columns.
    const distanceScale = window.innerWidth < 600 ? 2 : 1;
    if (filters.viewMode === '2d') {
      cam.position.set(0, 0, 80 * distanceScale);
    } else {
      cam.position.set(0, 6, 45 * distanceScale);
    }
    cam.lookAt(0, 0, 0);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  }, [filters.viewMode, isolated]);

  const background = filters.theme === 'dark' ? '#0b1018' : '#f1f5f9';
  const layerLabels = layerLabelsFor(filters.theme);

  return (
    <div
      className="token-tree"
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 80], fov: 50 }}
        style={{ background }}
        onPointerMissed={(e) => {
          // Ignore misses that conclude an orbit drag — only a true tap on
          // empty canvas clears the selection.
          const down = pointerDownPos.current;
          if (down) {
            const dist = Math.hypot(e.clientX - down.x, e.clientY - down.y);
            if (dist > 6) return;
          }
          onSelectNode(null);
        }}
      >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableRotate={filters.viewMode === '3d'}
      />

      {/* Suspense keeps a slow/failed font load from suspending the whole
          route — nodes and edges render while label text loads. */}
      <Suspense fallback={null}>
        {layerLabels.map((l) => (
          <Text
            key={l.label}
            font={LABEL_FONT}
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
            font={LABEL_FONT}
            position={[g.position.x, g.position.y + 0.4, g.position.z]}
            fontSize={0.32}
            color={filters.theme === 'dark' ? '#64748b' : '#475569'}
            anchorX="center"
            anchorY="bottom"
          >
            {g.key}
          </Text>
        ))}
      </Suspense>

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
        selectedId={selectedId}
        theme={filters.theme}
        coarsePointer={coarsePointer}
        hoverEnabled={hoverEnabled}
        onHover={setHovered}
        onSelect={handleSelect}
      />

      <Suspense fallback={null}>
        <TokenLabels
          nodes={visibleNodes}
          positions={positions}
          relatedIds={relatedNodeIds}
          selectedId={selectedId}
          isolated={isolated}
          theme={filters.theme}
        />
      </Suspense>

      {hoverEnabled && hovered && hovered.id !== selectedId && (
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

      <div className="token-tree__legend" aria-hidden="true">
        {LEVEL_LEGEND.map((l) => (
          <span key={l.label} className="token-tree__legend-item">
            <span className="token-tree__legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
        <span className="token-tree__legend-flow">component → system → global = references</span>
      </div>

      {!hasInteracted && (
        <div className="token-tree__hint">
          {coarsePointer
            ? 'Tap a node to inspect its reference chain'
            : 'Click a node to inspect — drag to orbit, scroll to zoom'}
        </div>
      )}

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
      <div className="token-tree__tooltip-cta">Click to inspect chain</div>
    </div>
  );
}
