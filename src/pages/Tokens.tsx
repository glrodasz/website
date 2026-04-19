import { useMemo, useState } from 'react';
import { buildTokenGraph } from '../tokens/graph-builder';
import { TokenTree, type TokenTreeFilters } from '../components/organisms/TokenTree';
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
 * - Label is clickable when onSelectLabel is provided (focus chain)
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
          title="Focus this component's reference chain"
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
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [focusedComponent, setFocusedComponent] = useState<string | null>(null);
  const [componentQuery, setComponentQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filters: TokenTreeFilters = {
    enabledComponents,
    enabledCategories,
    theme,
    focusedComponent,
    viewMode,
  };

  const toggleIn = (set: Set<string>, key: string, setter: SetStringSetter) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const filteredComponentNames = useMemo(() => {
    const q = componentQuery.trim().toLowerCase();
    if (!q) return graph.componentNames;
    return graph.componentNames.filter((n) => n.toLowerCase().includes(q));
  }, [componentQuery, graph.componentNames]);

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
          <h1 className="tokens-page__title">Token Reference Tree</h1>
          <p className="tokens-page__description">
            Interactive view of the three-level design token hierarchy. Drag to orbit,
            scroll to zoom, hover a node to inspect its references. Click a component
            name below to highlight its reference chain across all layers.
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
          <h2 className="tokens-page__filter-title">View</h2>
          <div
            className="tokens-page__theme-switch"
            role="radiogroup"
            aria-label="View mode"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === '2d'}
              className={`tokens-page__theme-option${viewMode === '2d' ? ' tokens-page__theme-option--active' : ''}`}
              onClick={() => setViewMode('2d')}
            >
              2D
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === '3d'}
              className={`tokens-page__theme-option${viewMode === '3d' ? ' tokens-page__theme-option--active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D
            </button>
          </div>
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

          <input
            type="search"
            className="tokens-page__search"
            value={componentQuery}
            onChange={(e) => setComponentQuery(e.target.value)}
            placeholder={`Filter ${graph.componentNames.length} components…`}
            aria-label="Filter components by name"
          />

          <div className="tokens-page__filter-list">
            {filteredComponentNames.length === 0 && (
              <div className="tokens-page__empty">No components match “{componentQuery}”.</div>
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

      <div className="tokens-page__canvas">
        <TokenTree graph={graph} filters={filters} />
      </div>
    </div>
  );
}
