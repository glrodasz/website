import { useMemo, useState } from 'react';
import { buildTokenGraph } from '../tokens/graph-builder';
import { TokenTree, type TokenTreeFilters } from '../components/organisms/TokenTree';
import './Tokens.css';

export default function Tokens() {
  const graph = useMemo(() => buildTokenGraph(), []);

  const [enabledComponents, setEnabledComponents] = useState<Set<string>>(
    () => new Set(graph.componentNames),
  );
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    () => new Set(graph.categories),
  );
  const [showSystemLight, setShowSystemLight] = useState(true);
  const [showSystemDark, setShowSystemDark] = useState(true);

  const filters: TokenTreeFilters = {
    enabledComponents,
    enabledCategories,
    showSystemLight,
    showSystemDark,
  };

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const allComponentsOn = enabledComponents.size === graph.componentNames.length;
  const allCategoriesOn = enabledCategories.size === graph.categories.length;

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            scroll to zoom, hover a node to inspect its references.
          </p>
        </header>

        <section className="tokens-page__stats">
          <div><strong>{graph.stats.global}</strong> global</div>
          <div><strong>{graph.stats.systemLight}</strong> system (light)</div>
          <div><strong>{graph.stats.systemDark}</strong> system (dark overrides)</div>
          <div><strong>{graph.stats.component}</strong> component</div>
          <div><strong>{graph.stats.edges}</strong> references</div>
        </section>

        <section className="tokens-page__filter-group">
          <h2 className="tokens-page__filter-title">Layers</h2>
          <label className="tokens-page__filter-row">
            <input
              type="checkbox"
              checked={showSystemLight}
              onChange={() => setShowSystemLight(v => !v)}
            />
            System · light
          </label>
          <label className="tokens-page__filter-row">
            <input
              type="checkbox"
              checked={showSystemDark}
              onChange={() => setShowSystemDark(v => !v)}
            />
            System · dark overrides
          </label>
        </section>

        <section className="tokens-page__filter-group">
          <div className="tokens-page__filter-head">
            <h2 className="tokens-page__filter-title">Categories</h2>
            <button
              type="button"
              onClick={() =>
                setEnabledCategories(
                  allCategoriesOn ? new Set() : new Set(graph.categories),
                )
              }
            >
              {allCategoriesOn ? 'none' : 'all'}
            </button>
          </div>
          {graph.categories.map((cat) => (
            <label key={cat} className="tokens-page__filter-row">
              <input
                type="checkbox"
                checked={enabledCategories.has(cat)}
                onChange={() => toggle(enabledCategories, cat, setEnabledCategories)}
              />
              {cat}
            </label>
          ))}
        </section>

        <section className="tokens-page__filter-group">
          <div className="tokens-page__filter-head">
            <h2 className="tokens-page__filter-title">Components</h2>
            <button
              type="button"
              onClick={() =>
                setEnabledComponents(
                  allComponentsOn ? new Set() : new Set(graph.componentNames),
                )
              }
            >
              {allComponentsOn ? 'none' : 'all'}
            </button>
          </div>
          <div className="tokens-page__filter-list">
            {graph.componentNames.map((name) => (
              <label key={name} className="tokens-page__filter-row">
                <input
                  type="checkbox"
                  checked={enabledComponents.has(name)}
                  onChange={() => toggle(enabledComponents, name, setEnabledComponents)}
                />
                {name}
              </label>
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
