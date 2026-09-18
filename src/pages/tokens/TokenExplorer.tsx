/**
 * DOM-based explorer for the three-level design token hierarchy.
 *
 * Four tabs — Global / System / Component / Audit — over the same TokenGraph
 * that powers the generated design-tokens.css. Tab state is owned by the page
 * so it can be deep-linked; clicking any token opens the TokenInspector.
 */

import { useMemo } from 'react';
import type { EdgeIndex, ThemeMode, TokenGraph } from '../../tokens/graph-builder';
import type { AuditReport } from '../../tokens/audit';
import { ComponentsView } from './ComponentsView';
import { SystemView } from './SystemView';
import { GlobalView } from './GlobalView';
import { AuditView } from './AuditView';
import type { ExplorerTab } from './utils';
import './TokenExplorer.css';

export type { ExplorerTab };

export interface TokenExplorerProps {
  graph: TokenGraph;
  index: EdgeIndex;
  audit: AuditReport;
  theme: ThemeMode;
  tab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
  search: string;
  enabledCategories: Set<string>;
  enabledComponents: Set<string>;
  focusedComponent: string | null;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}

const HIERARCHY_PILLS: { tab: ExplorerTab; label: string; statKey: 'global' | 'system' | 'component' }[] = [
  { tab: 'global', label: 'Global', statKey: 'global' },
  { tab: 'system', label: 'System', statKey: 'system' },
  { tab: 'components', label: 'Component', statKey: 'component' },
];

export function TokenExplorer({
  graph,
  index,
  audit,
  theme,
  tab,
  onTabChange,
  search,
  enabledCategories,
  enabledComponents,
  focusedComponent,
  selectedId,
  onSelect,
}: TokenExplorerProps) {
  const auditSeverity =
    audit.counts.error > 0 ? 'error' : audit.counts.warning > 0 ? 'warning' : 'info';
  // The pill badge counts actionable findings only; informational notes
  // (duplicates, unused tokens) are numerous by design and live in the caption.
  const auditActionable = audit.counts.error + audit.counts.warning;
  const auditSummary = `${audit.counts.error} errors, ${audit.counts.warning} warnings, ${audit.counts.info} notes`;

  const query = search.trim().toLowerCase();

  const { componentNodes, systemNodes, globalNodes } = useMemo(
    () => ({
      componentNodes: graph.nodes.filter((n) => n.level === 'component'),
      systemNodes: graph.nodes.filter((n) => n.level === 'system'),
      globalNodes: graph.nodes.filter((n) => n.level === 'global'),
    }),
    [graph.nodes],
  );

  const consumerCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const [id, consumers] of index.consumersByNode) m.set(id, consumers.length);
    return m;
  }, [index]);

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
                aria-pressed={tab === p.tab}
                onClick={() => onTabChange(p.tab)}
              >
                {p.label}
                <span className="token-explorer__pill-count">{graph.stats[p.statKey]}</span>
              </button>
            </span>
          ))}
          <button
            type="button"
            className={`token-explorer__pill token-explorer__pill--audit token-explorer__pill--audit-${auditSeverity}${tab === 'audit' ? ' token-explorer__pill--active' : ''}`}
            aria-pressed={tab === 'audit'}
            onClick={() => onTabChange('audit')}
            title={auditSummary}
          >
            Audit
            <span className="token-explorer__pill-count">
              {auditActionable > 0 ? auditActionable : '✓'}
            </span>
          </button>
        </div>
        <p className="token-explorer__caption">
          {tab === 'audit'
            ? `Health checks over the token system — ${auditSummary}.`
            : 'Component tokens reference system tokens, which reference global values. Tap any token to inspect its chain.'}
        </p>
      </header>

      <div className="token-explorer__body">
        {tab === 'components' && (
          <ComponentsView
            graph={graph}
            index={index}
            nodes={componentNodes}
            theme={theme}
            search={query}
            enabledCategories={enabledCategories}
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
