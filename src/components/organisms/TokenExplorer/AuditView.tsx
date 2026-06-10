/**
 * Audit tab: health checks over the token system — broken references,
 * missing/misused tokens in CSS, value drift, raw values, duplicates and
 * unused tokens. Token issues open the TokenInspector; CSS issues point at
 * the offending file:line.
 */

import { useMemo } from 'react';
import type { TokenGraph } from '../../../tokens/graph-builder';
import { AUDIT_CHECKS, type AuditIssue, type AuditReport } from '../../../tokens/audit';
import { TokenSwatch } from './TokenSwatch';

interface AuditViewProps {
  graph: TokenGraph;
  audit: AuditReport;
  search: string;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}

function labelFor(graph: TokenGraph, nodeId: string): string {
  const node = graph.nodesById.get(nodeId);
  if (!node) return nodeId;
  return node.path.split('.').slice(1).join('.');
}

function matchesQuery(graph: TokenGraph, issue: AuditIssue, query: string): boolean {
  if (!query) return true;
  const haystack = [
    issue.message,
    issue.cssVar ?? '',
    issue.nodeId ? labelFor(graph, issue.nodeId) : '',
    ...(issue.relatedNodeIds ?? []).map((id) => labelFor(graph, id)),
    ...(issue.locations ?? []).map((l) => l.file),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

function TokenChip({
  graph,
  nodeId,
  selected,
  onSelect,
}: {
  graph: TokenGraph;
  nodeId: string;
  selected: boolean;
  onSelect: (nodeId: string) => void;
}) {
  const node = graph.nodesById.get(nodeId);
  if (!node) return <code className="audit-chip audit-chip--dead">{nodeId}</code>;
  return (
    <button
      type="button"
      className={`audit-chip${selected ? ' audit-chip--selected' : ''}`}
      onClick={() => onSelect(nodeId)}
      title={`Inspect ${node.path}`}
    >
      <TokenSwatch value={node.resolvedValue} />
      <span>{labelFor(graph, nodeId)}</span>
    </button>
  );
}

function IssueRow({
  graph,
  issue,
  selectedId,
  onSelect,
}: {
  graph: TokenGraph;
  issue: AuditIssue;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}) {
  const chipIds = [
    ...(issue.nodeId ? [issue.nodeId] : []),
    ...(issue.relatedNodeIds ?? []),
  ];
  return (
    <div className="audit-issue">
      {issue.cssVar && <code className="audit-issue__var">{issue.cssVar}</code>}
      <div className="audit-issue__chips">
        {chipIds.map((id) => (
          <TokenChip
            key={id}
            graph={graph}
            nodeId={id}
            selected={selectedId === id}
            onSelect={onSelect}
          />
        ))}
      </div>
      <p className="audit-issue__message">{issue.message}</p>
      {issue.locations && (
        <ul className="audit-issue__locations">
          {issue.locations.map((l, i) => (
            <li key={i}>
              <code>
                {l.file}:{l.line}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AuditView({ graph, audit, search, selectedId, onSelect }: AuditViewProps) {
  const sections = useMemo(
    () =>
      AUDIT_CHECKS.map((check) => ({
        check,
        issues: audit.byCheck[check.id].filter((i) => matchesQuery(graph, i, search)),
      })),
    [graph, audit, search],
  );

  const total = sections.reduce((sum, s) => sum + s.issues.length, 0);

  return (
    <div className="token-explorer__sections audit-view">
      {total === 0 && (
        <div className="audit-view__clean">
          {search
            ? `No audit findings match “${search}”.`
            : 'All checks passed — no issues found in the token system.'}
        </div>
      )}
      {sections.map(({ check, issues }) => (
        <details
          key={check.id}
          className={`audit-section audit-section--${check.severity}`}
          open={check.severity === 'error' && issues.length > 0}
        >
          <summary className="audit-section__summary">
            <span className={`audit-badge audit-badge--${check.severity}`}>
              {check.severity}
            </span>
            <span className="audit-section__title">{check.title}</span>
            <span className="audit-section__count">
              {issues.length === 0 ? '✓ none' : issues.length}
            </span>
          </summary>
          <p className="audit-section__description">{check.description}</p>
          {issues.length === 0 ? (
            <div className="audit-section__clean">No issues found by this check.</div>
          ) : (
            <div className="audit-section__issues">
              {issues.map((issue, i) => (
                <IssueRow
                  key={i}
                  graph={graph}
                  issue={issue}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
