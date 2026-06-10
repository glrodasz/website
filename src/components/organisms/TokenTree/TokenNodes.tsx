/**
 * Renders all token nodes using an instanced mesh for performance.
 * Each node is a small sphere; color = resolved hex for color tokens,
 * otherwise per-level neutral tone.
 */

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GraphNode, NodeLevel, ThemeMode } from '../../../tokens/graph-builder';
import type { NodePosition } from './layout';

const LEVEL_FALLBACK_COLOR: Record<NodeLevel, string> = {
  'global': '#9aa0a6',
  'system': '#cbd5e1',
  'component': '#e5e7eb',
};

const HIGHLIGHT_COLOR = new THREE.Color('#ffd400');
const DIMMED_COLOR = new THREE.Color('#1a1a1a');

const SELECTED_SCALE_FACTOR = 1.6;

function resolveNodeColor(node: GraphNode, theme: ThemeMode): THREE.Color {
  const themedValue =
    theme === 'dark' && node.resolvedValueDark ? node.resolvedValueDark : node.resolvedValue;
  if (node.type === 'color' && /^#[0-9a-fA-F]{6,8}$/.test(themedValue)) {
    return new THREE.Color(themedValue.slice(0, 7));
  }
  return new THREE.Color(LEVEL_FALLBACK_COLOR[node.level]);
}

interface TokenNodesProps {
  nodes: GraphNode[];
  positions: Map<string, NodePosition>;
  seedIds: Set<string> | null;
  relatedIds: Set<string> | null;
  selectedId: string | null;
  theme: ThemeMode;
  coarsePointer: boolean;
  hoverEnabled: boolean;
  onHover: (node: GraphNode | null) => void;
  onSelect: (node: GraphNode | null) => void;
}

export function TokenNodes({
  nodes,
  positions,
  seedIds,
  relatedIds,
  selectedId,
  theme,
  coarsePointer,
  hoverEnabled,
  onHover,
  onSelect,
}: TokenNodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { baseColors, count } = useMemo(() => {
    const colors = nodes.map((n) => resolveNodeColor(n, theme));
    return { baseColors: colors, count: Math.max(nodes.length, 1) };
  }, [nodes, theme]);

  // Bigger spheres on touch screens so taps land reliably.
  const baseScaleFor = (node: GraphNode) => {
    if (coarsePointer) return node.level === 'component' ? 0.26 : 0.3;
    return node.level === 'component' ? 0.18 : 0.22;
  };

  // Set positions and scales; the selected node renders larger so it stays
  // findable, which means this must re-run when selection changes.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    nodes.forEach((node, i) => {
      const p = positions.get(node.id);
      if (!p) return;
      dummy.position.set(p.x, p.y, p.z);
      const base = baseScaleFor(node);
      dummy.scale.setScalar(node.id === selectedId ? base * SELECTED_SCALE_FACTOR : base);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, positions, selectedId, coarsePointer]);

  // Update colors based on hover / selection / focus state.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const hasHighlight = Boolean(seedIds && seedIds.size > 0);
    nodes.forEach((node, i) => {
      let c: THREE.Color;
      if (node.id === selectedId) {
        c = HIGHLIGHT_COLOR;
      } else if (!hasHighlight) {
        c = baseColors[i];
      } else if (seedIds!.has(node.id)) {
        c = HIGHLIGHT_COLOR;
      } else if (relatedIds?.has(node.id)) {
        c = baseColors[i];
      } else {
        c = DIMMED_COLOR;
      }
      mesh.setColorAt(i, c);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, baseColors, seedIds, relatedIds, selectedId]);

  if (nodes.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      onClick={(e) => {
        // Ignore clicks that conclude an orbit drag.
        if (e.delta > 5) return;
        e.stopPropagation();
        const idx = e.instanceId;
        if (idx != null) onSelect(nodes[idx] ?? null);
      }}
      onPointerOver={(e) => {
        if (!hoverEnabled) return;
        e.stopPropagation();
        const idx = e.instanceId;
        if (idx != null) onHover(nodes[idx] ?? null);
      }}
      onPointerOut={(e) => {
        if (!hoverEnabled) return;
        e.stopPropagation();
        onHover(null);
      }}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial roughness={0.5} metalness={0.1} />
    </instancedMesh>
  );
}
