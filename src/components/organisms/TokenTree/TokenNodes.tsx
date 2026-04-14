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
  theme: ThemeMode;
  onHover: (node: GraphNode | null) => void;
}

export function TokenNodes({ nodes, positions, seedIds, relatedIds, theme, onHover }: TokenNodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { baseColors, count } = useMemo(() => {
    const colors = nodes.map((n) => resolveNodeColor(n, theme));
    return { baseColors: colors, count: Math.max(nodes.length, 1) };
  }, [nodes, theme]);

  // Set initial positions once.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    nodes.forEach((node, i) => {
      const p = positions.get(node.id);
      if (!p) return;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(node.level === 'component' ? 0.18 : 0.22);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes, positions]);

  // Update colors based on hover / focus state.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const hasHighlight = Boolean(seedIds && seedIds.size > 0);
    nodes.forEach((node, i) => {
      let c: THREE.Color;
      if (!hasHighlight) {
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
  }, [nodes, baseColors, seedIds, relatedIds]);

  if (nodes.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      onPointerOver={(e) => {
        e.stopPropagation();
        const idx = e.instanceId;
        if (idx != null) onHover(nodes[idx] ?? null);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial roughness={0.5} metalness={0.1} />
    </instancedMesh>
  );
}
