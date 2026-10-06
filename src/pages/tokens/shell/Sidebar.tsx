/**
 * The playground sidebar, after Storybook's explorer: the brand, the token
 * search ('/' focuses it) and a nav tree of the views — Map, the three token
 * levels with Components expandable to one row per component, and Audit.
 * The active view is an accent pill. Below the drawer breakpoint the page
 * slides it in as an off-canvas drawer.
 */

import { useEffect, useId, useMemo, useRef, useState, type Ref, type RefObject } from 'react';
import type { TokenGraph } from '../../../tokens/graph-builder';
import type { AuditReport } from '../../../tokens/audit';
import { matchesSearch, type ExplorerTab } from '../utils';
import type { FilterItem } from './Toolbar';
import { Icon, type IconName } from './Icon';

export interface SidebarProps {
  id: string;
  ref: Ref<HTMLDivElement>;
  searchRef: RefObject<HTMLInputElement | null>;
  graph: TokenGraph;
  audit: AuditReport;
  tab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
  /** Every component namespace, in display order. */
  components: readonly FilterItem[];
  componentCounts: ReadonlyMap<string, number>;
  enabledComponents: ReadonlySet<string>;
  /** The component the current view is focused on, if any. */
  activeComponent: string | null;
  onComponentSelect: (name: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  /** Set while the sidebar is the narrow-screen drawer. */
  inert: boolean;
  /** Present while the sidebar is an open drawer. */
  onClose: (() => void) | null;
}

interface LevelItem {
  tab: ExplorerTab;
  label: string;
  icon: IconName;
  count: number;
  title: string;
}

export function Sidebar({
  id,
  ref,
  searchRef,
  graph,
  audit,
  tab,
  onTabChange,
  components,
  componentCounts,
  enabledComponents,
  activeComponent,
  onComponentSelect,
  search,
  onSearchChange,
  inert,
  onClose,
}: SidebarProps) {
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(true);

  // The tree is longer than most screens: keep the active item in view as the view changes.
  useEffect(() => {
    navRef.current?.querySelector('.tokens-nav__item--active')?.scrollIntoView({ block: 'nearest' });
  }, [tab, activeComponent]);
  const query = search.trim().toLowerCase();

  // The component list follows the token search: a component stays listed
  // when its name matches or when any of its tokens do.
  const listed = useMemo(() => {
    if (!query) return components;
    const withMatch = new Set<string>();
    for (const node of graph.nodes) {
      if (node.level === 'component' && node.componentName && matchesSearch(node, query)) {
        withMatch.add(node.componentName);
      }
    }
    return components.filter(
      (c) => withMatch.has(c.key) || c.key.includes(query) || c.label.toLowerCase().includes(query),
    );
  }, [components, graph, query]);
  const showComponents = expanded || query !== '';

  const levels: LevelItem[] = [
    {
      tab: 'global',
      label: 'Global',
      icon: 'global',
      count: graph.stats.global,
      title: 'Raw values: palettes and scales',
    },
    {
      tab: 'system',
      label: 'System',
      icon: 'system',
      count: graph.stats.system,
      title: `Semantic aliases; ${graph.stats.systemDarkOverrides} overridden in dark`,
    },
  ];

  const actionable = audit.counts.error + audit.counts.warning;
  const severity = audit.counts.error > 0 ? 'error' : audit.counts.warning > 0 ? 'warning' : 'ok';
  const auditSummary = `${audit.counts.error} errors, ${audit.counts.warning} warnings, ${audit.counts.info} notes`;

  const item = (target: ExplorerTab, icon: IconName, label: string, extra: React.ReactNode, title?: string) => (
    <button
      type="button"
      className={`tokens-nav__item${tab === target ? ' tokens-nav__item--active' : ''}`}
      aria-current={tab === target ? 'page' : undefined}
      title={title}
      onClick={() => onTabChange(target)}
    >
      <Icon name={icon} className="tokens-nav__icon" />
      <span className="tokens-nav__label">{label}</span>
      {extra}
    </button>
  );

  return (
    <div
      ref={ref}
      id={id}
      className="tokens-sidebar"
      tabIndex={-1}
      inert={inert}
      aria-label={onClose ? 'Token navigation' : undefined}
      role={onClose ? 'dialog' : undefined}
      aria-modal={onClose ? true : undefined}
    >
      <div className="tokens-sidebar__brand">
        <span className="tokens-sidebar__logo" aria-hidden="true">
          Q
        </span>
        <h1 className="tokens-sidebar__title">
          Quantum Design
          <span className="tokens-sidebar__subtitle">Design tokens</span>
        </h1>
        {onClose && (
          <button
            type="button"
            className="tokens-sidebar__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      <div className="tokens-sidebar__search" role="search">
        <Icon name="search" className="tokens-sidebar__search-icon" />
        <input
          ref={searchRef}
          type="search"
          className="tokens-sidebar__search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find tokens"
          aria-label="Search tokens by name"
          aria-keyshortcuts="/"
        />
        {search === '' && (
          <kbd className="tokens-sidebar__kbd" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      <nav ref={navRef} className="tokens-nav" aria-label="Token views">
        <ul className="tokens-nav__list">
          <li>
            {item(
              'map',
              'map',
              'Map',
              null,
              'How tokens flow from global values to the CSS that uses them',
            )}
          </li>
        </ul>

        <h2 className="tokens-nav__heading">Tokens</h2>
        <ul className="tokens-nav__list">
          {levels.map((l) => (
            <li key={l.tab}>
              {item(l.tab, l.icon, l.label, <span className="tokens-nav__count">{l.count}</span>, l.title)}
            </li>
          ))}
          <li>
            <div className="tokens-nav__row">
              {item(
                'components',
                'components',
                'Components',
                <span className="tokens-nav__count">{graph.stats.component}</span>,
                'Tokens scoped to each component',
              )}
              <button
                type="button"
                className="tokens-nav__disclosure"
                aria-expanded={showComponents}
                aria-controls={listId}
                aria-label="Component list"
                disabled={query !== ''}
                title={query ? 'Showing the components that match the search' : undefined}
                onClick={() => setExpanded((v) => !v)}
              >
                <Icon name={showComponents ? 'chevronDown' : 'chevronRight'} />
              </button>
            </div>
            <ul id={listId} className="tokens-nav__sublist" hidden={!showComponents}>
              {listed.length === 0 && <li className="tokens-nav__empty">No components match.</li>}
              {listed.map((c) => {
                const active = activeComponent === c.key;
                const hidden = !enabledComponents.has(c.key);
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      className={[
                        'tokens-nav__item',
                        'tokens-nav__item--leaf',
                        active && 'tokens-nav__item--active',
                        hidden && 'tokens-nav__item--hidden',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-current={active ? 'true' : undefined}
                      title={
                        hidden
                          ? `${c.label} is hidden by the Components filter; select it to show it`
                          : tab === 'map'
                            ? `Trace ${c.label}'s lineage`
                            : `Show ${c.label}'s tokens`
                      }
                      onClick={() => onComponentSelect(c.key)}
                    >
                      <span className="tokens-nav__label">{c.label}</span>
                      <span className="tokens-nav__count">{componentCounts.get(c.key) ?? 0}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>

        <h2 className="tokens-nav__heading">Health</h2>
        <ul className="tokens-nav__list">
          <li>
            {item(
              'audit',
              'audit',
              'Audit',
              <span className={`tokens-nav__badge tokens-nav__badge--${severity}`}>
                {actionable > 0 ? actionable : <Icon name="check" />}
                <span className="sr-only">
                  {actionable > 0 ? ` (${actionable} to fix)` : ' (no errors or warnings)'}
                </span>
              </span>,
              auditSummary,
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
