/**
 * DOM inspector panel for a selected token node.
 *
 * Shows the full reference chain (component → system → global) with CSS
 * variable names, resolved values, and color swatches, plus a "Used by"
 * section for system/global tokens. Floating card on desktop, bottom
 * sheet on mobile (see Tokens.css).
 */

import { useState } from 'react';
import {
  getConsumers,
  getReferenceChain,
  type GraphNode,
  type ThemeMode,
  type TokenGraph,
} from '../../../tokens/graph-builder';

const MAX_CONSUMERS_SHOWN = 8;
const HEX_RE = /^#[0-9a-fA-F]{6,8}$/;

export interface TokenInspectorProps {
  graph: TokenGraph;
  selectedId: string;
  theme: ThemeMode;
  onSelect: (nodeId: string) => void;
  onFocusComponent: (name: string) => void;
  onClose: () => void;
}

function ValueRow({ label, value, type }: { label: string; value: string; type: string }) {
  return (
    <div className="token-inspector__value-row">
      <span className="token-inspector__value-key">{label}</span>
      <span className="token-inspector__value">
        {type === 'color' && HEX_RE.test(value) && (
          <span className="token-inspector__swatch" style={{ background: value.slice(0, 7) }} />
        )}
        <code>{value}</code>
      </span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="token-inspector__copy"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          })
          .catch(() => {});
      }}
      title="Copy CSS variable name"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

function ChainRow({
  node,
  isCurrent,
  theme,
  onSelect,
}: {
  node: GraphNode;
  isCurrent: boolean;
  theme: ThemeMode;
  onSelect: (nodeId: string) => void;
}) {
  const themedValue =
    theme === 'dark' && node.resolvedValueDark ? node.resolvedValueDark : node.resolvedValue;

  const body = (
    <>
      <div className="token-inspector__chain-head">
        <span className={`token-inspector__level token-inspector__level--${node.level}`}>
          {node.level}
        </span>
        <span className="token-inspector__chain-label">{node.displayLabel}</span>
      </div>
      <div className="token-inspector__var-row">
        <code className="token-inspector__var">{node.cssVarName}</code>
        <CopyButton text={`var(${node.cssVarName})`} />
      </div>
      <ValueRow label={theme === 'dark' ? 'Dark' : 'Light'} value={themedValue} type={node.type} />
      {node.resolvedValueDark !== undefined && theme === 'light' && (
        <ValueRow label="Dark" value={node.resolvedValueDark} type={node.type} />
      )}
    </>
  );

  if (isCurrent) {
    return <div className="token-inspector__chain-row token-inspector__chain-row--current">{body}</div>;
  }
  return (
    <button
      type="button"
      className="token-inspector__chain-row token-inspector__chain-row--link"
      onClick={() => onSelect(node.id)}
      title={`Inspect ${node.path}`}
    >
      {body}
    </button>
  );
}

export function TokenInspector({
  graph,
  selectedId,
  theme,
  onSelect,
  onFocusComponent,
  onClose,
}: TokenInspectorProps) {
  const node = graph.nodesById.get(selectedId);
  if (!node) return null;

  const chain = getReferenceChain(graph, selectedId, theme);
  const consumers =
    node.level === 'component' ? [] : getConsumers(graph, selectedId, theme);

  return (
    <aside className="token-inspector" aria-label="Token details">
      <header className="token-inspector__header">
        <div className="token-inspector__header-main">
          <span className={`token-inspector__level token-inspector__level--${node.level}`}>
            {node.level}
          </span>
          <div className="token-inspector__path">{node.path}</div>
        </div>
        <button
          type="button"
          className="token-inspector__close"
          onClick={onClose}
          aria-label="Close token details"
        >
          ✕
        </button>
      </header>

      {node.level === 'component' && node.componentName && (
        <div className="token-inspector__component">
          <span className="token-inspector__component-chip">{node.componentName}</span>
          <button
            type="button"
            className="token-inspector__focus"
            onClick={() => onFocusComponent(node.componentName!)}
            title={`Isolate all ${node.componentName} tokens`}
          >
            Focus component
          </button>
        </div>
      )}

      <section className="token-inspector__section">
        <h3 className="token-inspector__section-title">Reference chain</h3>
        <div className="token-inspector__chain">
          {chain.map((n, i) => (
            <div key={n.id} className="token-inspector__chain-step">
              {i > 0 && <div className="token-inspector__chain-arrow">↓ references</div>}
              <ChainRow
                node={n}
                isCurrent={n.id === selectedId}
                theme={theme}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </section>

      {consumers.length > 0 && (
        <section className="token-inspector__section">
          <h3 className="token-inspector__section-title">
            Used by <span className="token-inspector__count">{consumers.length}</span>
          </h3>
          <div className="token-inspector__consumers">
            {consumers.slice(0, MAX_CONSUMERS_SHOWN).map((c) => (
              <button
                key={c.id}
                type="button"
                className="token-inspector__consumer"
                onClick={() => onSelect(c.id)}
                title={`Inspect ${c.path}`}
              >
                <span className={`token-inspector__level token-inspector__level--${c.level}`}>
                  {c.level === 'component' ? c.componentName : c.level}
                </span>
                <span className="token-inspector__consumer-label">{c.displayLabel}</span>
              </button>
            ))}
            {consumers.length > MAX_CONSUMERS_SHOWN && (
              <div className="token-inspector__more">
                +{consumers.length - MAX_CONSUMERS_SHOWN} more
              </div>
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
