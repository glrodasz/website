import { describe, expect, it } from 'vitest';
import { runTokenAudit } from '../../../tokens/audit';
import { buildTokenGraph, indexEdges, type ThemeMode } from '../../../tokens/graph-builder';
import { tokenUsages } from '../../../generated/token-usage';
import {
  MAP_COLUMNS,
  buildLineageModel,
  computeMapView,
  groupId,
  lineageOf,
  overviewPrefix,
  resolveMapId,
  toOpaqueHex,
  type MapColumn,
  type MapFilters,
  type MapView,
} from './lineage';

const graph = buildTokenGraph();
const model = buildLineageModel(graph, tokenUsages);
const indexes = { light: indexEdges(graph, 'light'), dark: indexEdges(graph, 'dark') };
const ALL: MapFilters = {
  search: '',
  enabledCategories: new Set(graph.categories),
  enabledComponents: new Set(graph.componentNames),
};

interface ViewOptions {
  filters?: Partial<MapFilters>;
  theme?: ThemeMode;
  expanded?: string[];
}

function viewOf(focusId: string | null, { filters, theme = 'light', expanded = [] }: ViewOptions = {}) {
  return computeMapView(model, indexes[theme], theme, { ...ALL, ...filters }, focusId, new Set(expanded));
}

const ids = (v: MapView, column: MapColumn) => v.columns[column].map((r) => r.id);
const rowCounts = (v: MapView) => MAP_COLUMNS.map((c) => v.columns[c].length);
const linksFrom = (v: MapView, from: MapColumn) => {
  const left = new Set(ids(v, from));
  return v.links.filter((l) => left.has(l.left));
};
const linkWeight = (v: MapView, from: MapColumn) => linksFrom(v, from).reduce((n, l) => n + l.weight, 0);

const BUTTON_CSS = 'ui::src/components/atoms/Button.css';
const ICON_BUTTON_CSS = 'ui::src/components/molecules/IconButton.css';
const FOOTER_CSS = 'ui::src/components/organisms/Footer/Footer.css';
const nodeByVar = new Map(graph.nodes.map((n) => [n.cssVarName, n]));
const usagePairs = new Set(
  tokenUsages.flatMap((u) => {
    const node = nodeByVar.get(u.varName);
    return node ? [`${u.file}\n${node.id}`] : [];
  }),
);

describe('buildLineageModel', () => {
  it('makes every CSS file with token usages a labelled UI source, sorted by tier', () => {
    expect(model.ui).toHaveLength(new Set(tokenUsages.map((u) => u.file)).size);
    expect(model.ui).toHaveLength(27);
    const byFile = new Map(model.ui.map((ui) => [ui.file, ui]));
    expect(byFile.get('src/components/atoms/Button.css')).toMatchObject({ label: 'Button', tier: 'atom' });
    expect(byFile.get('src/components/molecules/InputText/InputText.css')).toMatchObject({
      label: 'InputText',
      tier: 'molecule',
    });
    expect(byFile.get('src/pages/Home.css')).toMatchObject({ label: 'Home page', tier: 'page' });
    expect(byFile.get('src/pages/pages.css')).toMatchObject({ label: 'Shared page styles', tier: 'page' });
    expect(byFile.get('src/styles/global.css')).toMatchObject({ label: 'Global styles', tier: 'global' });

    const ranks = model.ui.map((ui) => ['atom', 'molecule', 'organism', 'page', 'global'].indexOf(ui.tier));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it('links each file and token once per (file, token) pair', () => {
    const count = (map: ReadonlyMap<string, readonly string[]>) =>
      [...map.values()].reduce((n, list) => n + list.length, 0);
    expect(count(model.tokensByFile)).toBe(usagePairs.size);
    expect(count(model.filesByToken)).toBe(usagePairs.size);
    expect(model.tokensByFile.get(BUTTON_CSS)).toContain(
      'component::components tokens.button.text-color.primary.default',
    );
  });

  it('keeps the usages that match no token, as the audit counts them', () => {
    const missing = runTokenAudit(graph).byCheck['missing-token'];
    expect(model.unresolved).toHaveLength(missing.reduce((n, i) => n + (i.locations?.length ?? 0), 0));
  });
});

describe('resolveMapId', () => {
  it('resolves tokens, UI sources and groups, and rejects unknown ids', () => {
    expect(resolveMapId(model, 'system::system tokens.Spacing.sm')).toMatchObject({ kind: 'token' });
    expect(resolveMapId(model, BUTTON_CSS)).toMatchObject({ kind: 'ui' });
    expect(resolveMapId(model, groupId('global', 'Colors.Support.Shark'))).toMatchObject({ kind: 'group' });
    expect(resolveMapId(model, 'group::component::nope')).toBeNull();
    expect(resolveMapId(model, 'group::ui::Button')).toBeNull();
    expect(resolveMapId(model, 'nope')).toBeNull();
  });

  it('matches whole prefix segments, so button excludes button-group', () => {
    const button = resolveMapId(model, groupId('component', 'button'));
    expect(button?.kind).toBe('group');
    if (button?.kind !== 'group') return;
    expect(button.members).toHaveLength(61);
    expect(button.members.every((n) => n.componentName === 'button')).toBe(true);
    expect(graph.componentNames).toContain('button-group');
  });
});

describe('computeMapView overview', () => {
  const overview = viewOf(null);

  it('shows one row per group and per UI source', () => {
    expect(overview.focusId).toBeNull();
    expect(rowCounts(overview)).toEqual([21, 20, 20, 27]);
    expect(overview.totals).toEqual({
      global: graph.stats.global,
      system: graph.stats.system,
      component: graph.stats.component,
      ui: model.ui.length,
    });
    for (const column of ['global', 'system', 'component'] as const) {
      expect(overview.columns[column].every((r) => r.kind === 'group' && r.collapse === null)).toBe(true);
    }
  });

  it('weighs each link by the references it stands for', () => {
    const themeEdges = (kind: string) =>
      graph.edges.filter((e) => e.kind === kind && e.mode !== 'dark').length;
    expect(linkWeight(overview, 'global')).toBe(themeEdges('system-global'));
    expect(linkWeight(overview, 'system')).toBe(themeEdges('component-system'));
    expect(linkWeight(overview, 'component')).toBe(usagePairs.size);
  });

  it('draws one link per pair of groups that reference each other', () => {
    const groupPairs = (kind: string, left: 'global' | 'system', right: 'system' | 'component') =>
      new Set(
        graph.edges
          .filter((e) => e.kind === kind && e.mode !== 'dark')
          .map((e) => {
            const [from, to] = [graph.nodesById.get(e.from)!, graph.nodesById.get(e.to)!];
            return `${groupId(left, overviewPrefix(to))}\n${groupId(right, overviewPrefix(from))}`;
          }),
      );
    const pairsOf = (from: MapColumn) =>
      new Set(linksFrom(overview, from).map((l) => `${l.left}\n${l.right}`));

    expect(pairsOf('global')).toEqual(groupPairs('system-global', 'global', 'system'));
    expect(pairsOf('system')).toEqual(groupPairs('component-system', 'system', 'component'));
    expect(linksFrom(overview, 'global')).toHaveLength(33);
    expect(linksFrom(overview, 'system')).toHaveLength(176);
    expect(overview.links.every((l) => l.weight > 0)).toBe(true);
  });

  it('puts every group row under a heading', () => {
    const sectionOf = (level: 'global' | 'system', prefix: string) =>
      overview.columns[level].find((r) => r.id === groupId(level, prefix))?.section;
    expect(sectionOf('global', 'Colors.Support.Shark')).toBe('Colors / Support');
    expect(sectionOf('system', 'Colors.Primary')).toBe('Colors');
    // A top-level group heads its own section, as its tokens do.
    expect(sectionOf('global', 'Sizing')).toBe('Sizing');
    expect(sectionOf('system', 'Spacing')).toBe('Spacing');
    expect(overview.columns.component.every((r) => r.section === 'Components')).toBe(true);
  });

  it('keeps groups nothing references, without links', () => {
    const linked = new Set(overview.links.flatMap((l) => [l.left, l.right]));
    expect(ids(overview, 'global').some((id) => !linked.has(id))).toBe(true);
  });

  it('dims search misses instead of removing them', () => {
    const searched = viewOf(null, { filters: { search: '  Shark ' } });
    expect(rowCounts(searched)).toEqual(rowCounts(overview));
    const shark = searched.columns.global.find((r) => r.id === groupId('global', 'Colors.Support.Shark'));
    expect(shark?.matches).toBe(shark?.memberCount);
    expect(searched.columns.system.every((r) => r.matches === 0)).toBe(true);
  });

  it('prunes what only hidden components reach when the component filter narrows', () => {
    const narrowed = viewOf(null, { filters: { enabledComponents: new Set(['button']) } });
    expect(ids(narrowed, 'component')).toEqual([groupId('component', 'button')]);
    expect(narrowed.totals).toMatchObject({ global: 29, system: 32, component: 61 });
    expect(new Set(ids(narrowed, 'ui'))).toEqual(new Set([BUTTON_CSS, ICON_BUTTON_CSS]));
  });

  it('drops filtered categories', () => {
    const noColors = viewOf(null, {
      filters: { enabledCategories: new Set(graph.categories.filter((c) => c !== 'Colors')) },
    });
    for (const column of ['global', 'system'] as const) {
      expect(noColors.columns[column].some((r) => r.title.startsWith('Colors'))).toBe(false);
    }
  });

  it('falls back to the overview for an unknown focus', () => {
    const unknown = viewOf('group::component::nope');
    expect(unknown.focusId).toBeNull();
    expect(rowCounts(unknown)).toEqual(rowCounts(overview));
  });
});

describe('computeMapView focus', () => {
  it('traces a component group up to its globals and down to its CSS files', () => {
    const button = viewOf(groupId('component', 'button'));
    expect(button.focusId).toBe(groupId('component', 'button'));
    expect(button.totals).toEqual({ global: 29, system: 32, component: 61, ui: 2 });
    expect(new Set(ids(button, 'ui'))).toEqual(new Set([BUTTON_CSS, ICON_BUTTON_CSS]));
    const focusRows = MAP_COLUMNS.flatMap((c) => button.columns[c]).filter((r) => r.isFocus);
    expect(focusRows).toEqual(button.columns.component);
  });

  it('traces a CSS file upstream only', () => {
    const view = viewOf(BUTTON_CSS, { expanded: [groupId('component', 'Site')] });
    expect(ids(view, 'ui')).toEqual([BUTTON_CSS]);
    const focusRing = 'component::components tokens.Site.focus-ring.';
    expect(ids(view, 'component').some((id) => id.startsWith(focusRing))).toBe(true);
    expect(view.totals.component).toBe(model.tokensByFile.get(BUTTON_CSS)?.length);
  });

  it('counts consumers left off the view as elsewhere', () => {
    const spacingSm = 'system::system tokens.Spacing.sm';
    const consumers = indexes.light.consumersByNode.get(spacingSm) ?? [];
    expect(consumers).toHaveLength(56);
    const view = viewOf(consumers[0].id);
    const row = view.columns.system.find((r) => r.id === spacingSm);
    expect(row?.elsewhere).toBe(55);
    expect(viewOf(spacingSm).columns.system[0].elsewhere).toBe(0);
  });

  it('counts each user of a group row once', () => {
    const footer = viewOf(FOOTER_CSS);
    const site = footer.columns.component.find((r) => r.id === groupId('component', 'Site'));
    expect(site).toMatchObject({ collapse: 'collapsed', memberCount: 3 });
    const siteTokens = model.tokensByFile.get(FOOTER_CSS)!.filter((id) => id.includes(' tokens.Site.'));
    const others = new Set(siteTokens.flatMap((id) => model.filesByToken.get(id)!));
    others.delete(FOOTER_CSS);
    expect(others.size).toBe(9);
    expect(site?.elsewhere).toBe(others.size);

    const users: Record<MapColumn, number> = {
      global: graph.stats.system,
      system: graph.stats.component,
      component: model.ui.length,
      ui: 0,
    };
    for (const ui of model.ui) {
      const view = viewOf(ui.id);
      for (const column of MAP_COLUMNS) {
        for (const r of view.columns[column]) expect(r.elsewhere).toBeLessThanOrEqual(users[column]);
      }
    }
  });

  it('puts collapsed namespaces under one heading', () => {
    const view = viewOf('system::system tokens.Spacing.sm');
    const namespaces = view.columns.component.filter((r) => r.kind === 'group');
    expect(namespaces.map((r) => r.label)).toEqual(expect.arrayContaining(['Navigation', 'Footer', 'Site']));
    expect(namespaces.every((r) => r.section === 'Components')).toBe(true);
    const loose = view.columns.component.find((r) => r.id.includes('.button.'));
    expect(loose?.section).toBe('Button');
  });

  it('labels global colours by their last two segments', () => {
    const button = viewOf(groupId('component', 'button'));
    const colors = button.columns.global.filter((r) => r.type === 'color');
    expect(colors.map((r) => r.label)).toEqual(expect.arrayContaining(['Chartreuse.600', 'Gunmetal.600']));
    for (const r of colors) expect(r.label).toBe(r.title.split('.').slice(-2).join('.'));

    const custom = viewOf(groupId('global', 'Colors.Custom.Principal palette'));
    expect(custom.columns.global.map((r) => r.label)).toContain('Principal palette.600');
  });

  it('keeps labels unique within each section', () => {
    const focusIds = [
      null,
      groupId('component', 'button'),
      groupId('component', 'Site'),
      groupId('global', 'Colors.Schemas.Metal chartreuse'),
      groupId('system', 'Typography.font-size'),
      'system::system tokens.Spacing.sm',
      BUTTON_CSS,
    ];
    for (const focusId of focusIds) {
      const view = viewOf(focusId);
      for (const column of MAP_COLUMNS) {
        const labels = view.columns[column].map((r) => `${r.section} › ${r.label}`);
        expect(new Set(labels).size).toBe(labels.length);
      }
    }
  });

  it('follows the theme’s reference for system tokens overridden in dark mode', () => {
    const darkEdge = graph.edges.find((e) => e.mode === 'dark')!;
    const lightEdge = graph.edges.find((e) => e.from === darkEdge.from && e.mode === 'light')!;
    expect(ids(viewOf(darkEdge.from), 'global')).toEqual([lightEdge.to]);
    expect(ids(viewOf(darkEdge.from, { theme: 'dark' }), 'global')).toEqual([darkEdge.to]);
  });

  it('keeps the focus on the map when the filters hide it', () => {
    const token = 'component::components tokens.button.text-color.primary.default';
    const hidden = { enabledCategories: new Set<string>(), enabledComponents: new Set<string>() };
    const view = viewOf(token, { filters: hidden });
    expect(view.columns.component).toMatchObject([{ id: token, isFocus: true }]);
    expect(view.columns.system).toHaveLength(0);

    expect(viewOf(groupId('component', 'button'), { filters: hidden }).totals.component).toBe(61);
    const noColors = { enabledCategories: new Set(graph.categories.filter((c) => c !== 'Colors')) };
    const button = viewOf(groupId('component', 'button'), { filters: noColors });
    expect(button.totals.component).toBeLessThan(61);
    expect(button.columns.component.every((r) => r.swatches.length === 0)).toBe(true);
  });

  it('gives single tokens their themed value and color swatch', () => {
    const token = 'component::components tokens.button.background-color.primary.default';
    const node = graph.nodesById.get(token)!;
    const [light] = viewOf(token).columns.component;
    const [dark] = viewOf(token, { theme: 'dark' }).columns.component;
    expect(light).toMatchObject({ value: node.resolvedValue, swatches: [node.resolvedValue] });
    expect(dark).toMatchObject({ value: node.resolvedValueDark, swatches: [node.resolvedValueDark] });
    expect(dark.value).not.toBe(light.value);
  });
});

describe('lineageOf', () => {
  it('walks left and right from a row without ever turning back', () => {
    const overview = viewOf(null);
    const button = groupId('component', 'button');
    const lineage = lineageOf(overview, button);
    expect(lineage.has(button)).toBe(true);
    expect(lineage.has(BUTTON_CSS)).toBe(true);
    expect(lineage.has(groupId('system', 'Spacing'))).toBe(true);
    expect(lineage.has(groupId('global', 'Sizing'))).toBe(true);
    // Tag shares Spacing with Button, but reaching it would mean reversing direction.
    expect(lineage.has(groupId('component', 'tag'))).toBe(false);
    const files = [...lineage].filter((id) => id.startsWith('ui::'));
    expect(new Set(files)).toEqual(new Set([BUTTON_CSS, ICON_BUTTON_CSS]));
  });
});

describe('toOpaqueHex', () => {
  it('drops alpha from hex colours and rejects everything else', () => {
    expect(toOpaqueHex('#0A60FF26')).toBe('#0A60FF');
    expect(toOpaqueHex('#F7DF1D')).toBe('#F7DF1D');
    expect(toOpaqueHex('#FFF')).toBeNull();
    expect(toOpaqueHex('rgba(0, 0, 0, 0.5)')).toBeNull();
    expect(toOpaqueHex('12px')).toBeNull();
  });
});
