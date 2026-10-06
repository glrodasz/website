/**
 * 3D rendering of the token map: the same visible subgraph as the 2D map,
 * one layer per column, orbited with the pointer. MapView loads this lazily,
 * and the three.js scene is fetched on mount, so neither ships with /tokens.
 *
 * Picking a node does what clicking its 2D row does. Keyboard and screen
 * reader users are pointed to the 2D map, which lists the same rows. When
 * WebGL cannot start, `onUnavailable` sends the map back to 2D.
 */

import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ThemeMode } from '../../../tokens/graph-builder';
import { toSceneNodes } from './layout3d';
import { MAP_COLUMNS, lineageOf, type MapRow, type MapView } from './lineage';
import type { SceneHighlight, TokenMapScene } from './scene3d';

export interface MapView3DProps {
  view: MapView;
  /** The canvas theme, which the scene's colours follow. */
  theme: ThemeMode;
  /** True while a search is active, so rows without matches are muted. */
  searching: boolean;
  /** The token open in the inspector. */
  selectedId: string | null;
  onFocus: (id: string) => void;
  onSelectToken: (id: string) => void;
  /** Expands or folds a collapsed group (its `toggleId`). */
  onToggleGroup: (groupId: string) => void;
  /** Called when WebGL cannot start; the map falls back to 2D. */
  onUnavailable: () => void;
}

const MAX_PIXEL_RATIO = 2;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const NONE: ReadonlySet<string> = new Set();

/**
 * There are no section headings in 3D, so a token whose label is a single
 * segment (`sm`, `16`) is named with its section (`Spacing.sm`).
 */
function sceneLabel(row: MapRow): string {
  if (row.kind !== 'token' || row.label.includes('.') || !row.section) return row.label;
  return `${row.section.split(' / ').at(-1)}.${row.label}`;
}

const MapView3D: React.FC<MapView3DProps> = ({
  view,
  theme,
  searching,
  selectedId,
  onFocus,
  onSelectToken,
  onToggleGroup,
  onUnavailable,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const framed = useRef<{ scene: TokenMapScene; structure: string } | null>(null);
  const [scene, setScene] = useState<TokenMapScene | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(REDUCED_MOTION).matches);

  const rowsById = useMemo(
    () => new Map(MAP_COLUMNS.flatMap((c) => view.columns[c].map((r) => [r.id, r] as const))),
    [view],
  );
  const nodes = useMemo(
    () => toSceneNodes(view, theme).map((n) => ({ ...n, label: sceneLabel(rowsById.get(n.id)!) })),
    [view, theme, rowsById],
  );
  const structure = useMemo(() => nodes.map((n) => `${n.id}@${n.position.join()}`).join('\n'), [nodes]);

  const hovered = hoverId === null ? undefined : rowsById.get(hoverId);
  const highlight = useMemo<SceneHighlight>(() => {
    const rows = [...rowsById.values()];
    return {
      focusIds: new Set(rows.filter((r) => r.isFocus).map((r) => r.id)),
      lit: hovered ? lineageOf(view, hovered.id) : null,
      selectedId,
      muted: searching ? new Set(rows.filter((r) => r.matches === 0).map((r) => r.id)) : NONE,
    };
  }, [view, rowsById, hovered, selectedId, searching]);

  // Rows that stand for an expanded group, one per group, so it can be folded again.
  const expandedGroups = useMemo(() => {
    const ids = new Set<string>();
    for (const row of rowsById.values()) {
      if (row.collapse === 'expanded' && row.toggleId) ids.add(row.toggleId);
    }
    return [...ids].map((id) => ({ id, label: id.slice(id.lastIndexOf('::') + 2).split('.').at(-1) }));
  }, [rowsById]);

  const pick = useEffectEvent((id: string) => {
    const row = rowsById.get(id);
    if (!row) return;
    if (row.collapse === 'collapsed' && row.toggleId) {
      onToggleGroup(row.toggleId);
      return;
    }
    onFocus(id);
    if (row.kind === 'token') onSelectToken(id);
  });
  const reportUnavailable = useEffectEvent(() => onUnavailable());
  const currentTheme = useEffectEvent(() => theme);

  // A layout effect, so dispose() runs before React detaches the canvas:
  // OrbitControls removes its document keydown listener via the canvas's root node.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const labelLayer = labelsRef.current;
    if (!stage || !canvas || !labelLayer) return;
    let created: TokenMapScene | null = null;
    let disposed = false;

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = stage;
      if (!created || width === 0 || height === 0) return;
      created.resize(width, height, Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    };
    const resizeObserver = new ResizeObserver(resize);

    // three.js ships in its own chunk, fetched only when the 3D view opens.
    import('./scene3d')
      .then(({ createTokenMapScene }) => {
        if (disposed) return;
        try {
          created = createTokenMapScene(
            canvas,
            labelLayer,
            { hover: (id) => setHoverId(id), pick: (id) => pick(id) },
            currentTheme(),
          );
        } catch {
          reportUnavailable();
          return;
        }
        resize();
        resizeObserver.observe(stage);
        setScene(created);
      })
      .catch(() => {
        // Chunk failed to load (offline, deploy skew): 2D still works.
        if (!disposed) reportUnavailable();
      });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      created?.dispose();
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    scene?.setReducedMotion(reducedMotion);
  }, [scene, reducedMotion]);

  // Declared before the graph effect, which recolours with this palette.
  useEffect(() => {
    scene?.setTheme(theme);
  }, [scene, theme]);

  // Declared before the highlight and fit effects: both need the new graph in place.
  useEffect(() => {
    scene?.setGraph(nodes, view.links, view.totals);
  }, [scene, nodes, view.links, view.totals]);

  useEffect(() => {
    scene?.setHighlight(highlight);
  }, [scene, highlight]);

  // Frame the graph whenever its rows or positions change: at once for a new
  // scene, then with a short tween so the new focus is followed, not jumped to.
  useEffect(() => {
    if (!scene || (framed.current?.scene === scene && framed.current.structure === structure)) return;
    const first = framed.current?.scene !== scene;
    framed.current = { scene, structure };
    scene.fit(!first);
  }, [scene, structure]);

  const status = !scene ? 'Loading the 3D view…' : nodes.length === 0 ? 'No tokens match the current filters.' : null;

  return (
    <div className="token-map__stage" ref={stageRef}>
      <canvas
        ref={canvasRef}
        className="token-map__canvas3d"
        role="img"
        aria-label="3D token map. The 2D view shows the same rows and works with the keyboard."
        title={hovered?.title}
      />
      <div ref={labelsRef} className="token-map__labels3d" aria-hidden="true" />
      {status && (
        <div className="token-map__notice token-map__notice--overlay" role="status">
          {status}
        </div>
      )}
      <div className="token-map__dock3d">
        {expandedGroups.map((g) => (
          <button
            key={g.id}
            type="button"
            className="token-map__chip3d"
            onClick={(e) => {
              // The chip goes away with its group; keep keyboard focus in the dock.
              const chip = e.currentTarget;
              if (document.activeElement === chip) {
                (chip.nextElementSibling as HTMLElement | null)?.focus();
              }
              onToggleGroup(g.id);
            }}
            title={`Collapse ${g.label} back into one node`}
          >
            <span aria-hidden="true">▴</span> Fold {g.label}
          </button>
        ))}
        <button
          type="button"
          className="token-map__chip3d"
          onClick={() => scene?.fit(true)}
          disabled={!scene}
        >
          Reset view
        </button>
        <span className="token-map__hint3d">Drag to orbit · scroll to zoom · click a node to trace it</span>
      </div>
    </div>
  );
};

export default MapView3D;
