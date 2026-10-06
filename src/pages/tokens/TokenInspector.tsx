/**
 * The Inspector tab of the addons panel: a selected token's full reference
 * chain (component → system → global), laid out left to right, with CSS
 * variable names, both themes' values and color swatches. Where the token
 * is used lives in the panel's Usage tab.
 */

import { useState } from 'react';
import {
  getReferenceChain,
  type EdgeIndex,
  type GraphNode,
  type ThemeMode,
  type TokenGraph,
} from '../../tokens/graph-builder';
import { TokenSwatch } from './TokenSwatch';
import { displayComponentName } from './utils';
import { Icon } from './shell/Icon';
import './TokenInspector.css';

export interface TokenInspectorProps {
  graph: TokenGraph;
  index: EdgeIndex;
  selectedId: string;
  theme: ThemeMode;
  onSelect: (nodeId: string) => void;
  onFocusComponent: (name: string) => void;
}

function ValueRow({
  label,
  value,
  type,
  active,
}: {
  label: string;
  value: string;
  type: string;
  active?: boolean;
}) {
  return (
    <div
      className={`token-inspector__value-row${active ? ' token-inspector__value-row--active' : ''}`}
    >
      <span className="token-inspector__value-key">{label}</span>
      <span className="token-inspector__value">
        {type === 'color' && <TokenSwatch value={value} />}
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
      aria-label={copied ? 'Copied' : `Copy ${text}`}
      title="Copy the CSS variable"
    >
      <Icon name={copied ? 'check' : 'copy'} />
      <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
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
  const hasDark = node.resolvedValueDark !== undefined;

  // Only the head is the navigation control: the row also holds the copy
  // button, and interactive content cannot nest inside a <button>.
  const head = (
    <>
      <span className={`token-inspector__level token-inspector__level--${node.level}`}>
        {node.level}
      </span>
      <span className="token-inspector__chain-label">{node.displayLabel}</span>
    </>
  );

  return (
    <div
      className={`token-inspector__chain-row${isCurrent ? ' token-inspector__chain-row--current' : ' token-inspector__chain-row--link'}`}
    >
      {isCurrent ? (
        <div className="token-inspector__chain-head">{head}</div>
      ) : (
        <button
          type="button"
          className="token-inspector__chain-head token-inspector__chain-head--link"
          onClick={() => onSelect(node.id)}
          title={`Inspect ${node.path}`}
        >
          {head}
        </button>
      )}
      <div className="token-inspector__var-row">
        <code className="token-inspector__var">{node.cssVarName}</code>
        <CopyButton text={`var(${node.cssVarName})`} />
      </div>
      {hasDark ? (
        // Theme-varying token: always show both values, highlight the active theme.
        <>
          <ValueRow
            label="Light"
            value={node.resolvedValue}
            type={node.type}
            active={theme === 'light'}
          />
          <ValueRow
            label="Dark"
            value={node.resolvedValueDark!}
            type={node.type}
            active={theme === 'dark'}
          />
        </>
      ) : (
        <ValueRow label="Value" value={node.resolvedValue} type={node.type} active />
      )}
    </div>
  );
}

export function TokenInspector({
  graph,
  index,
  selectedId,
  theme,
  onSelect,
  onFocusComponent,
}: TokenInspectorProps) {
  const node = graph.nodesById.get(selectedId);
  if (!node) return null;

  const chain = getReferenceChain(graph, index, selectedId);

  return (
    <div className="token-inspector">
      <header className="token-inspector__header">
        <span className={`token-inspector__level token-inspector__level--${node.level}`}>
          {node.level}
        </span>
        <h2 className="token-inspector__path">{node.path}</h2>
        {node.level === 'component' && node.componentName && (
          <button
            type="button"
            className="token-inspector__focus"
            onClick={() => onFocusComponent(node.componentName!)}
            title={`Jump to ${displayComponentName(node.componentName)}'s tokens`}
          >
            View {displayComponentName(node.componentName)}
            <Icon name="arrowRight" />
          </button>
        )}
      </header>

      <ol className="token-inspector__chain" aria-label="Reference chain">
        {chain.map((n, i) => (
          <li key={n.id} className="token-inspector__chain-step">
            {i > 0 && (
              <span className="token-inspector__chain-arrow">
                <Icon name="arrowRight" />
                <span className="sr-only">references</span>
              </span>
            )}
            <ChainRow node={n} isCurrent={n.id === selectedId} theme={theme} onSelect={onSelect} />
          </li>
        ))}
      </ol>
    </div>
  );
}
