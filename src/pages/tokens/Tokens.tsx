import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildTokenGraph, indexEdges, type ThemeMode } from '../../tokens/graph-builder';
import { runTokenAudit } from '../../tokens/audit';
import { Seo } from '../../components/Seo';
import { useTheme } from '../../hooks/useTheme';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { TokenExplorer } from './TokenExplorer';
import { TokenInspector } from './TokenInspector';
import { displayComponentName, isExplorerTab, matchesSearch, type ExplorerTab } from './utils';
import './Tokens.css';

const DEFAULT_TAB: ExplorerTab = 'components';
/** Must match the breakpoint in Tokens.css where the sidebar becomes a drawer. */
const NARROW_QUERY = '(max-width: 900px)';

interface FilterRowProps {
  name: string;
  checked: boolean;
  focused?: boolean;
  onToggle: () => void;
  onOnly: () => void;
  onFocus?: () => void;
}

/**
 * Sidebar filter row: the whole row is a single switch that shows/hides the
 * item — no competing click targets. Secondary actions appear on hover:
 * "only" (exclusive select) and, for components, "view" (jump to its card).
 */
function FilterRow({ name, checked, focused, onToggle, onOnly, onFocus }: FilterRowProps) {
  return (
    <div className={`tokens-filter-row${focused ? ' tokens-filter-row--focused' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className="tokens-filter-row__main"
        onClick={onToggle}
        title={checked ? `Hide ${name}` : `Show ${name}`}
      >
        <span className="tokens-switch" aria-hidden="true">
          <span className="tokens-switch__thumb" />
        </span>
        <span className="tokens-filter-row__label">{name}</span>
      </button>
      <span className="tokens-filter-row__actions">
        {onFocus && (
          <button
            type="button"
            className="tokens-filter-row__action"
            onClick={onFocus}
            title={`Jump to ${name}'s tokens`}
          >
            view
          </button>
        )}
        <button
          type="button"
          className="tokens-filter-row__action"
          onClick={onOnly}
          title={`Select only ${name}`}
        >
          only
        </button>
      </span>
    </div>
  );
}

function toggleInSet(set: Set<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export default function Tokens() {
  const graph = useMemo(() => buildTokenGraph(), []);
  const audit = useMemo(() => runTokenAudit(graph), [graph]);
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

  // Deep links: /tokens?component=button focuses that component,
  // /tokens?tab=audit opens a specific tab. Both are kept in sync with the URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<ExplorerTab>(() => {
    const fromUrl = searchParams.get('tab');
    return isExplorerTab(fromUrl) ? fromUrl : DEFAULT_TAB;
  });
  const [focusedComponent, setFocusedComponent] = useState<string | null>(() => {
    const fromUrl = searchParams.get('component');
    return fromUrl && graph.componentNames.includes(fromUrl) ? fromUrl : null;
  });

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (focusedComponent) next.set('component', focusedComponent);
        else next.delete('component');
        if (tab !== DEFAULT_TAB) next.set('tab', tab);
        else next.delete('tab');
        return next;
      },
      { replace: true },
    );
  }, [focusedComponent, tab, setSearchParams]);

  /**
   * The single way to focus a component, whatever the entry point (sidebar
   * "view", inspector "View component", banner "clear"): a hidden component
   * is re-enabled so its card exists, and the Components tab is shown.
   */
  const focusComponent = useCallback((name: string | null) => {
    if (name) {
      setEnabledComponents((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
      setTab('components');
    }
    setFocusedComponent(name);
  }, []);

  const onSelectToken = (nodeId: string) =>
    setSelectedId((prev) => (prev === nodeId ? null : nodeId));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selectedId !== null) setSelectedId(null);
      else setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  // On narrow viewports the sidebar is an off-canvas drawer: keep it out of
  // the tab order while closed and trap focus inside it while open. Focus goes
  // to the drawer itself, not to the search field it starts with — focusing a
  // text field would open the keyboard over the filters on every open.
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const sidebarRef = useRef<HTMLElement>(null);
  const drawerOpen = isNarrow && sidebarOpen;
  useFocusTrap(sidebarRef, drawerOpen, { initialFocus: 'container' });

  // Sidebar list follows the same search as the explorer: a component stays
  // listed when its name matches or when any of its tokens match.
  const filteredComponentNames = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return graph.componentNames;
    const withMatchingToken = new Set<string>();
    for (const node of graph.nodes) {
      if (node.level === 'component' && node.componentName && matchesSearch(node, q)) {
        withMatchingToken.add(node.componentName);
      }
    }
    return graph.componentNames.filter(
      (n) =>
        withMatchingToken.has(n) ||
        n.toLowerCase().includes(q) ||
        displayComponentName(n).toLowerCase().includes(q),
    );
  }, [search, graph]);

  return (
    <div className={`tokens-page${sidebarOpen ? ' tokens-page--sidebar-open' : ''}`}>
      <Seo title="Design Tokens" description="Explorer for the Quantum Design token hierarchy." path="/tokens" />
      <meta name="robots" content="noindex" />

      <button
        type="button"
        className="tokens-page__sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? 'Close filters' : 'Open filters'}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? '✕' : '☰ Filters'}
      </button>

      {sidebarOpen && (
        <div
          className="tokens-page__backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className="tokens-page__sidebar"
        aria-label="Token filters"
        tabIndex={-1}
        inert={isNarrow && !sidebarOpen}
      >
        <header className="tokens-page__header">
          <h1 className="tokens-page__title">Design Tokens</h1>
          <p className="tokens-page__description">
            Browse the three-level token hierarchy. Tap any token to inspect the
            chain it resolves through (component → system → global). Toggle the
            rows below to show or hide tokens.
          </p>
        </header>

        {focusedComponent && (
          <div className="tokens-focus-banner">
            <span>
              Viewing <strong>{displayComponentName(focusedComponent)}</strong>
            </span>
            <button type="button" onClick={() => focusComponent(null)}>
              clear
            </button>
          </div>
        )}

        <section className="tokens-page__stats">
          <div><strong>{graph.stats.global}</strong> global</div>
          <div>
            <strong>{graph.stats.system}</strong> system
            <span className="tokens-page__stats-note">
              ({graph.stats.systemDarkOverrides} overridden in dark)
            </span>
          </div>
          <div><strong>{graph.stats.component}</strong> component</div>
          <div><strong>{graph.stats.edges}</strong> references</div>
        </section>

        <div className="tokens-page__filter-group">
          <label className="sr-only" htmlFor="tokens-search">Search tokens by name</label>
          <input
            id="tokens-search"
            type="search"
            className="tokens-page__search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens…"
          />
        </div>

        <section className="tokens-page__filter-group">
          <h2 className="tokens-page__filter-title">Preview values</h2>
          <div
            className="tokens-page__theme-switch"
            role="radiogroup"
            aria-label="Theme whose values are shown"
          >
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'light'}
              className={`tokens-page__theme-option${theme === 'light' ? ' tokens-page__theme-option--active' : ''}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'dark'}
              className={`tokens-page__theme-option${theme === 'dark' ? ' tokens-page__theme-option--active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </section>

        <section className="tokens-page__filter-group">
          <div className="tokens-page__filter-head">
            <h2 className="tokens-page__filter-title">Categories</h2>
            <div className="tokens-page__bulk">
              <button type="button" onClick={() => setEnabledCategories(new Set(graph.categories))}>
                all
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => setEnabledCategories(new Set())}>
                none
              </button>
            </div>
          </div>
          {graph.categories.map((cat) => (
            <FilterRow
              key={cat}
              name={cat}
              checked={enabledCategories.has(cat)}
              onToggle={() => setEnabledCategories((prev) => toggleInSet(prev, cat))}
              onOnly={() => setEnabledCategories(new Set([cat]))}
            />
          ))}
        </section>

        <section className="tokens-page__filter-group">
          <div className="tokens-page__filter-head">
            <h2 className="tokens-page__filter-title">Components</h2>
            <div className="tokens-page__bulk">
              <button
                type="button"
                onClick={() => setEnabledComponents(new Set(graph.componentNames))}
              >
                all
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => setEnabledComponents(new Set())}>
                none
              </button>
            </div>
          </div>

          <div className="tokens-page__filter-list">
            {filteredComponentNames.length === 0 && (
              <div className="tokens-page__empty">No tokens match “{search}”.</div>
            )}
            {filteredComponentNames.map((name) => (
              <FilterRow
                key={name}
                name={displayComponentName(name)}
                checked={enabledComponents.has(name)}
                focused={focusedComponent === name}
                onToggle={() => setEnabledComponents((prev) => toggleInSet(prev, name))}
                onOnly={() => setEnabledComponents(new Set([name]))}
                onFocus={() => focusComponent(focusedComponent === name ? null : name)}
              />
            ))}
          </div>
        </section>
      </aside>

      <div className="tokens-page__content">
        <TokenExplorer
          graph={graph}
          index={index}
          audit={audit}
          theme={theme}
          tab={tab}
          onTabChange={setTab}
          search={search}
          enabledCategories={enabledCategories}
          enabledComponents={enabledComponents}
          focusedComponent={focusedComponent}
          selectedId={selectedId}
          onSelect={onSelectToken}
        />
        {selectedId && graph.nodesById.has(selectedId) && (
          <TokenInspector
            graph={graph}
            index={index}
            selectedId={selectedId}
            theme={theme}
            onSelect={setSelectedId}
            onFocusComponent={focusComponent}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
