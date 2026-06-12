/**
 * System tab: semantic tokens grouped by category, with light/dark values
 * side by side and a "used by" count of the component tokens referencing
 * each one.
 */

import { useMemo } from 'react';
import type { GraphNode, ThemeMode } from '../../../tokens/graph-builder';
import { TokenSwatch } from './TokenSwatch';
import { matchesSearch } from './utils';

interface SystemViewProps {
  nodes: GraphNode[];
  consumerCount: Map<string, number>;
  theme: ThemeMode;
  search: string;
  enabledCategories: Set<string>;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}

export function SystemView({
  nodes,
  consumerCount,
  theme,
  search,
  enabledCategories,
  selectedId,
  onSelect,
}: SystemViewProps) {
  const groups = useMemo(() => {
    const byCategory = new Map<string, GraphNode[]>();
    for (const node of nodes) {
      if (!enabledCategories.has(node.category)) continue;
      if (!matchesSearch(node, search)) continue;
      if (!byCategory.has(node.category)) byCategory.set(node.category, []);
      byCategory.get(node.category)!.push(node);
    }
    for (const members of byCategory.values()) {
      members.sort((a, b) => a.path.localeCompare(b.path));
    }
    return [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [nodes, enabledCategories, search]);

  if (groups.length === 0) {
    return <div className="token-explorer__empty">No system tokens match the current filters.</div>;
  }

  return (
    <div className="token-explorer__sections">
      {groups.map(([category, members]) => (
        <section key={category} className="token-section">
          <h3 className="token-section__title">{category}</h3>
          {members.map((node) => {
            const usedBy = consumerCount.get(node.id) ?? 0;
            const hasDark = node.resolvedValueDark !== undefined;
            const isColor = node.type === 'color';
            return (
              <button
                key={node.id}
                type="button"
                className={`token-row token-row--system${selectedId === node.id ? ' token-row--selected' : ''}`}
                onClick={() => onSelect(node.id)}
                title={`Inspect ${node.path}`}
              >
                <span className="token-row__label">
                  {node.path.split('.').slice(2).join('.')}
                </span>
                <span
                  className={`token-row__themed${theme === 'light' || !hasDark ? ' token-row__themed--active' : ''}`}
                >
                  <TokenSwatch value={node.resolvedValue} size="md" />
                  <code>{node.resolvedValue}</code>
                  {isColor && <span className="token-row__themed-tag">light</span>}
                </span>
                <span
                  className={`token-row__themed${theme === 'dark' && hasDark ? ' token-row__themed--active' : ''}`}
                >
                  {hasDark ? (
                    <>
                      <TokenSwatch value={node.resolvedValueDark!} size="md" />
                      <code>{node.resolvedValueDark}</code>
                      <span className="token-row__themed-tag">dark</span>
                    </>
                  ) : (
                    isColor && (
                      <span className="token-row__themed-empty" title="Same value in dark mode">
                        —
                      </span>
                    )
                  )}
                </span>
                <span className="token-row__used-by">
                  {usedBy > 0 ? `used by ${usedBy}` : ''}
                </span>
              </button>
            );
          })}
        </section>
      ))}
    </div>
  );
}
