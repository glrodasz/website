/**
 * Lineage model behind the /tokens map.
 *
 * Tokens flow through four columns: global → system → component → UI, where
 * a UI source is a CSS file that consumes component tokens. The map only ever
 * shows a small visible subgraph — one row per group when nothing is focused,
 * or the upstream references and downstream users of a single focus (a token,
 * a group or a CSS file). Pure, so the 2D and 3D renderers share one view.
 *
 * Every row and focus is a single prefixed id, which keeps URL sync trivial:
 * `global::…`, `system::…`, `component::…` (graph node ids),
 * `group::<level>::<prefix>` and `ui::<file>`.
 */

import type { TokenUsage } from '../../../generated/token-usage';
import type {
  EdgeIndex,
  GraphNode,
  NodeLevel,
  ThemeMode,
  TokenGraph,
} from '../../../tokens/graph-builder';
import {
  HEX_RE,
  categoryOfComponentToken,
  displayComponentName,
  matchesSearch,
  themedValueOf,
} from '../utils';
import {
  MAP_COLUMNS,
  collapseColumn,
  groupColumn,
  orderColumns,
  type MapColumn,
  type RowGroup,
} from './arrange';

// The column order lives with the column geometry; re-exported so the map model has one entry point.
export { MAP_COLUMNS, type MapColumn };

export type UiTier = 'atom' | 'molecule' | 'organism' | 'page' | 'global';
const UI_TIERS: readonly UiTier[] = ['atom', 'molecule', 'organism', 'page', 'global'];
const UI_TIER_HEADINGS: Record<UiTier, string> = {
  atom: 'Atoms',
  molecule: 'Molecules',
  organism: 'Organisms',
  page: 'Pages',
  global: 'Global',
};

export interface UiSource {
  /** `ui::<file>` */
  id: string;
  file: string;
  label: string;
  tier: UiTier;
}

export interface LineageModel {
  graph: TokenGraph;
  /** Sorted by tier, then label. */
  ui: UiSource[];
  uiById: ReadonlyMap<string, UiSource>;
  /** Component node id → ids of the UI sources that use it. */
  filesByToken: ReadonlyMap<string, readonly string[]>;
  /** UI source id → ids of the component tokens it uses. */
  tokensByFile: ReadonlyMap<string, readonly string[]>;
  /** Usages whose variable matches no token. */
  unresolved: readonly TokenUsage[];
}

const TIER_BY_FOLDER: Record<string, UiTier | undefined> = {
  atoms: 'atom',
  molecules: 'molecule',
  organisms: 'organism',
  pages: 'page',
  styles: 'global',
};

const UI_LABELS: Record<string, string | undefined> = {
  'src/pages/pages.css': 'Shared page styles',
  'src/styles/global.css': 'Global styles',
};

function uiSourceOf(file: string): UiSource {
  const [, area, folder] = file.split('/');
  const tier = TIER_BY_FOLDER[area === 'components' ? folder : area] ?? 'global';
  const stem = file.slice(file.lastIndexOf('/') + 1).replace(/\.css$/, '');
  const label = UI_LABELS[file] ?? (tier === 'page' ? `${stem} page` : stem);
  return { id: `ui::${file}`, file, label, tier };
}

function addUnique(map: Map<string, string[]>, key: string, value: string) {
  const list = map.get(key);
  if (!list) map.set(key, [value]);
  else if (!list.includes(value)) list.push(value);
}

export function buildLineageModel(graph: TokenGraph, usages: readonly TokenUsage[]): LineageModel {
  // CSS lowercases some namespaces (`Site`, `Typography`), so match on the variable name.
  const nodeByVar = new Map(graph.nodes.map((n) => [n.cssVarName, n]));
  const uiById = new Map<string, UiSource>();
  const filesByToken = new Map<string, string[]>();
  const tokensByFile = new Map<string, string[]>();
  const unresolved: TokenUsage[] = [];

  for (const usage of usages) {
    const node = nodeByVar.get(usage.varName);
    if (!node) unresolved.push(usage);
    // CSS using system or global tokens directly is the audit's concern; UI hangs off components.
    if (node?.level !== 'component') continue;
    const ui = uiById.get(`ui::${usage.file}`) ?? uiSourceOf(usage.file);
    uiById.set(ui.id, ui);
    addUnique(filesByToken, node.id, ui.id);
    addUnique(tokensByFile, ui.id, node.id);
  }

  const ui = [...uiById.values()].sort(
    (a, b) => UI_TIERS.indexOf(a.tier) - UI_TIERS.indexOf(b.tier) || a.label.localeCompare(b.label),
  );
  return { graph, ui, uiById, filesByToken, tokensByFile, unresolved };
}

export function groupId(level: NodeLevel, prefix: string): string {
  return `group::${level}::${prefix}`;
}

/** Path segments below the level root, e.g. ['Colors', 'Primary', 'principal']. */
function segmentsOf(node: GraphNode): string[] {
  return node.path.split('.').slice(1);
}

/**
 * How many leading segments name a node's group: a color palette or role, a
 * typography family, else the first segment; for components the namespace,
 * or the property when only one namespace is on screen.
 */
function groupDepth(node: GraphNode, byProperty: boolean): number {
  if (node.level === 'component') return byProperty ? 2 : 1;
  const [head] = segmentsOf(node);
  if (head === 'Colors') return node.level === 'global' ? 3 : 2;
  return head === 'Typography' ? 2 : 1;
}

/** The group a node sits in on the overview, e.g. `Colors.Support.Shark` or `button`. */
export function overviewPrefix(node: GraphNode): string {
  return segmentsOf(node).slice(0, groupDepth(node, false)).join('.');
}

/** A path segment as shown on the map: a component namespace reads as its component name. */
function displaySegment(level: NodeLevel, segment: string, index: number): string {
  return level === 'component' && index === 0 ? displayComponentName(segment) : segment;
}

function headingOf(level: NodeLevel, segments: readonly string[]): string | null {
  if (segments.length === 0) return null;
  return segments.map((s, i) => displaySegment(level, s, i)).join(' / ');
}

/** The group row for every node sharing `node`'s first `depth` segments. */
function groupOf(node: GraphNode, depth: number): RowGroup {
  const prefix = segmentsOf(node).slice(0, depth);
  const last = prefix.length - 1;
  return {
    id: groupId(node.level, prefix.join('.')),
    label: displaySegment(node.level, prefix[last], last),
    title: prefix.join('.'),
    section: headingOf(node.level, prefix.slice(0, last)),
  };
}

const GROUP_ID_RE = /^group::(global|system|component)::(.+)$/;

export type ResolvedMapId =
  | { kind: 'token'; node: GraphNode }
  | { kind: 'group'; level: NodeLevel; prefix: string; members: GraphNode[] }
  | { kind: 'ui'; ui: UiSource };

export function resolveMapId(m: LineageModel, id: string): ResolvedMapId | null {
  const ui = m.uiById.get(id);
  if (ui) return { kind: 'ui', ui };
  const node = m.graph.nodesById.get(id);
  if (node) return { kind: 'token', node };

  const match = GROUP_ID_RE.exec(id);
  if (!match) return null;
  const level = match[1] as NodeLevel;
  const prefix = match[2];
  // The trailing dot keeps `button` from matching `button-group`.
  const members = m.graph.nodes.filter(
    (n) => n.level === level && segmentsOf(n).join('.').startsWith(`${prefix}.`),
  );
  return members.length > 0 ? { kind: 'group', level, prefix, members } : null;
}

export interface MapFilters {
  search: string;
  enabledCategories: ReadonlySet<string>;
  enabledComponents: ReadonlySet<string>;
}

export interface MapRow {
  id: string;
  column: MapColumn;
  kind: 'token' | 'group' | 'ui';
  /** Short, relative to its section (e.g. `Shark.500`, `Shark`, `Button`). */
  label: string;
  /** Full path or file, for tooltips. */
  title: string;
  /** Heading the row sits under; null when it has none. */
  section: string | null;
  /** 1 for tokens and UI sources; the member count for groups. */
  memberCount: number;
  /** Up to four themed hex values, for color tokens and color groups. */
  swatches: string[];
  /** Search matches inside the row (1/0 for tokens); used for dimming. */
  matches: number;
  /** Consumers that exist (theme edges, CSS usage) but are not on this view. */
  elsewhere: number;
  isFocus: boolean;
  /** In a collapsed column: a group row standing in for its members, or a member shown in place. */
  collapse: 'collapsed' | 'expanded' | null;
  /** The group id to toggle in `expanded` to fold or unfold this row. */
  toggleId?: string;
  /** Themed resolved value, for single tokens. */
  value?: string;
  type?: string;
}

/** A weighted link between rows in adjacent columns, `left` being the column nearer global. */
export interface MapLink {
  left: string;
  right: string;
  weight: number;
}

export interface MapView {
  focusId: string | null;
  columns: Record<MapColumn, MapRow[]>;
  links: MapLink[];
  /** Underlying token / UI source counts each column represents. */
  totals: Record<MapColumn, number>;
}

type Step = (id: string) => readonly string[];

/** How the visible subgraph is walked under the current theme and filters. */
interface Walker {
  /** References, toward the global column. */
  up: Step;
  /** Consumers (tokens, then CSS files), toward the UI column. */
  down: Step;
  isShown: (id: string) => boolean;
}

function passesFilters(node: GraphNode, f: MapFilters): boolean {
  if (node.level !== 'component') return f.enabledCategories.has(node.category);
  const category = categoryOfComponentToken(node);
  return (
    f.enabledComponents.has(node.componentName ?? '') &&
    (category === null || f.enabledCategories.has(category))
  );
}

function walkerFor(m: LineageModel, index: EdgeIndex, f: MapFilters): Walker {
  const { nodesById } = m.graph;
  return {
    up: (id) => {
      if (m.uiById.has(id)) return m.tokensByFile.get(id) ?? [];
      const target = index.targetByNode.get(id);
      return target ? [target] : [];
    },
    down: (id) => {
      if (nodesById.get(id)?.level === 'component') return m.filesByToken.get(id) ?? [];
      return index.consumersByNode.get(id)?.map((n) => n.id) ?? [];
    },
    isShown: (id) => {
      const node = nodesById.get(id);
      return node ? passesFilters(node, f) : m.uiById.has(id);
    },
  };
}

/** Every id reachable from `starts` by repeating `step`, passing only through shown ids. */
function reach(starts: Iterable<string>, step: Step, isShown: (id: string) => boolean): Set<string> {
  const reached = new Set<string>();
  const queue = [...starts];
  while (queue.length > 0) {
    for (const next of step(queue.pop()!)) {
      if (reached.has(next) || !isShown(next)) continue;
      reached.add(next);
      queue.push(next);
    }
  }
  return reached;
}

/** The focus members; they stay on the map even when the filters would hide them all. */
function focusMembers(focus: ResolvedMapId, w: Walker): Set<string> {
  const ids =
    focus.kind === 'group'
      ? focus.members.map((n) => n.id)
      : [focus.kind === 'ui' ? focus.ui.id : focus.node.id];
  const shown = ids.filter(w.isShown);
  return new Set(shown.length > 0 ? shown : ids);
}

/** The focus plus everything upstream of it and everything downstream, never mixing directions. */
function lineageIds(focusIds: Set<string>, w: Walker): Set<string> {
  const upstream = reach(focusIds, w.up, w.isShown);
  const downstream = reach(focusIds, w.down, w.isShown);
  return new Set([...focusIds, ...upstream, ...downstream]);
}

/** Every shown token, plus the CSS files that use the shown component tokens. */
function overviewIds(m: LineageModel, f: MapFilters, w: Walker): Set<string> {
  const shown = m.graph.nodes.filter((n) => w.isShown(n.id));
  const components = shown.filter((n) => n.level === 'component').map((n) => n.id);
  const narrowed = m.graph.componentNames.some((name) => !f.enabledComponents.has(name));
  // A narrowed component filter also hides the system and global tokens only other components use.
  const tokens = narrowed
    ? [...components, ...reach(components, w.up, w.isShown)]
    : shown.map((n) => n.id);
  return new Set([...tokens, ...reach(components, w.down, w.isShown)]);
}

/** Sums member-level references into links between the rows that hold each end. */
function linkRows(visible: Set<string>, up: Step, rowOf: (id: string) => string): MapLink[] {
  const links = new Map<string, MapLink>();
  for (const id of visible) {
    for (const target of up(id)) {
      if (!visible.has(target)) continue;
      const left = rowOf(target);
      const right = rowOf(id);
      const key = `${left}\n${right}`;
      const link = links.get(key);
      if (link) link.weight++;
      else links.set(key, { left, right, weight: 1 });
    }
  }
  return [...links.values()];
}

function byColumn<T>(value: (column: MapColumn) => T): Record<MapColumn, T> {
  return {
    global: value('global'),
    system: value('system'),
    component: value('component'),
    ui: value('ui'),
  };
}

/**
 * The visible subgraph for a focus (or the grouped overview when `focusId`
 * is null or unknown), collapsed and ordered for display.
 */
export function computeMapView(
  m: LineageModel,
  index: EdgeIndex,
  theme: ThemeMode,
  f: MapFilters,
  focusId: string | null,
  expanded: ReadonlySet<string>,
): MapView {
  const { nodes, nodesById } = m.graph;
  const focus = focusId === null ? null : resolveMapId(m, focusId);
  const w = walkerFor(m, index, f);
  const focusIds = focus ? focusMembers(focus, w) : new Set<string>();
  const visible = focus ? lineageIds(focusIds, w) : overviewIds(m, f, w);
  const query = f.search.trim().toLowerCase();

  const namespaces = new Set([...visible].flatMap((id) => nodesById.get(id)?.componentName ?? []));
  const byProperty = focus !== null && namespaces.size === 1;
  const groupOfId = (id: string) => {
    const node = nodesById.get(id)!;
    return groupOf(node, groupDepth(node, byProperty));
  };

  const columns = byColumn<MapRow[]>(() => []);
  for (const node of nodes) {
    if (!visible.has(node.id)) continue;
    const segments = segmentsOf(node);
    // A token sits under its group's heading (a top-level group is the heading
    // itself), so collapsed, expanded and loose rows of a section stay together.
    const headingDepth = Math.max(1, groupDepth(node, byProperty) - 1);
    const value = themedValueOf(node, theme);
    columns[node.level].push({
      id: node.id,
      column: node.level,
      kind: 'token',
      label: segments.slice(headingDepth).join('.') || node.displayLabel,
      title: node.path,
      section: headingOf(node.level, segments.slice(0, headingDepth)),
      memberCount: 1,
      swatches: node.type === 'color' && HEX_RE.test(value) ? [value] : [],
      matches: matchesSearch(node, query) ? 1 : 0,
      elsewhere: w.down(node.id).filter((id) => !visible.has(id)).length,
      isFocus: focusIds.has(node.id),
      collapse: null,
      value,
      type: node.type,
    });
  }
  for (const ui of m.ui) {
    if (!visible.has(ui.id)) continue;
    const matches = !query || `${ui.label} ${ui.file}`.toLowerCase().includes(query);
    columns.ui.push({
      id: ui.id,
      column: 'ui',
      kind: 'ui',
      label: ui.label,
      title: ui.file,
      section: UI_TIER_HEADINGS[ui.tier],
      memberCount: 1,
      swatches: [],
      matches: matches ? 1 : 0,
      elsewhere: 0,
      isFocus: focusIds.has(ui.id),
      collapse: null,
    });
  }

  const groupOfRow = (r: MapRow) => groupOfId(r.id);
  for (const column of ['global', 'system', 'component'] as const) {
    columns[column] = focus
      ? collapseColumn(columns[column], groupOfRow, expanded)
      : groupColumn(columns[column], groupOfRow);
  }
  const rowIds = new Set(MAP_COLUMNS.flatMap((c) => columns[c].map((r) => r.id)));
  const rowOf = (id: string) => (rowIds.has(id) ? id : groupOfId(id).id);

  return orderColumns({
    focusId: focus ? focusId : null,
    columns,
    links: linkRows(visible, w.up, rowOf),
    totals: byColumn((c) => columns[c].reduce((n, r) => n + r.memberCount, 0)),
  });
}

/** The row plus everything linked to it walking only leftward, and only rightward. */
export function lineageOf(v: MapView, id: string): Set<string> {
  const lineage = new Set([id]);
  const walk = (from: 'left' | 'right', to: 'left' | 'right') => {
    const queue = [id];
    while (queue.length > 0) {
      const current = queue.pop()!;
      for (const l of v.links) {
        if (l[from] !== current || lineage.has(l[to])) continue;
        lineage.add(l[to]);
        queue.push(l[to]);
      }
    }
  };
  walk('right', 'left');
  walk('left', 'right');
  return lineage;
}

/** `#RRGGBB` from a 6- or 8-digit hex (alpha dropped), else null. */
export function toOpaqueHex(value: string): string | null {
  return HEX_RE.test(value) ? value.slice(0, 7) : null;
}
