import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildTokenGraph } from '../tokens/graph-builder';
import { TokenExplorer, TokenInspector } from '../components/organisms/TokenExplorer';
import type { ExplorerTab } from '../components/organisms/TokenExplorer';
import './Tokens.css';

type SetStringSetter = (s: Set<string>) => void;

interface FilterRowProps {
  name: string;
  checked: boolean;
  focused?: boolean;
  onToggleCheck: () => void;
  onOnly: () => void;
  onSelectLabel?: () => void;
}

/**
 * Datadog-style filter row:
 * - Checkbox on the left controls visibility
 * - Label is clickable when onSelectLabel is provided (focus the component)
 * - Hover reveals an inline "only" action to exclusively select this item
 */
function FilterRow({ name, checked, focused, onToggleCheck, onOnly, onSelectLabel }: FilterRowProps) {
  return (
    <div className={`tokens-filter-row${focused ? ' tokens-filter-row--focused' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggleCheck}
        aria-label={`Show ${name}`}
      />
      {onSelectLabel ? (
        <button
          type="button"
          className="tokens-filter-row__label tokens-filter-row__label--clickable"
          onClick={onSelectLabel}
          title="Focus this component's tokens"
        >
          {name}
        </button>
      ) : (
        <span className="tokens-filter-row__label">{name}</span>
      )}
      <button
        type="button"
        className="tokens-filter-row__only"
        onClick={onOnly}
        title={`Select only ${name}`}
      >
        only
      </button>
    </div>
  );
}

export default function Tokens() {
  const graph = useMemo(() => buildTokenGraph(), []);

  const [enabledComponents, setEnabledComponents] = useState<Set<string>>(
    () => new Set(graph.componentNames),
  );
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    () => new Set(graph.categories),
  );
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Deep links: /tokens?component=button focuses that component on load,
  // /tokens?tab=audit opens the explorer on a specific tab.
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialTab] = useState<ExplorerTab | undefined>(() => {
    const fromUrl = searchParams.get('tab');
    return fromUrl && ['components', 'system', 'global', 'audit'].includes(fromUrl)
      ? (fromUrl as ExplorerTab)
      : undefined;
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
        return next;
      },
      { replace: true },
    );
  }, [focusedComponent, setSearchParams]);

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

  const toggleIn = (set: Set<string>, key: string, setter: SetStringSetter) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const filteredComponentNames = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return graph.componentNames;
    return graph.componentNames.filter((n) => n.toLowerCase().includes(q));
  }, [search, graph.componentNames]);

  return (
    <div className={`tokens-page${sidebarOpen ? ' tokens-page--sidebar-open' : ''}`}>
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

      <aside className="tokens-page__sidebar">
        <header className="tokens-page__header">
          <h1 className="tokens-page__title">Design Tokens</h1>
          <p className="tokens-page__description">
            Browse the three-level token hierarchy. Tap any token to inspect the
            chain it resolves through (component → system → global), or click a
            component name below to focus its tokens.
          </p>
        </header>

        {focusedComponent && (
          <div className="tokens-focus-banner">
            <span>
              Focused on <strong>{focusedComponent}</strong>
            </span>
            <button type="button" onClick={() => setFocusedComponent(null)}>
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

        <section className="tokens-page__filter-group">
          <h2 className="tokens-page__filter-title">Search</h2>
          <input
            type="search"
            className="tokens-page__search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens…"
            aria-label="Search tokens by name"
          />
        </section>

        <section className="tokens-page__filter-group">
          <h2 className="tokens-page__filter-title">Theme</h2>
          <div
            className="tokens-page__theme-switch"
            role="radiogroup"
            aria-label="Preview theme"
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
              onToggleCheck={() => toggleIn(enabledCategories, cat, setEnabledCategories)}
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
              <div className="tokens-page__empty">No components match “{search}”.</div>
            )}
            {filteredComponentNames.map((name) => (
              <FilterRow
                key={name}
                name={name}
                checked={enabledComponents.has(name)}
                focused={focusedComponent === name}
                onToggleCheck={() =>
                  toggleIn(enabledComponents, name, setEnabledComponents)
                }
                onOnly={() => {
                  setEnabledComponents(new Set([name]));
                  setFocusedComponent(name);
                }}
                onSelectLabel={() =>
                  setFocusedComponent((current) => (current === name ? null : name))
                }
              />
            ))}
          </div>
        </section>
      </aside>

      <div className="tokens-page__content">
        <TokenExplorer
          graph={graph}
          theme={theme}
          search={search}
          enabledCategories={enabledCategories}
          enabledComponents={enabledComponents}
          focusedComponent={focusedComponent}
          selectedId={selectedId}
          onSelect={onSelectToken}
          initialTab={initialTab}
        />
        {selectedId && graph.nodesById.has(selectedId) && (
          <TokenInspector
            graph={graph}
            selectedId={selectedId}
            theme={theme}
            onSelect={setSelectedId}
            onFocusComponent={setFocusedComponent}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
