/**
 * The Map tab: how tokens flow from global values, through system and
 * component tokens, to the CSS files that use them.
 *
 * With nothing focused it shows one row per group; focusing a token, a group
 * or a CSS file shows only its lineage. The focus history is owned by the
 * page (URL sync, Escape), while groups expanded inside a long column belong
 * to the focus they were opened under. The 3D view loads on demand.
 */

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { EdgeIndex, ThemeMode } from '../../../tokens/graph-builder';
import { displayComponentName } from '../utils';
import { MapView2D } from './MapView2D';
import {
  MAP_COLUMNS,
  computeMapView,
  resolveMapId,
  type LineageModel,
  type MapColumn,
  type MapFilters,
} from './lineage';
import type { MapView3DProps } from './MapView3D';
import './TokenMap.css';

/** Stands in for a 3D chunk that failed to load (offline, deploy skew): back to 2D, as without WebGL. */
function Unavailable3D({ onUnavailable }: MapView3DProps) {
  useEffect(() => onUnavailable(), [onUnavailable]);
  return null;
}

const MapView3D = lazy(() =>
  import('./MapView3D').catch(() => ({ default: Unavailable3D })),
);

export type MapMode = '2d' | '3d';

export interface MapViewProps {
  lineage: LineageModel;
  index: EdgeIndex;
  theme: ThemeMode;
  search: string;
  enabledCategories: ReadonlySet<string>;
  enabledComponents: ReadonlySet<string>;
  /** Focus history, oldest first; the last entry is the current focus. Empty means the overview. */
  trail: readonly string[];
  mode: MapMode;
  /** The token open in the inspector. */
  selectedId: string | null;
  onFocus: (id: string) => void;
  onBack: () => void;
  onReset: () => void;
  onModeChange: (mode: MapMode) => void;
  onSelectToken: (id: string) => void;
}

/** Breadcrumbs beyond this many collapse into an ellipsis after "Overview". */
const MAX_CRUMBS = 3;
const NO_GROUPS: ReadonlySet<string> = new Set();

/**
 * Set once WebGL fails to start, for the rest of the page's life: the Map tab
 * unmounts whenever another tab opens, and should not offer 3D again.
 */
let webglFailed = false;

interface Crumb {
  id: string;
  label: string;
  column: MapColumn;
}

function crumbOf(lineage: LineageModel, id: string): Crumb | null {
  const resolved = resolveMapId(lineage, id);
  if (!resolved) return null;
  if (resolved.kind === 'ui') return { id, label: resolved.ui.label, column: 'ui' };
  if (resolved.kind === 'token') {
    const { node } = resolved;
    const owner = node.componentName ? `${displayComponentName(node.componentName)} · ` : '';
    return { id, label: owner + node.displayLabel, column: node.level };
  }
  const label =
    resolved.level === 'component'
      ? displayComponentName(resolved.prefix)
      : resolved.prefix.split('.').slice(-2).join(' / ');
  return { id, label, column: resolved.level };
}

export function MapView({
  lineage,
  index,
  theme,
  search,
  enabledCategories,
  enabledComponents,
  trail,
  mode,
  selectedId,
  onFocus,
  onBack,
  onReset,
  onModeChange,
  onSelectToken,
}: MapViewProps) {
  const focusId = trail.at(-1) ?? null;

  // Expanded groups are remembered per focus: a new focus starts folded.
  const [expansion, setExpansion] = useState({ focusId, groups: NO_GROUPS });
  const expanded = expansion.focusId === focusId ? expansion.groups : NO_GROUPS;
  const toggleGroup = useCallback(
    (groupId: string) => {
      const groups = new Set(expanded);
      if (groups.has(groupId)) groups.delete(groupId);
      else groups.add(groupId);
      setExpansion({ focusId, groups });
    },
    [focusId, expanded],
  );

  const view = useMemo(() => {
    const filters: MapFilters = { search, enabledCategories, enabledComponents };
    return computeMapView(lineage, index, theme, filters, focusId, expanded);
  }, [lineage, index, theme, search, enabledCategories, enabledComponents, focusId, expanded]);
  const searching = search.trim() !== '';
  const rowCount = MAP_COLUMNS.reduce((n, c) => n + view.columns[c].length, 0);
  const matchCount = MAP_COLUMNS.reduce(
    (n, c) => n + view.columns[c].filter((r) => r.matches > 0).length,
    0,
  );

  const modesRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(webglFailed);
  const activeMode: MapMode = webglUnavailable ? '2d' : mode;
  const onUnavailable = useCallback(() => {
    webglFailed = true;
    setWebglUnavailable(true);
    onModeChange('2d');
    // The 3D button is about to be disabled; keep keyboard focus on the toggle.
    const [twoD, threeD] = modesRef.current?.querySelectorAll('button') ?? [];
    if (threeD && document.activeElement === threeD) twoD?.focus();
  }, [onModeChange]);

  // Back and the crumbs act on the trail, which can disable or replace the
  // control just used (Back at the overview, a crumb that becomes the current
  // one): focus then lands on the current crumb rather than the page. The
  // note only applies to the render that follows it.
  const trailRef = useRef<HTMLElement>(null);
  const trailActed = useRef(false);
  const noteTrailAction = () => {
    trailActed.current = trailRef.current?.contains(document.activeElement) ?? false;
  };
  useEffect(() => {
    if (!trailActed.current) return;
    trailActed.current = false;
    const active = document.activeElement;
    if (active && active !== document.body && !active.matches(':disabled')) return;
    trailRef.current?.querySelector<HTMLElement>('[aria-current="location"]')?.focus();
  });

  const crumbs = useMemo(
    () => trail.flatMap((id) => crumbOf(lineage, id) ?? []),
    [lineage, trail],
  );
  const shownCrumbs = crumbs.slice(-MAX_CRUMBS);
  const inspectorOpen = selectedId !== null && lineage.graph.nodesById.has(selectedId);

  return (
    <div className={`token-map${inspectorOpen ? ' token-map--inspector-open' : ''}`}>
      <div className="token-map__toolbar">
        <nav
          ref={trailRef}
          className="token-map__trail"
          aria-label="Map focus"
          // Escape pops the focus too (the page handles it).
          onKeyDown={(e) => e.key === 'Escape' && trail.length > 0 && noteTrailAction()}
          onClickCapture={noteTrailAction}
        >
          <button
            type="button"
            className="token-map__back"
            onClick={onBack}
            disabled={trail.length === 0}
            title="Back to the previous focus (Esc)"
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <ol className="token-map__crumbs">
            <li className="token-map__crumb">
              {crumbs.length === 0 ? (
                <span className="token-map__crumb-current" aria-current="location" tabIndex={-1}>
                  Overview
                </span>
              ) : (
                <button type="button" className="token-map__crumb-link" onClick={onReset}>
                  Overview
                </button>
              )}
            </li>
            {crumbs.length > shownCrumbs.length && (
              <li className="token-map__crumb token-map__crumb--gap" aria-hidden="true">
                …
              </li>
            )}
            {shownCrumbs.map((crumb, i) => (
              <li
                key={crumb.id}
                className={`token-map__crumb token-map__crumb--level token-map__crumb--${crumb.column}`}
              >
                {i === shownCrumbs.length - 1 ? (
                  <span
                    className="token-map__crumb-current"
                    aria-current="location"
                    tabIndex={-1}
                    title={crumb.label}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="token-map__crumb-link"
                    onClick={() => onFocus(crumb.id)}
                    title={crumb.label}
                  >
                    {crumb.label}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="token-map__search-status" role="status">
          {searching && rowCount > 0 && `${matchCount} of ${rowCount} rows match “${search.trim()}”`}
        </p>

        <p className="token-map__legend">
          <span className="token-map__legend-item">
            <span className="token-map__legend-line" aria-hidden="true" />
            {activeMode === '3d' ? 'brightness' : 'width'} = references
          </span>
          <span className="token-map__legend-item">
            <span className="token-map__legend-badge" aria-hidden="true">
              +N
            </span>
            users not shown
          </span>
        </p>

        <div className="token-map__modes" role="group" aria-label="Map rendering" ref={modesRef}>
          <button
            type="button"
            aria-pressed={activeMode === '2d'}
            className={`token-map__mode${activeMode === '2d' ? ' token-map__mode--active' : ''}`}
            onClick={() => onModeChange('2d')}
          >
            2D
          </button>
          <button
            type="button"
            aria-pressed={activeMode === '3d'}
            className={`token-map__mode${activeMode === '3d' ? ' token-map__mode--active' : ''}`}
            onClick={() => onModeChange('3d')}
            disabled={webglUnavailable}
            title={webglUnavailable ? 'WebGL is not available in this browser' : undefined}
          >
            3D
          </button>
        </div>
      </div>

      {activeMode === '3d' ? (
        <Suspense
          fallback={
            <div className="token-map__notice" role="status">
              Loading the 3D view…
            </div>
          }
        >
          <MapView3D
            view={view}
            searching={searching}
            selectedId={selectedId}
            onFocus={onFocus}
            onSelectToken={onSelectToken}
            onToggleGroup={toggleGroup}
            onUnavailable={onUnavailable}
          />
        </Suspense>
      ) : (
        <MapView2D
          view={view}
          searching={searching}
          selectedId={selectedId}
          onFocus={onFocus}
          onSelectToken={onSelectToken}
          onToggleGroup={toggleGroup}
        />
      )}
    </div>
  );
}
