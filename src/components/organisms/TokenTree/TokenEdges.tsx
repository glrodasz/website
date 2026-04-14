/**
 * Renders all graph edges as line segments using a single BufferGeometry per
 * edge kind.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import type { GraphEdge, EdgeKind } from '../../../tokens/graph-builder';
import type { NodePosition } from './layout';

const EDGE_COLORS: Record<EdgeKind, string> = {
  'system-light-global': '#e5e7eb',
  'system-dark-global': '#6b7280',
  'component-system': '#7dd3fc',
};

interface TokenEdgesProps {
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  visibleNodeIds: Set<string>;
  highlightEdgeIndices: Set<number> | null;
}

export function TokenEdges({ edges, positions, visibleNodeIds, highlightEdgeIndices }: TokenEdgesProps) {
  const byKind = useMemo(() => {
    const groups: Record<EdgeKind, { vertices: number[]; edgeIndexToGlobal: number[] }> = {
      'system-light-global': { vertices: [], edgeIndexToGlobal: [] },
      'system-dark-global': { vertices: [], edgeIndexToGlobal: [] },
      'component-system': { vertices: [], edgeIndexToGlobal: [] },
    };

    edges.forEach((edge, globalIdx) => {
      if (!visibleNodeIds.has(edge.from) || !visibleNodeIds.has(edge.to)) return;
      const fromPos = positions.get(edge.from);
      const toPos = positions.get(edge.to);
      if (!fromPos || !toPos) return;
      const g = groups[edge.kind];
      g.vertices.push(fromPos.x, fromPos.y, fromPos.z, toPos.x, toPos.y, toPos.z);
      g.edgeIndexToGlobal.push(globalIdx);
    });

    return groups;
  }, [edges, positions, visibleNodeIds]);

  const dimmed = highlightEdgeIndices != null;

  return (
    <group>
      {(Object.keys(byKind) as EdgeKind[]).map((kind) => {
        const data = byKind[kind];
        if (data.vertices.length === 0) return null;
        const arr = new Float32Array(data.vertices);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3));
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
        />
      )}
    </group>
  );
}

function HighlightedEdges({
  edges,
  positions,
  indices,
}: {
  edges: GraphEdge[];
  positions: Map<string, NodePosition>;
  indices: Set<number>;
}) {
  const geometries = useMemo(() => {
    const byKind: Record<EdgeKind, number[]> = {
      'system-light-global': [],
      'system-dark-global': [],
      'component-system': [],
    };
    indices.forEach((i) => {
      const edge = edges[i];
      const fromPos = positions.get(edge.from);
      const toPos = positions.get(edge.to);
      if (!fromPos || !toPos) return;
      byKind[edge.kind].push(fromPos.x, fromPos.y, fromPos.z, toPos.x, toPos.y, toPos.z);
    });
    return byKind;
  }, [edges, positions, indices]);

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
