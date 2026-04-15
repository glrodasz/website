/**
 * Runtime graph builder for the /tokens visualization.
 *
 * Reuses the W3C DTCG parser used by the CSS token build so the 3D graph
 * always reflects the same source-of-truth as design-tokens.css.
 *
 * The graph is modeled as three layers: global → system → component.
 * System tokens are single nodes that carry both light and dark values; the
 * dark value (plus dark reference target) only exists when system-dark.json
 * overrides that token. The consumer picks a theme and we render the matching
 * color + edge set.
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

export type NodeLevel = 'global' | 'system' | 'component';
export type ThemeMode = 'light' | 'dark';
export type EdgeMode = 'both' | 'light' | 'dark';

export interface GraphNode {
  id: string;
  level: NodeLevel;
  category: string;
  componentName?: string;
  cssVarName: string;
  type: string;
  /** Resolved value in light mode (also used for globals and components). */
  resolvedValue: string;
  /** Resolved value in dark mode — only set for system tokens overridden in system-dark.json. */
  resolvedValueDark?: string;
  displayLabel: string;
  path: string;
}

export type EdgeKind = 'system-global' | 'component-system';

export interface GraphEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  mode: EdgeMode;
}

export interface TokenGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodesById: Map<string, GraphNode>;
  componentNames: string[];
  categories: string[];
  stats: {
    global: number;
    system: number;
    systemDarkOverrides: number;
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

/**
 * Resolves an appearance (value + reference target) for a system token under
 * a specific theme, using the provided raw map.
 */
function resolveSystemAppearance(
  systemPath: string,
  rawMap: TokenMap,
  nameToPath: Map<string, string>,
  resolved: ReturnType<typeof resolveReferences>,
): { value?: string; globalTargetPath?: string } {
  const token = rawMap[systemPath];
  if (!token) return {};
  const r = resolved[systemPath];
  const value = r?.resolvedValue;
  let globalTargetPath: string | undefined;
  if (token.isReference && token.referencePath) {
    globalTargetPath = findReferencedPath(token.referencePath, nameToPath, resolved);
  }
  return { value, globalTargetPath };
}

export function buildTokenGraph(): TokenGraph {
  const globalMap = parseTokens(globalJson, 'global tokens', 'global');
  const systemLightMap = parseTokens(systemLightJson, 'system tokens', 'system');
  const systemDarkMap = parseTokens(systemDarkJson, 'system tokens', 'system');
  const componentMap = parseTokens(componentsJson, 'components tokens', 'component');

  // Light-mode resolution space: globals + light system + components.
  const lightSpace: TokenMap = { ...globalMap, ...systemLightMap, ...componentMap };
  const lightResolved = resolveReferences(lightSpace);
  const lightNameToPath = buildNameToPathMap(lightSpace);

  // Dark-mode resolution space: globals + dark system overrides.
  const darkSpace: TokenMap = { ...globalMap, ...systemDarkMap };
  const darkResolved = resolveReferences(darkSpace);
  const darkNameToPath = buildNameToPathMap(darkSpace);

  const nodes: GraphNode[] = [];
  const nodesById = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  let systemDarkOverrides = 0;

  const pushNode = (node: GraphNode) => {
    if (!nodesById.has(node.id)) {
      nodes.push(node);
      nodesById.set(node.id, node);
    }
  };

  // --- Global nodes ---
  for (const path in globalMap) {
    const r = lightResolved[path];
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

  // --- System nodes + edges (one node per path; capture light + dark values) ---
  for (const path in systemLightMap) {
    const lightAppearance = resolveSystemAppearance(path, systemLightMap, lightNameToPath, lightResolved);
    const darkAppearance = systemDarkMap[path]
      ? resolveSystemAppearance(path, systemDarkMap, darkNameToPath, darkResolved)
      : undefined;

    const nodeId = `system::${path}`;
    pushNode({
      id: nodeId,
      level: 'system',
      category: categoryFromPath(path),
      cssVarName: lightResolved[path]?.cssVarName ?? '',
      type: lightResolved[path]?.type ?? 'unknown',
      resolvedValue: lightAppearance.value ?? '',
      resolvedValueDark: darkAppearance?.value,
      displayLabel: labelFromPath(path),
      path,
    });

    if (darkAppearance) systemDarkOverrides++;

    const lightTarget = lightAppearance.globalTargetPath;
    const darkTarget = darkAppearance?.globalTargetPath;

    if (lightTarget && globalMap[lightTarget]) {
      if (!darkAppearance) {
        // Light-only system token — reference applies in both themes.
        edges.push({
          from: nodeId,
          to: `global::${lightTarget}`,
          kind: 'system-global',
          mode: 'both',
        });
      } else if (lightTarget === darkTarget) {
        // Dark override resolves to the same global — still a single edge.
        edges.push({
          from: nodeId,
          to: `global::${lightTarget}`,
          kind: 'system-global',
          mode: 'both',
        });
      } else {
        edges.push({
          from: nodeId,
          to: `global::${lightTarget}`,
          kind: 'system-global',
          mode: 'light',
        });
      }
    }

    if (darkTarget && darkTarget !== lightTarget && globalMap[darkTarget]) {
      edges.push({
        from: nodeId,
        to: `global::${darkTarget}`,
        kind: 'system-global',
        mode: 'dark',
      });
    }
  }

  // --- Component nodes + edges to system ---
  for (const path in componentMap) {
    const r = lightResolved[path];
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
      const targetPath = findReferencedPath(raw.referencePath, lightNameToPath, lightResolved);
      if (targetPath && systemLightMap[targetPath]) {
        edges.push({
          from: nodeId,
          to: `system::${targetPath}`,
          kind: 'component-system',
          mode: 'both',
        });
      }
    }
  }

  const componentNames = [
    ...new Set(nodes.filter(n => n.level === 'component').map(n => n.componentName!)),
  ].sort();

  const categories = [
    ...new Set(
      nodes
        .filter(n => n.level === 'global' || n.level === 'system')
        .map(n => n.category),
    ),
  ].sort();

  const stats = {
    global: nodes.filter(n => n.level === 'global').length,
    system: nodes.filter(n => n.level === 'system').length,
    systemDarkOverrides,
    component: nodes.filter(n => n.level === 'component').length,
    edges: edges.length,
  };

  return { nodes, edges, nodesById, componentNames, categories, stats };
}
