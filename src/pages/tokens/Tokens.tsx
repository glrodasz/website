/**
 * The /tokens playground, laid out like Storybook: a sidebar that picks the
 * view, a toolbar of preview and filter controls, the canvas, and a docked
 * addons panel for the selected token.
 *
 * All state lives here so it can be deep-linked and shared by the shell:
 * the view, the map's focus history and 2D/3D mode, the filters, the
 * previewed theme, the selection and the panel's remembered layout.
 */

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildTokenGraph, indexEdges, type ThemeMode } from '../../tokens/graph-builder';
import { runTokenAudit } from '../../tokens/audit';
import { tokenUsages } from '../../generated/token-usage';
import { Seo } from '../../components/Seo';
import { useTheme } from '../../hooks/useTheme';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { TokenExplorer } from './TokenExplorer';
import { buildLineageModel, groupId, resolveMapId } from './map/lineage';
import type { MapMode } from './map/MapView';
import { AddonsPanel } from './shell/AddonsPanel';
import { Sidebar } from './shell/Sidebar';
import { Toolbar } from './shell/Toolbar';
import {
  componentTokenCounts,
  isTextEntry,
  readPanelPrefs,
  sortedComponentNames,
  writePanelPrefs,
  type PanelPrefs,
} from './shell/helpers';
import { displayComponentName, isExplorerTab, type ExplorerTab } from './utils';
import './playground.css';
import './Tokens.css';
import './shell/shell.css';

const DEFAULT_TAB: ExplorerTab = 'map';
/** Map focus history kept for Back and the breadcrumb. */
const MAX_MAP_TRAIL = 12;
/** Must match the breakpoint in Tokens.css where the sidebar becomes a drawer. */
const NARROW_QUERY = '(max-width: 900px)';
const SIDEBAR_ID = 'tokens-sidebar';
const COMPONENT_GROUP = groupId('component', '');
const PREFS_WRITE_DELAY_MS = 250;

export default function Tokens() {
  const graph = useMemo(() => buildTokenGraph(), []);
  const audit = useMemo(() => runTokenAudit(graph), [graph]);
  const lineage = useMemo(() => buildLineageModel(graph, tokenUsages), [graph]);
  const siteTheme = useTheme().theme;

  const [enabledComponents, setEnabledComponents] = useState<Set<string>>(
    () => new Set(graph.componentNames),
  );
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    () => new Set(graph.categories),
  );
  // Which theme's values are previewed. Starts on the site theme so the
  // explorer agrees with what the visitor currently sees.
  const [theme, setTheme] = useState<ThemeMode>(siteTheme);
  const index = useMemo(() => indexEdges(graph, theme), [graph, theme]);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelPrefs>(readPanelPrefs);
  // Debounced, since a handle drag changes the height on every pointer move,
  // and flushed on unmount so leaving the page right after a change keeps it.
  const latestPanel = useRef(panel);
  useEffect(() => {
    latestPanel.current = panel;
    const timer = window.setTimeout(() => writePanelPrefs(panel), PREFS_WRITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [panel]);
  useEffect(() => () => writePanelPrefs(latestPanel.current), []);

  // Deep links: /tokens?tab=audit opens a specific tab, ?component=button
  // focuses that component's card (and, without a tab, opens Components as
  // links made before the Map tab did), ?focus=<id>&view=3d restore the map.
  // All of them are kept in sync with the URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<ExplorerTab>(() => {
    const fromUrl = searchParams.get('tab');
    if (isExplorerTab(fromUrl)) return fromUrl;
    return searchParams.has('component') ? 'components' : DEFAULT_TAB;
  });
  const [focusedComponent, setFocusedComponent] = useState<string | null>(() => {
    const fromUrl = searchParams.get('component');
    return fromUrl && graph.componentNames.includes(fromUrl) ? fromUrl : null;
  });
  // The map's focus history, newest last. The URL only carries the current
  // focus (it is replaced, not pushed), so Back walks this instead.
  const [mapTrail, setMapTrail] = useState<string[]>(() => {
    const fromUrl = searchParams.get('focus');
    return fromUrl && resolveMapId(lineage, fromUrl) ? [fromUrl] : [];
  });
  const mapFocus = mapTrail.at(-1) ?? null;
  const [mapMode, setMapMode] = useState<MapMode>(() =>
    searchParams.get('view') === '3d' ? '3d' : '2d',
  );
  // Once WebGL fails it stays failed for the page's life: 3D is not offered again.
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const activeMapMode: MapMode = webglUnavailable ? '2d' : mapMode;

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (focusedComponent) next.set('component', focusedComponent);
        else next.delete('component');
        // A component without a tab reads as a legacy Components link, so the
        // default tab is spelled out whenever a component is in the URL.
        if (tab !== DEFAULT_TAB || focusedComponent) next.set('tab', tab);
        else next.delete('tab');
        if (tab === 'map' && mapFocus) next.set('focus', mapFocus);
        else next.delete('focus');
        if (tab === 'map' && mapMode === '3d') next.set('view', '3d');
        else next.delete('view');
        return next;
      },
      { replace: true },
    );
  }, [focusedComponent, tab, mapFocus, mapMode, setSearchParams]);

  /** Focuses the map on a row id; revisiting an earlier focus rewinds the trail to it. */
  const focusMap = useCallback((id: string) => {
    setMapTrail((trail) => {
      if (trail.at(-1) === id) return trail;
      const earlier = trail.indexOf(id);
      if (earlier >= 0) return trail.slice(0, earlier + 1);
      return [...trail, id].slice(-MAX_MAP_TRAIL);
    });
  }, []);
  const mapBack = useCallback(() => setMapTrail((trail) => trail.slice(0, -1)), []);
  const mapReset = useCallback(() => setMapTrail([]), []);

  /**
   * The single way to focus a component, whatever the entry point (sidebar
   * tree, inspector "View component"). On the Map tab it traces the
   * component's lineage; elsewhere a hidden component is re-enabled so its
   * card exists, and the Components tab is shown.
   */
  const focusComponent = useCallback(
    (name: string | null) => {
      if (name && tab === 'map') {
        focusMap(groupId('component', name));
        return;
      }
      if (name) {
        setEnabledComponents((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
        setTab('components');
      }
      setFocusedComponent(name);
    },
    [tab, focusMap],
  );

  const onMapUnavailable = useCallback(() => {
    // The 3D button is about to be disabled; keep keyboard focus on the switch.
    const threeD = document.querySelector('[data-map-mode="3d"]');
    if (threeD && document.activeElement === threeD) {
      document.querySelector<HTMLElement>('[data-map-mode="2d"]')?.focus();
    }
    setWebglUnavailable(true);
    setMapMode('2d');
  }, []);

  // On narrow viewports the sidebar is an off-canvas drawer: keep it out of
  // the tab order while closed and trap focus inside it while open. Focus goes
  // to the drawer itself, not to the search field it starts with — focusing a
  // text field would open the keyboard over the tree on every open.
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const drawerOpen = isNarrow && sidebarOpen;
  useFocusTrap(sidebarRef, drawerOpen, { initialFocus: 'container' });
  // '/' on a narrow screen opens the drawer first; the search is focused once
  // the trap above has taken focus into it.
  const searchOnOpen = useRef(false);
  useEffect(() => {
    if (!drawerOpen || !searchOnOpen.current) return;
    searchOnOpen.current = false;
    searchRef.current?.focus();
  }, [drawerOpen]);

  // The selection's origin (the row or chip clicked), to hand focus back to
  // when the selection closes from inside the panel.
  const selectOrigin = useRef<HTMLElement | null>(null);
  // Stable: these reach every map row through memoised callbacks, so a new
  // identity per render would re-render the whole map on any page change.
  const noteOrigin = useCallback(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && !active.closest('[data-tokens-panel]')) {
      selectOrigin.current = active;
    }
  }, []);
  const openPanel = useCallback(() => setPanel((p) => (p.open ? p : { ...p, open: true })), []);
  const onSelectToken = useCallback(
    (nodeId: string) => {
      noteOrigin();
      openPanel();
      setSelectedId((prev) => (prev === nodeId ? null : nodeId));
    },
    [noteOrigin, openPanel],
  );
  const onInspect = useCallback(
    (nodeId: string) => {
      noteOrigin();
      openPanel();
      setSelectedId(nodeId);
    },
    [noteOrigin, openPanel],
  );

  const panelHasFocus = () =>
    document.querySelector('[data-tokens-panel]')?.contains(document.activeElement) ?? false;
  const returnFocusFromPanel = () => {
    const origin = selectOrigin.current;
    const target =
      origin?.isConnected ? origin
      : (document.querySelector<HTMLElement>('.token-map__row--focus') ??
        document.querySelector<HTMLElement>('.token-explorer'));
    target?.focus();
  };
  const clearSelection = () => {
    if (panelHasFocus()) returnFocusFromPanel();
    setSelectedId(null);
  };
  const hidePanel = () => {
    if (panelHasFocus()) document.querySelector<HTMLElement>('[aria-label="Addons panel"]')?.focus();
    setPanel((p) => ({ ...p, open: false }));
  };

  // Escape unwinds one layer at a time: an open menu (which handles it
  // itself), the selection, the drawer, then the map focus. Escape in a text
  // field clears it instead of leaving the map focus. '/' jumps to search.
  const canPopMap = tab === 'map' && mapTrail.length > 0;
  const onWindowKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTextEntry(e.target)) {
      e.preventDefault();
      if (isNarrow && !sidebarOpen) {
        searchOnOpen.current = true;
        setSidebarOpen(true);
      } else {
        searchRef.current?.focus();
      }
      return;
    }
    if (e.key !== 'Escape') return;
    if (selectedId !== null) clearSelection();
    else if (drawerOpen) setSidebarOpen(false);
    else if (canPopMap && !(e.target instanceof HTMLInputElement)) mapBack();
  });
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onWindowKeyDown(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const categoryItems = useMemo(
    () => graph.categories.map((c) => ({ key: c, label: c })),
    [graph],
  );
  const componentItems = useMemo(
    () => sortedComponentNames(graph).map((n) => ({ key: n, label: displayComponentName(n) })),
    [graph],
  );
  const componentCounts = useMemo(() => componentTokenCounts(graph), [graph]);
  const filtersChanged =
    enabledCategories.size !== graph.categories.length ||
    enabledComponents.size !== graph.componentNames.length;

  const activeComponent =
    tab === 'map'
      ? mapFocus?.startsWith(COMPONENT_GROUP)
        ? mapFocus.slice(COMPONENT_GROUP.length)
        : null
      : tab === 'components'
        ? focusedComponent
        : null;

  const selected = selectedId !== null && graph.nodesById.has(selectedId) ? selectedId : null;
  const showPanel = isNarrow ? selected !== null : panel.open;

  return (
    <div className={`tokens-page${sidebarOpen ? ' tokens-page--sidebar-open' : ''}`}>
      <Seo title="Design Tokens" description="Explorer for the Quantum Design token hierarchy." path="/tokens" />
      <meta name="robots" content="noindex" />

      {drawerOpen && (
        <div
          className="tokens-page__backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        id={SIDEBAR_ID}
        ref={sidebarRef}
        searchRef={searchRef}
        graph={graph}
        audit={audit}
        tab={tab}
        onTabChange={(next) => {
          setTab(next);
          setSidebarOpen(false);
        }}
        components={componentItems}
        componentCounts={componentCounts}
        enabledComponents={enabledComponents}
        activeComponent={activeComponent}
        onComponentSelect={(name) => {
          // Picking a hidden component in the tree shows it again.
          setEnabledComponents((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
          // Only an item shown as active toggles off; elsewhere the click opens it.
          focusComponent(tab === 'components' && focusedComponent === name ? null : name);
          setSidebarOpen(false);
        }}
        search={search}
        onSearchChange={setSearch}
        inert={isNarrow && !sidebarOpen}
        onClose={drawerOpen ? () => setSidebarOpen(false) : null}
      />

      <div className="tokens-page__content">
        <Toolbar
          theme={theme}
          onThemeChange={setTheme}
          categories={categoryItems}
          enabledCategories={enabledCategories}
          onCategoriesChange={setEnabledCategories}
          components={componentItems}
          enabledComponents={enabledComponents}
          onComponentsChange={setEnabledComponents}
          mapMode={tab === 'map' ? activeMapMode : null}
          webglUnavailable={webglUnavailable}
          onMapModeChange={setMapMode}
          filtersChanged={filtersChanged}
          onResetFilters={() => {
            setEnabledCategories(new Set(graph.categories));
            setEnabledComponents(new Set(graph.componentNames));
          }}
          panelOpen={isNarrow ? null : panel.open}
          onTogglePanel={() => (panel.open ? hidePanel() : openPanel())}
          navOpen={isNarrow ? sidebarOpen : null}
          navId={SIDEBAR_ID}
          onToggleNav={() => setSidebarOpen((v) => !v)}
        />

        <div className="tokens-page__stage">
          <TokenExplorer
            graph={graph}
            index={index}
            audit={audit}
            theme={theme}
            tab={tab}
            search={search}
            enabledCategories={enabledCategories}
            enabledComponents={enabledComponents}
            focusedComponent={focusedComponent}
            selectedId={selected}
            onSelect={onSelectToken}
            onInspect={onInspect}
            lineage={lineage}
            mapTrail={mapTrail}
            mapMode={activeMapMode}
            onMapFocus={focusMap}
            onMapBack={mapBack}
            onMapReset={mapReset}
            onMapUnavailable={onMapUnavailable}
          />
          {showPanel && (
            <AddonsPanel
              graph={graph}
              index={index}
              lineage={lineage}
              theme={theme}
              selectedId={selected}
              onSelect={setSelectedId}
              onFocusComponent={focusComponent}
              onTraceFile={(uiId) => {
                setTab('map');
                focusMap(uiId);
              }}
              tab={panel.tab}
              onTabChange={(next) => setPanel((p) => ({ ...p, tab: next }))}
              mode={isNarrow ? 'sheet' : 'docked'}
              height={panel.height}
              onHeightChange={(height) => setPanel((p) => ({ ...p, height }))}
              onClose={isNarrow ? clearSelection : hidePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
