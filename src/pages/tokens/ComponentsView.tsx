/**
 * Components tab: one collapsible card per component. Each token row shows
 * its resolved value plus an inline breadcrumb of the system and global
 * tokens it resolves through, so ownership and dependencies read at a glance.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getReferenceChain,
  type EdgeIndex,
  type GraphNode,
  type ThemeMode,
  type TokenGraph,
} from '../../tokens/graph-builder';
import { TokenSwatch } from './TokenSwatch';
import {
  categoryOfComponentToken,
  displayComponentName,
  matchesSearch,
  themedValueOf,
} from './utils';
import './ComponentsView.css';

interface ComponentsViewProps {
  graph: TokenGraph;
  index: EdgeIndex;
  nodes: GraphNode[];
  theme: ThemeMode;
  search: string;
  enabledCategories: Set<string>;
  enabledComponents: Set<string>;
  focusedComponent: string | null;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}

function propertyOf(node: GraphNode): string {
  return node.path.split('.')[2] ?? 'other';
}

function rowLabel(node: GraphNode): string {
  return node.path.split('.').slice(3).join('.') || node.displayLabel;
}

function TokenRow({
  node,
  chain,
  theme,
  selected,
  onSelect,
}: {
  node: GraphNode;
  chain: GraphNode[];
  theme: ThemeMode;
  selected: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const value = themedValueOf(node, theme);
  return (
    <button
      type="button"
      className={`token-row${selected ? ' token-row--selected' : ''}`}
      onClick={() => onSelect(node.id)}
      title={`Inspect ${node.path}`}
    >
      <span className="token-row__main">
        <TokenSwatch value={value} size="md" />
        <span className="token-row__label">{rowLabel(node)}</span>
        <code className="token-row__value">{value}</code>
      </span>
      {chain.length > 0 && (
        <span className="token-row__chain">
          {chain.map((n) => (
            <span key={n.id} className="token-row__chain-step">
              <span className="token-row__chain-arrow" aria-hidden="true">→</span>
              <span className={`token-row__chain-level token-row__chain-level--${n.level}`}>
                {n.level}
              </span>
              <TokenSwatch value={themedValueOf(n, theme)} />
              <span className="token-row__chain-name">{n.displayLabel}</span>
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

export function ComponentsView({
  graph,
  index,
  nodes,
  theme,
  search,
  enabledCategories,
  enabledComponents,
  focusedComponent,
  selectedId,
  onSelect,
}: ComponentsViewProps) {
  // The focused component (deep link, sidebar "view", inspector button) is
  // always expanded, including when this view mounts already focused.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(focusedComponent ? [focusedComponent] : []),
  );
  const focusedRef = useRef<HTMLElement | null>(null);

  const groups = useMemo(() => {
    const byComponent = new Map<string, Map<string, GraphNode[]>>();
    for (const node of nodes) {
      const name = node.componentName ?? 'misc';
      if (!enabledComponents.has(name)) continue;
      const category = categoryOfComponentToken(node);
      if (category !== null && !enabledCategories.has(category)) continue;
      if (!matchesSearch(node, search)) continue;
      if (!byComponent.has(name)) byComponent.set(name, new Map());
      const byProperty = byComponent.get(name)!;
      const prop = propertyOf(node);
      if (!byProperty.has(prop)) byProperty.set(prop, []);
      byProperty.get(prop)!.push(node);
    }
    for (const byProperty of byComponent.values()) {
      for (const members of byProperty.values()) {
        members.sort((a, b) => a.path.localeCompare(b.path));
      }
    }
    return [...byComponent.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [nodes, enabledCategories, enabledComponents, search]);

  // Focusing a component while mounted opens it alongside whatever is
  // already open (state adjusted during render, per React's guidance)…
  const [prevFocused, setPrevFocused] = useState(focusedComponent);
  if (focusedComponent !== prevFocused) {
    setPrevFocused(focusedComponent);
    if (focusedComponent) setExpanded((prev) => new Set(prev).add(focusedComponent));
  }

  // …and scrolls its card into view once it has rendered.
  useEffect(() => {
    focusedRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [focusedComponent]);

  // A search expands everything that matched (when the result set is small).
  const isExpanded = (name: string) =>
    expanded.has(name) || (search.length > 0 && groups.length <= 8);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (groups.length === 0) {
    return <div className="token-explorer__empty">No component tokens match the current filters.</div>;
  }

  return (
    <div className="token-explorer__cards">
      {groups.map(([name, byProperty]) => {
        const count = [...byProperty.values()].reduce((acc, m) => acc + m.length, 0);
        const open = isExpanded(name);
        return (
          <section
            key={name}
            className={`token-card${focusedComponent === name ? ' token-card--focused' : ''}`}
            ref={focusedComponent === name ? (el) => { focusedRef.current = el; } : undefined}
          >
            <button
              type="button"
              className="token-card__header"
              onClick={() => toggle(name)}
              aria-expanded={open}
            >
              <span className="token-card__chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
              <span className="token-card__name">{displayComponentName(name)}</span>
              <span className="token-card__count">{count} tokens</span>
            </button>
            {open && (
              <div className="token-card__body">
                {[...byProperty.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([prop, members]) => (
                  <div key={prop} className="token-card__group">
                    <h4 className="token-card__group-title">{prop}</h4>
                    {members.map((node) => (
                      <TokenRow
                        key={node.id}
                        node={node}
                        chain={getReferenceChain(graph, index, node.id).slice(1)}
                        theme={theme}
                        selected={selectedId === node.id}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
