/**
 * The playground canvas: hosts one of five views — Map / Global / System /
 * Components / Audit — over the same TokenGraph that powers the generated
 * design-tokens.css. The sidebar picks the view and the page owns its state
 * so it can be deep-linked; clicking any token opens it in the addons panel.
 * The canvas palette follows the previewed theme, like Storybook's
 * backgrounds.
 */

import { memo, useMemo } from 'react';
import type { EdgeIndex, ThemeMode, TokenGraph } from '../../tokens/graph-builder';
import type { AuditReport } from '../../tokens/audit';
import { ComponentsView } from './ComponentsView';
import { SystemView } from './SystemView';
import { GlobalView } from './GlobalView';
import { AuditView } from './AuditView';
import { MapView, type MapMode } from './map/MapView';
import type { LineageModel } from './map/lineage';
import { auditSummary, type ExplorerTab } from './utils';
import './TokenExplorer.css';

export interface TokenExplorerProps {
  graph: TokenGraph;
  index: EdgeIndex;
  audit: AuditReport;
  theme: ThemeMode;
  tab: ExplorerTab;
  search: string;
  enabledCategories: Set<string>;
  enabledComponents: Set<string>;
  focusedComponent: string | null;
  selectedId: string | null;
  /** Toggles the inspector for a token (list views). */
  onSelect: (nodeId: string) => void;
  /** Opens the inspector on a token, never closing it (the map). */
  onInspect: (nodeId: string) => void;
  lineage: LineageModel;
  /** Map focus history, newest last. */
  mapTrail: readonly string[];
  mapMode: MapMode;
  onMapFocus: (id: string) => void;
  onMapBack: () => void;
  onMapReset: () => void;
  onMapUnavailable: () => void;
}

const CANVAS_HEADS: Record<Exclude<ExplorerTab, 'map'>, { title: string; caption: string }> = {
  global: {
    title: 'Global tokens',
    caption: 'Raw values — palettes, scales and type. System tokens alias these.',
  },
  system: {
    title: 'System tokens',
    caption: 'Semantic aliases of global values, with their light and dark values side by side.',
  },
  components: {
    title: 'Component tokens',
    caption: 'Scoped to one component each, and resolved through a system token to a global value.',
  },
  audit: {
    title: 'Audit',
    caption: 'Health checks over the token system.',
  },
};

// Memoised: the page re-renders on panel drags and tab switches that leave
// the canvas unchanged, and the map is costly to re-render.
export const TokenExplorer = memo(function TokenExplorer({
  graph,
  index,
  audit,
  theme,
  tab,
  search,
  enabledCategories,
  enabledComponents,
  focusedComponent,
  selectedId,
  onSelect,
  onInspect,
  lineage,
  mapTrail,
  mapMode,
  onMapFocus,
  onMapBack,
  onMapReset,
  onMapUnavailable,
}: TokenExplorerProps) {

  const query = search.trim().toLowerCase();
  const head = tab === 'map' ? null : CANVAS_HEADS[tab];
  const stat =
    tab === 'global' ? graph.stats.global
    : tab === 'system' ? graph.stats.system
    : graph.stats.component;

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
    <section
      className={`token-explorer${tab === 'map' ? ' token-explorer--map' : ''}`}
      data-canvas-theme={theme}
      aria-label="Canvas"
      // Takes focus back when the token it was on goes away.
      tabIndex={-1}
    >
      {head && (
        <header className="token-explorer__head">
          <h2 className="token-explorer__title">
            {head.title}
            {tab !== 'audit' && <span className="token-explorer__count">{stat}</span>}
          </h2>
          <p className="token-explorer__caption">
            {tab === 'audit' ? `${head.caption} ${auditSummary(audit)}.` : head.caption}
          </p>
        </header>
      )}
      <div className={`token-explorer__body${tab === 'map' ? ' token-explorer__body--map' : ''}`}>
        {tab === 'map' && (
          <MapView
            lineage={lineage}
            index={index}
            theme={theme}
            search={search}
            enabledCategories={enabledCategories}
            enabledComponents={enabledComponents}
            trail={mapTrail}
            mode={mapMode}
            selectedId={selectedId}
            onFocus={onMapFocus}
            onBack={onMapBack}
            onReset={onMapReset}
            onSelectToken={onInspect}
            onUnavailable={onMapUnavailable}
          />
        )}
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
    </section>
  );
});
