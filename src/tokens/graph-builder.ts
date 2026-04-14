/**
 * Runtime graph builder for the /tokens visualization.
 *
 * Reuses the W3C DTCG parser used by the CSS token build so the 3D graph
 * always reflects the same source-of-truth as design-tokens.css.
 */

import globalJson from './json/global.json';
import systemLightJson from './json/system-light.json';
import systemDarkJson from './json/system-dark.json';
import componentsJson from './json/components.json';
import {
  parseTokens,
  resolveReferences,
  buildNameToPathMap,
  findReferencedPath,
  type TokenMap,
} from './parser';

export type NodeLevel = 'global' | 'system-light' | 'system-dark' | 'component';

export interface GraphNode {
  id: string;
  level: NodeLevel;
  category: string;
  componentName?: string;
  cssVarName: string;
  type: string;
  resolvedValue: string;
  displayLabel: string;
  path: string;
}

export type EdgeKind = 'system-light-global' | 'system-dark-global' | 'component-system';

export interface GraphEdge {
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface TokenGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodesById: Map<string, GraphNode>;
  componentNames: string[];
  categories: string[];
  stats: {
    global: number;
    systemLight: number;
    systemDark: number;
    component: number;
    edges: number;
  };
}

function categoryFromPath(path: string): string {
  const parts = path.split('.');
  return parts[1] ?? 'Other';
}

function componentNameFromPath(path: string): string {
  const parts = path.split('.');
  return parts[1] ?? 'misc';
}

function labelFromPath(path: string): string {
  const parts = path.split('.');
  return parts.slice(-2).join('.');
}

export function buildTokenGraph(): TokenGraph {
  const globalMap = parseTokens(globalJson, 'global tokens', 'global');
  const systemLightMap = parseTokens(systemLightJson, 'system tokens', 'system');
  const systemDarkRawMap = parseTokens(systemDarkJson, 'system tokens', 'system');
  const componentMap = parseTokens(componentsJson, 'components tokens', 'component');

  // Unified map for resolving CSS vars + values. system-light wins on conflicts
  // over dark (dark is an overlay).
  const unifiedMap: TokenMap = {
    ...globalMap,
    ...systemLightMap,
    ...componentMap,
  };
  const resolved = resolveReferences(unifiedMap);
  const nameToPath = buildNameToPathMap(unifiedMap);

  // For dark tokens: build an independent resolution against globals only.
  const darkResolutionMap: TokenMap = { ...globalMap, ...systemDarkRawMap };
  const resolvedDark = resolveReferences(darkResolutionMap);
  const darkNameToPath = buildNameToPathMap(darkResolutionMap);

  const nodes: GraphNode[] = [];
  const nodesById = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  const pushNode = (node: GraphNode) => {
    if (!nodesById.has(node.id)) {
      nodes.push(node);
      nodesById.set(node.id, node);
    }
  };

  // --- Global nodes ---
  for (const path in globalMap) {
    const r = resolved[path];
    if (!r) continue;
    pushNode({
      id: `global::${path}`,
      level: 'global',
      category: categoryFromPath(path),
      cssVarName: r.cssVarName,
      type: r.type,
      resolvedValue: r.resolvedValue,
      displayLabel: labelFromPath(path),
      path,
    });
  }

  // --- System-light nodes + edges to globals ---
  for (const path in systemLightMap) {
    const r = resolved[path];
    if (!r) continue;
    const nodeId = `system-light::${path}`;
    pushNode({
      id: nodeId,
      level: 'system-light',
      category: categoryFromPath(path),
      cssVarName: r.cssVarName,
      type: r.type,
      resolvedValue: r.resolvedValue,
      displayLabel: labelFromPath(path),
      path,
    });

    const raw = systemLightMap[path];
    if (raw.isReference && raw.referencePath) {
      const targetPath = findReferencedPath(raw.referencePath, nameToPath, resolved);
      if (targetPath && globalMap[targetPath]) {
        edges.push({
          from: nodeId,
          to: `global::${targetPath}`,
          kind: 'system-light-global',
        });
      }
    }
  }

  // --- System-dark nodes + edges to globals ---
  for (const path in systemDarkRawMap) {
    const r = resolvedDark[path];
    if (!r) continue;
    const nodeId = `system-dark::${path}`;
    pushNode({
      id: nodeId,
      level: 'system-dark',
      category: categoryFromPath(path),
      cssVarName: r.cssVarName,
      type: r.type,
      resolvedValue: r.resolvedValue,
      displayLabel: labelFromPath(path),
      path,
    });

    const raw = systemDarkRawMap[path];
    if (raw.isReference && raw.referencePath) {
      const targetPath = findReferencedPath(raw.referencePath, darkNameToPath, resolvedDark);
      if (targetPath && globalMap[targetPath]) {
        edges.push({
          from: nodeId,
          to: `global::${targetPath}`,
          kind: 'system-dark-global',
        });
      }
    }
  }

  // --- Component nodes + edges to system-light ---
  for (const path in componentMap) {
    const r = resolved[path];
    if (!r) continue;
    const componentName = componentNameFromPath(path);
    const nodeId = `component::${path}`;
    pushNode({
      id: nodeId,
      level: 'component',
      category: componentName,
      componentName,
      cssVarName: r.cssVarName,
      type: r.type,
      resolvedValue: r.resolvedValue,
      displayLabel: labelFromPath(path),
      path,
    });

    const raw = componentMap[path];
    if (raw.isReference && raw.referencePath) {
      const targetPath = findReferencedPath(raw.referencePath, nameToPath, resolved);
      if (targetPath && systemLightMap[targetPath]) {
        edges.push({
          from: nodeId,
          to: `system-light::${targetPath}`,
          kind: 'component-system',
        });
      }
    }
  }

  // Sorted unique component names + categories.
  const componentNames = [
    ...new Set(nodes.filter(n => n.level === 'component').map(n => n.componentName!)),
  ].sort();

  const categories = [
    ...new Set(
      nodes
        .filter(n => n.level === 'global' || n.level === 'system-light' || n.level === 'system-dark')
        .map(n => n.category),
    ),
  ].sort();

  const stats = {
    global: nodes.filter(n => n.level === 'global').length,
    systemLight: nodes.filter(n => n.level === 'system-light').length,
    systemDark: nodes.filter(n => n.level === 'system-dark').length,
    component: nodes.filter(n => n.level === 'component').length,
    edges: edges.length,
  };

  return { nodes, edges, nodesById, componentNames, categories, stats };
}
