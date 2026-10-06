/**
 * The addons panel under the canvas, as in Storybook: tabs for the selected
 * token's Inspector (its reference chain and values) and its Usage (the CSS
 * files reading a component token, or the tokens referencing a system or
 * global one).
 *
 * Docked on wide screens, where it is resized by its handle (pointer or
 * keyboard) and can be hidden; its size, visibility and tab are kept by the
 * page. Below the drawer breakpoint it is a bottom sheet that exists only
 * while a token is selected.
 */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  getConsumers,
  type EdgeIndex,
  type GraphNode,
  type ThemeMode,
  type TokenGraph,
} from '../../../tokens/graph-builder';
import { TokenInspector } from '../TokenInspector';
import type { LineageModel, UiSource } from '../map/lineage';
import { displayComponentName } from '../utils';
import { Icon } from './Icon';
import {
  PANEL_MIN,
  PANEL_STEP,
  PANEL_STEP_LARGE,
  clampPanelHeight,
  maxPanelHeight,
  type PanelTab,
} from './helpers';

export interface AddonsPanelProps {
  graph: TokenGraph;
  index: EdgeIndex;
  lineage: LineageModel;
  theme: ThemeMode;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  onFocusComponent: (name: string) => void;
  /** Traces a CSS file (`ui::<file>`) on the map. */
  onTraceFile: (uiId: string) => void;
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  /** 'docked': resizable panel. 'sheet': narrow-screen bottom sheet. */
  mode: 'docked' | 'sheet';
  height: number;
  onHeightChange: (height: number) => void;
  onClose: () => void;
}

const TABS: { id: PanelTab; label: string }[] = [
  { id: 'inspector', label: 'Inspector' },
  { id: 'usage', label: 'Usage' },
];

type Usage =
  | { kind: 'files'; files: UiSource[] }
  | { kind: 'tokens'; tokens: GraphNode[] };

function usageOf(lineage: LineageModel, index: EdgeIndex, node: GraphNode): Usage {
  if (node.level === 'component') {
    const files = (lineage.filesByToken.get(node.id) ?? []).flatMap(
      (id) => lineage.uiById.get(id) ?? [],
    );
    return { kind: 'files', files };
  }
  return { kind: 'tokens', tokens: getConsumers(index, node.id) };
}

function usageCount(usage: Usage): number {
  return usage.kind === 'files' ? usage.files.length : usage.tokens.length;
}

function UsageList({
  node,
  usage,
  onSelect,
  onTraceFile,
}: {
  node: GraphNode;
  usage: Usage;
  onSelect: (nodeId: string) => void;
  onTraceFile: (uiId: string) => void;
}) {
  if (usage.kind === 'files') {
    return (
      <div className="tokens-usage">
        <p className="tokens-usage__summary">
          {usage.files.length === 0 ? (
            <>No stylesheet reads <code>{node.cssVarName}</code>.</>
          ) : (
            <>
              <strong>{usage.files.length}</strong> {usage.files.length === 1 ? 'stylesheet reads' : 'stylesheets read'}{' '}
              <code>{node.cssVarName}</code>
            </>
          )}
        </p>
        {usage.files.length > 0 && (
          <ul className="tokens-usage__files">
            {usage.files.map((f) => (
              <li key={f.id} className="tokens-usage__file">
                <span className="tokens-usage__tier">{f.tier}</span>
                <span className="tokens-usage__file-label">{f.label}</span>
                <code className="tokens-usage__path">{f.file}</code>
                <button
                  type="button"
                  className="tokens-panel__button"
                  onClick={() => onTraceFile(f.id)}
                  aria-label={`Trace ${f.label} on the map`}
                >
                  <Icon name="map" />
                  Trace
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return (
    <div className="tokens-usage">
      <p className="tokens-usage__summary">
        {usage.tokens.length === 0 ? (
          'No token references this one.'
        ) : (
          <>
            <strong>{usage.tokens.length}</strong> {usage.tokens.length === 1 ? 'token references' : 'tokens reference'} this
            one
          </>
        )}
      </p>
      {usage.tokens.length > 0 && (
        <div className="tokens-usage__tokens">
          {usage.tokens.map((c) => (
            <button
              key={c.id}
              type="button"
              className="tokens-usage__token"
              onClick={() => onSelect(c.id)}
              title={`Inspect ${c.path}`}
            >
              <span className={`token-inspector__level token-inspector__level--${c.level}`}>
                {c.level === 'component' && c.componentName ? displayComponentName(c.componentName) : c.level}
              </span>
              <span className="tokens-usage__token-label">{c.displayLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AddonsPanel({
  graph,
  index,
  lineage,
  theme,
  selectedId,
  onSelect,
  onFocusComponent,
  onTraceFile,
  tab,
  onTabChange,
  mode,
  height,
  onHeightChange,
  onClose,
}: AddonsPanelProps) {
  const baseId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<PanelTab, HTMLButtonElement | null>>>({});
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);
  const [maximized, setMaximized] = useState(false);
  // Height of the stage the panel shares with the canvas, which bounds it.
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    const stage = panelRef.current?.parentElement;
    if (!stage || mode !== 'docked') return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.height));
    observer.observe(stage);
    return () => observer.disconnect();
  }, [mode]);

  const node = selectedId ? graph.nodesById.get(selectedId) : undefined;
  const usage = useMemo(() => (node ? usageOf(lineage, index, node) : null), [lineage, index, node]);

  const max = available > 0 ? maxPanelHeight(available) : Math.max(height, PANEL_MIN);
  const shown = maximized ? max : available > 0 ? clampPanelHeight(height, available) : height;

  const resizeTo = (next: number) => {
    setMaximized(false);
    onHeightChange(available > 0 ? clampPanelHeight(next, available) : Math.max(PANEL_MIN, next));
  };

  const onHandleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? PANEL_STEP_LARGE : PANEL_STEP;
    const next =
      e.key === 'ArrowUp' ? shown + step
      : e.key === 'ArrowDown' ? shown - step
      : e.key === 'PageUp' ? shown + PANEL_STEP_LARGE
      : e.key === 'PageDown' ? shown - PANEL_STEP_LARGE
      : e.key === 'Home' ? PANEL_MIN
      : e.key === 'End' ? max
      : null;
    if (next === null) return;
    e.preventDefault();
    resizeTo(next);
  };

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next =
      e.key === 'ArrowRight' ? TABS[(i + 1) % TABS.length]
      : e.key === 'ArrowLeft' ? TABS[(i - 1 + TABS.length) % TABS.length]
      : e.key === 'Home' ? TABS[0]
      : e.key === 'End' ? TABS[TABS.length - 1]
      : null;
    if (!next) return;
    e.preventDefault();
    onTabChange(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const count = usage ? usageCount(usage) : null;
  const docked = mode === 'docked';

  return (
    <section
      ref={panelRef}
      className={`tokens-panel tokens-panel--${mode}`}
      style={docked ? { height: shown } : undefined}
      aria-label={docked ? 'Addons' : 'Token details'}
      data-tokens-panel
    >
      {docked && (
        <div
          className="tokens-panel__handle"
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize the addons panel"
          aria-valuenow={Math.round(shown)}
          aria-valuemin={PANEL_MIN}
          aria-valuemax={Math.round(max)}
          aria-valuetext={`${Math.round(shown)} pixels tall`}
          tabIndex={0}
          onKeyDown={onHandleKeyDown}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { startY: e.clientY, startHeight: shown };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (d) resizeTo(d.startHeight + d.startY - e.clientY);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onDoubleClick={() => setMaximized((v) => !v)}
        />
      )}

      <div className="tokens-panel__bar">
        <div className="tokens-panel__tabs" role="tablist" aria-label="Addons">
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${baseId}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              className={`tokens-panel__tab${tab === t.id ? ' tokens-panel__tab--active' : ''}`}
              onClick={() => onTabChange(t.id)}
              onKeyDown={onTabKeyDown}
            >
              {t.label}
              {t.id === 'usage' && count !== null && <span className="tokens-panel__tab-count">{count}</span>}
            </button>
          ))}
        </div>
        <div className="tokens-panel__actions">
          {docked && (
            <button
              type="button"
              className="tokens-panel__icon-button"
              aria-label="Maximize the addons panel"
              aria-pressed={maximized}
              title={maximized ? 'Restore the panel height' : 'Give the panel the most room'}
              onClick={() => setMaximized((v) => !v)}
            >
              <Icon name={maximized ? 'restore' : 'maximize'} />
            </button>
          )}
          <button
            type="button"
            className="tokens-panel__icon-button"
            aria-label={docked ? 'Hide the addons panel' : 'Close token details'}
            title={docked ? 'Hide the addons panel' : 'Close token details (Esc)'}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
      </div>

      <div
        className="tokens-panel__body"
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${tab}`}
        tabIndex={0}
      >
        {!node || !usage ? (
          <div className="tokens-panel__empty">
            <Icon name="inspector" />
            <p>
              Select a token on the canvas to see its reference chain, its values in both themes and
              where it is used.
            </p>
          </div>
        ) : tab === 'inspector' ? (
          <TokenInspector
            graph={graph}
            index={index}
            selectedId={node.id}
            theme={theme}
            onSelect={onSelect}
            onFocusComponent={onFocusComponent}
          />
        ) : (
          <UsageList node={node} usage={usage} onSelect={onSelect} onTraceFile={onTraceFile} />
        )}
      </div>
    </section>
  );
}
