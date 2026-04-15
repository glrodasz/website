/**
 * Renders all graph edges as line segments using a single BufferGeometry per
 * edge kind. Edges tagged 'light' or 'dark' are only drawn in that theme; 'both' always draws.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import type { GraphEdge, EdgeKind, ThemeMode } from '../../../tokens/graph-builder';
import type { NodePosition } from './layout';

const EDGE_COLORS: Record<EdgeKind, string> = {
  'system-global': '#e5e7eb',
  'component-system': '#7dd3fc',
};

function edgeMatchesTheme(edge: GraphEdge, theme: ThemeMode): boolean {
  return edge.mode === 'both' || edge.mode === theme;
}

interface TokenEdgesProps {
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  visibleNodeIds: Set<string>;
  theme: ThemeMode;
  highlightEdgeIndices: Set<number> | null;
}

export function TokenEdges({
  edges,
  positions,
  visibleNodeIds,
  theme,
  highlightEdgeIndices,
}: TokenEdgesProps) {
  const byKind = useMemo(() => {
    const groups: Record<EdgeKind, number[]> = {
      'system-global': [],
      'component-system': [],
    };

    edges.forEach((edge) => {
      if (!edgeMatchesTheme(edge, theme)) return;
      if (!visibleNodeIds.has(edge.from) || !visibleNodeIds.has(edge.to)) return;
      const fromPos = positions.get(edge.from);
      const toPos = positions.get(edge.to);
      if (!fromPos || !toPos) return;
      groups[edge.kind].push(fromPos.x, fromPos.y, fromPos.z, toPos.x, toPos.y, toPos.z);
    });

    return groups;
  }, [edges, positions, visibleNodeIds, theme]);

  const dimmed = highlightEdgeIndices != null;

  return (
    <group>
      {(Object.keys(byKind) as EdgeKind[]).map((kind) => {
        const verts = byKind[kind];
        if (verts.length === 0) return null;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        return (
          <lineSegments key={`base-${kind}`} geometry={geometry}>
            <lineBasicMaterial
              color={EDGE_COLORS[kind]}
              transparent
              opacity={dimmed ? 0.04 : 0.18}
            />
          </lineSegments>
        );
      })}

      {highlightEdgeIndices && highlightEdgeIndices.size > 0 && (
        <HighlightedEdges
          edges={edges}
          positions={positions}
          indices={highlightEdgeIndices}
          visibleNodeIds={visibleNodeIds}
          theme={theme}
        />
      )}
    </group>
  );
}

function HighlightedEdges({
  edges,
  positions,
  indices,
  visibleNodeIds,
  theme,
}: {
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  indices: Set<number>;
  visibleNodeIds: Set<string>;
  theme: ThemeMode;
}) {
  const geometries = useMemo(() => {
    const byKind: Record<EdgeKind, number[]> = {
      'system-global': [],
      'component-system': [],
    };
    indices.forEach((i) => {
      const edge = edges[i];
      if (!edgeMatchesTheme(edge, theme)) return;
      if (!visibleNodeIds.has(edge.from) || !visibleNodeIds.has(edge.to)) return;
      const fromPos = positions.get(edge.from);
      const toPos = positions.get(edge.to);
      if (!fromPos || !toPos) return;
      byKind[edge.kind].push(fromPos.x, fromPos.y, fromPos.z, toPos.x, toPos.y, toPos.z);
    });
    return byKind;
  }, [edges, positions, indices, visibleNodeIds, theme]);

  return (
    <>
      {(Object.keys(geometries) as EdgeKind[]).map((kind) => {
        const verts = geometries[kind];
        if (verts.length === 0) return null;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        return (
          <lineSegments key={`hl-${kind}`} geometry={geometry}>
            <lineBasicMaterial color="#ffd400" transparent opacity={0.95} linewidth={2} />
          </lineSegments>
        );
      })}
    </>
  );
}
