/**
 * DOM-based explorer for the three-level design token hierarchy.
 *
 * Three tabs — Components / System / Global — over the same TokenGraph that
 * powers the generated design-tokens.css. Clicking any token opens the
 * TokenInspector with its full reference chain.
 */

import { useMemo, useState } from 'react';
import type { GraphNode, ThemeMode, TokenGraph } from '../../../tokens/graph-builder';
import { runTokenAudit } from '../../../tokens/audit';
import { ComponentsView } from './ComponentsView';
import { SystemView } from './SystemView';
import { GlobalView } from './GlobalView';
import { AuditView } from './AuditView';

export type ExplorerTab = 'components' | 'system' | 'global' | 'audit';

export interface TokenExplorerProps {
  graph: TokenGraph;
  theme: ThemeMode;
  search: string;
  enabledCategories: Set<string>;
  enabledComponents: Set<string>;
  focusedComponent: string | null;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  initialTab?: ExplorerTab;
}

const HIERARCHY_PILLS: { tab: ExplorerTab; label: string; statKey: 'global' | 'system' | 'component' }[] = [
  { tab: 'global', label: 'Global', statKey: 'global' },
  { tab: 'system', label: 'System', statKey: 'system' },
  { tab: 'components', label: 'Component', statKey: 'component' },
];

export function TokenExplorer({
  graph,
  theme,
  search,
  enabledCategories,
  enabledComponents,
  focusedComponent,
  selectedId,
  onSelect,
  initialTab,
}: TokenExplorerProps) {
  const [tab, setTab] = useState<ExplorerTab>(initialTab ?? 'components');

  // Computed eagerly: the audit pill badge is visible on every tab.
  const audit = useMemo(() => runTokenAudit(graph), [graph]);
  const auditSeverity =
    audit.counts.error > 0 ? 'error' : audit.counts.warning > 0 ? 'warning' : 'info';
  const auditTotal = audit.counts.error + audit.counts.warning + audit.counts.info;

  // Focusing a component (sidebar, inspector button, deep link) always lands
  // on the Components tab where the focused card lives.
  const [prevFocused, setPrevFocused] = useState(focusedComponent);
  if (focusedComponent !== prevFocused) {
    setPrevFocused(focusedComponent);
    if (focusedComponent) setTab('components');
  }

  const query = search.trim().toLowerCase();

  const { componentNodes, systemNodes, globalNodes } = useMemo(
    () => ({
      componentNodes: graph.nodes.filter((n) => n.level === 'component'),
      systemNodes: graph.nodes.filter((n) => n.level === 'system'),
      globalNodes: graph.nodes.filter((n) => n.level === 'global'),
    }),
    [graph.nodes],
  );

  // One forward edge per node per theme: nodeId → referenced nodeId.
  const targetByNode = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of graph.edges) {
      if (e.mode !== 'both' && e.mode !== theme) continue;
      m.set(e.from, e.to);
    }
    return m;
  }, [graph.edges, theme]);

  // How many tokens reference each node under the active theme.
  const consumerCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of graph.edges) {
      if (e.mode !== 'both' && e.mode !== theme) continue;
      m.set(e.to, (m.get(e.to) ?? 0) + 1);
    }
    return m;
  }, [graph.edges, theme]);

  const chainFor = (nodeId: string): GraphNode[] => {
    const chain: GraphNode[] = [];
    let current = targetByNode.get(nodeId);
    while (current) {
      const node = graph.nodesById.get(current);
      if (!node) break;
      chain.push(node);
      current = targetByNode.get(current);
    }
    return chain;
  };

  return (
    <div className="token-explorer">
      <header className="token-explorer__head">
        <div className="token-explorer__pills" aria-label="Token hierarchy">
          {HIERARCHY_PILLS.map((p, i) => (
            <span key={p.tab} className="token-explorer__pill-step">
              {i > 0 && <span className="token-explorer__pill-arrow" aria-hidden="true">→</span>}
              <button
                type="button"
                className={`token-explorer__pill${tab === p.tab ? ' token-explorer__pill--active' : ''}`}
                onClick={() => setTab(p.tab)}
              >
                {p.label}
                <span className="token-explorer__pill-count">{graph.stats[p.statKey]}</span>
              </button>
            </span>
          ))}
          <button
            type="button"
            className={`token-explorer__pill token-explorer__pill--audit token-explorer__pill--audit-${auditSeverity}${tab === 'audit' ? ' token-explorer__pill--active' : ''}`}
            onClick={() => setTab('audit')}
          >
            Audit
            <span className="token-explorer__pill-count">{auditTotal}</span>
          </button>
        </div>
        <p className="token-explorer__caption">
          {tab === 'audit'
            ? `Health checks over the token system — ${audit.counts.error} errors, ${audit.counts.warning} warnings, ${audit.counts.info} notes.`
            : 'Component tokens reference system tokens, which reference global values. Tap any token to inspect its chain.'}
        </p>
      </header>

      <div className="token-explorer__body">
        {tab === 'components' && (
          <ComponentsView
            nodes={componentNodes}
            chainFor={chainFor}
            theme={theme}
            search={query}
            enabledComponents={enabledComponents}
            focusedComponent={focusedComponent}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}
        {tab === 'system' && (
          <SystemView
            nodes={systemNodes}
            consumerCount={consumerCount}
            theme={theme}
            search={query}
            enabledCategories={enabledCategories}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}
        {tab === 'audit' && (
          <AuditView
            graph={graph}
            audit={audit}
            search={query}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}
        {tab === 'global' && (
          <GlobalView
            nodes={globalNodes}
            consumerCount={consumerCount}
            search={query}
            enabledCategories={enabledCategories}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}
      </div>
    </div>
  );
}
