/**
 * 2D rendering of the token map: four columns of row buttons over a single
 * SVG of links, all inside one scroller.
 *
 * Row and link geometry comes from arrange.ts, so nothing is measured. The
 * SVG's viewBox is 100 units wide and as tall as the rows, stretched to the
 * plot, so links follow resizes without JS. Hovering or keyboard-focusing a
 * row lights its lineage and dims everything else.
 */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenSwatch } from '../TokenSwatch';
import { COLUMN_X, ROW, layoutRows, linkPath } from './arrange';
import { MAP_COLUMNS, lineageOf, type MapColumn, type MapRow, type MapView } from './lineage';

export interface MapView2DProps {
  view: MapView;
  /** True while a search is active, so rows without matches are muted. */
  searching: boolean;
  /** The token open in the inspector. */
  selectedId: string | null;
  onFocus: (id: string) => void;
  onSelectToken: (id: string) => void;
  /** Expands or folds a collapsed group (its `toggleId`). */
  onToggleGroup: (groupId: string) => void;
}

const COLUMN_HEADS: Record<MapColumn, { title: string; caption: string; empty: string }> = {
  global: { title: 'Global', caption: 'Raw values', empty: 'No global tokens' },
  system: { title: 'System', caption: 'Semantic aliases', empty: 'No system tokens' },
  component: { title: 'Component', caption: 'Scoped to components', empty: 'No component tokens' },
  ui: { title: 'UI', caption: 'CSS files using them', empty: 'No CSS files' },
};

function columnStyle(column: MapColumn): React.CSSProperties {
  const { left, right } = COLUMN_X[column];
  return { left: `${left}%`, width: `${right - left}%` };
}

/** Link stroke in screen px: thicker for links that stand for more references. */
function strokeWidth(weight: number): number {
  return 1 + Math.min(4, Math.log2(Math.max(1, weight)));
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function rowTitle(row: MapRow): string {
  const lines = [row.title];
  if (row.kind === 'group') lines.push(plural(row.memberCount, 'token'));
  if (row.kind === 'group' && row.matches > 0 && row.matches < row.memberCount) {
    lines.push(`${row.matches} matching the search`);
  }
  if (row.value !== undefined) lines.push(row.value);
  if (row.elsewhere > 0) lines.push(`${plural(row.elsewhere, 'more user')} not on this map`);
  if (row.collapse === 'collapsed') lines.push('Click to show its tokens');
  return lines.join('\n');
}

/** The prefix a `group::<level>::<prefix>` id names. */
function groupPrefix(groupId: string): string {
  return groupId.slice(groupId.lastIndexOf('::') + 2);
}

/** Where keyboard focus goes when the row holding it is replaced. */
type RefocusTarget =
  /** The new focus row, else the row of the focus just left (Escape back to its parent view). */
  | { kind: 'focus'; fallback: string | null }
  | { kind: 'row'; id: string }
  /** The first member of a group just expanded. */
  | { kind: 'member'; groupId: string };

interface Refocus {
  target: RefocusTarget;
  /** The map focus and URL query when the keyboard acted. */
  focusId: string | null;
  search: string;
}

function refocusTarget(scroller: HTMLElement, r: RefocusTarget): HTMLElement | null {
  const find = (attribute: string, id: string) =>
    scroller.querySelector<HTMLElement>(`[${attribute}="${CSS.escape(id)}"]`);
  if (r.kind === 'row') return find('data-row-id', r.id);
  if (r.kind === 'member') return find('data-group-id', r.groupId);
  return (
    scroller.querySelector<HTMLElement>('.token-map__row--focus') ??
    (r.fallback === null ? null : find('data-row-id', r.fallback))
  );
}

interface RowSlotProps {
  row: MapRow;
  top: number;
  searching: boolean;
  /** The first member of an expanded group carries the fold control. */
  foldable: boolean;
  classes: string;
  /** `viaKeyboard`: activated with Enter or Space rather than a pointer. */
  onActivate: (row: MapRow, viaKeyboard: boolean) => void;
  onFold: (groupId: string, viaKeyboard: boolean) => void;
  onHover: (id: string | null) => void;
  onKeyboardFocus: (id: string | null) => void;
}

function RowSlot({
  row,
  top,
  searching,
  foldable,
  classes,
  onActivate,
  onFold,
  onHover,
  onKeyboardFocus,
}: RowSlotProps) {
  const isColor = row.swatches.length > 0;
  // Sibling tokens share long prefixes (`text-color.ghost.…`), so the prefix
  // gives way before the last segment that tells them apart.
  const cut = row.kind === 'token' ? row.label.lastIndexOf('.') + 1 : 0;
  return (
    <div
      className={`token-map__slot${row.collapse === 'expanded' ? ' token-map__slot--expanded' : ''}`}
      style={{ top }}
      // Move, not enter: after a focus change new rows slide under a resting
      // pointer, and that should not trace anything until the pointer moves.
      onPointerMove={() => onHover(row.id)}
      onPointerLeave={() => onHover(null)}
      // A pointer click focuses the button too; only keyboard focus traces.
      onFocus={(e) => onKeyboardFocus(e.target.matches(':focus-visible') ? row.id : null)}
      onBlur={() => onKeyboardFocus(null)}
    >
      <button
        type="button"
        className={classes}
        title={rowTitle(row)}
        aria-current={row.isFocus || undefined}
        aria-expanded={row.collapse === 'collapsed' ? false : undefined}
        data-row-id={row.id}
        data-group-id={row.collapse === 'expanded' ? row.toggleId : undefined}
        // Keyboard activation dispatches a click with no pointer presses.
        onClick={(e) => onActivate(row, e.detail === 0)}
      >
        {isColor && (
          <span className="token-map__swatches">
            {row.swatches.map((s) => (
              <TokenSwatch key={s} value={s} />
            ))}
          </span>
        )}
        <span className="token-map__label">
          {cut > 0 && <span className="token-map__label-head">{row.label.slice(0, cut)}</span>}
          <span className="token-map__label-tail">{row.label.slice(cut)}</span>
        </span>
        {row.kind === 'token' && !isColor && row.value !== undefined && (
          <code className="token-map__value">{row.value}</code>
        )}
        {row.kind === 'group' && (
          <span className="token-map__count">
            {searching && row.matches > 0 ? `${row.matches}/${row.memberCount}` : row.memberCount}
          </span>
        )}
        {row.elsewhere > 0 && (
          <span className="token-map__elsewhere">
            +{row.elsewhere}
            <span className="sr-only"> elsewhere</span>
          </span>
        )}
        {row.collapse === 'collapsed' && (
          <span className="token-map__chevron" aria-hidden="true">
            ▸
          </span>
        )}
      </button>
      {foldable && row.toggleId && (
        <button
          type="button"
          className="token-map__fold"
          onClick={(e) => onFold(row.toggleId!, e.detail === 0)}
          aria-label={`Collapse ${groupPrefix(row.toggleId)}`}
          title={`Collapse ${groupPrefix(row.toggleId)}`}
        >
          ▾
        </button>
      )}
    </div>
  );
}

export function MapView2D({
  view,
  searching,
  selectedId,
  onFocus,
  onSelectToken,
  onToggleGroup,
}: MapView2DProps) {
  const headId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef<string | null | undefined>(undefined);
  const refocus = useRef<Refocus | null>(null);
  const { search: urlSearch } = useLocation();

  const layout = useMemo(() => layoutRows(view), [view]);
  const columnById = useMemo(
    () => new Map(MAP_COLUMNS.flatMap((c) => view.columns[c].map((r) => [r.id, c] as const))),
    [view],
  );
  const links = useMemo(
    () =>
      view.links.map((l) => ({
        link: l,
        key: `${l.left}\n${l.right}`,
        d: linkPath(l, layout.top, (id) => columnById.get(id) ?? 'global'),
        width: strokeWidth(l.weight),
      })),
    [view.links, layout, columnById],
  );
  // The resting links never change on hover; only the lit overlay does.
  const restingLinks = useMemo(
    () =>
      links.map((l) => (
        <path
          key={l.key}
          className="token-map__edge"
          d={l.d}
          strokeWidth={l.width}
          vectorEffect="non-scaling-stroke"
        />
      )),
    [links],
  );

  // Pointer and keyboard focus each light a lineage; the pointer wins while both are set.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [keyboardId, setKeyboardId] = useState<string | null>(null);
  const candidate = hoverId ?? keyboardId;
  // A row that was expanded or folded away fires no leave event; ignore it.
  const activeId = candidate !== null && columnById.has(candidate) ? candidate : null;
  const lit = useMemo(() => (activeId ? lineageOf(view, activeId) : null), [view, activeId]);

  const isEmpty = MAP_COLUMNS.every((c) => view.columns[c].length === 0);
  const focusColumn = MAP_COLUMNS.findIndex((c) => view.columns[c].some((r) => r.isFocus));

  // Bring the focus into view once per focus: centred vertically below the
  // sticky heads, and its column centred when the map scrolls sideways. The
  // overview starts from the top.
  useEffect(() => {
    if (scrolledFor.current === view.focusId) return;
    scrolledFor.current = view.focusId;
    const scroller = scrollerRef.current;
    const plot = plotRef.current;
    if (!scroller || !plot) return;
    if (focusColumn < 0) {
      scroller.scrollTo(0, 0);
      return;
    }
    const tops = MAP_COLUMNS.flatMap((c) => view.columns[c])
      .filter((r) => r.isFocus)
      .map((r) => layout.top.get(r.id) ?? 0);
    const first = Math.min(...tops);
    const last = Math.max(...tops) + ROW.h;
    const visible = scroller.clientHeight - plot.offsetTop;
    scroller.scrollTop =
      last - first > visible ? first - ROW.padTop : (first + last) / 2 - visible / 2;
    const { left, right } = COLUMN_X[MAP_COLUMNS[focusColumn]];
    const centre = plot.offsetLeft + ((left + right) / 200) * plot.clientWidth;
    scroller.scrollLeft = centre - scroller.clientWidth / 2;
  }, [view, layout, focusColumn]);

  // Keyboard focus outlives the row it sat on being replaced (a new focus, a
  // group expanded or folded, Escape): it moves to the matching new row
  // instead of falling back to the top of the page. A new focus reaches the
  // URL a commit later and the site's ScrollToTop blurs on every URL change,
  // so the request is held until the URL has caught up.
  useEffect(() => {
    const pending = refocus.current;
    const scroller = scrollerRef.current;
    if (!pending || !scroller) return;
    const active = document.activeElement;
    if (active && active !== document.body && !scroller.contains(active)) {
      refocus.current = null;
      return;
    }
    if (!active || active === document.body) refocusTarget(scroller, pending.target)?.focus();
    if (view.focusId === pending.focusId || urlSearch !== pending.search) refocus.current = null;
  }, [view, urlSearch]);

  const requestRefocus = (target: RefocusTarget | null) => {
    refocus.current = target && { target, focusId: view.focusId, search: urlSearch };
  };

  const activate = (row: MapRow, viaKeyboard: boolean) => {
    if (row.collapse === 'collapsed' && row.toggleId) {
      requestRefocus(viaKeyboard ? { kind: 'member', groupId: row.toggleId } : null);
      onToggleGroup(row.toggleId);
      return;
    }
    requestRefocus(viaKeyboard ? { kind: 'focus', fallback: null } : null);
    onFocus(row.id);
    if (row.kind === 'token') onSelectToken(row.id);
  };

  const fold = (groupId: string, viaKeyboard: boolean) => {
    requestRefocus(viaKeyboard ? { kind: 'row', id: groupId } : null);
    onToggleGroup(groupId);
  };

  const rowClasses = (row: MapRow) =>
    [
      'token-map__row',
      `token-map__row--${row.kind}`,
      row.isFocus && 'token-map__row--focus',
      row.id === selectedId && 'token-map__row--selected',
      row.collapse === 'collapsed' && 'token-map__row--collapsed',
      lit && (lit.has(row.id) ? 'token-map__row--lit' : 'token-map__row--dim'),
      searching && row.matches === 0 && 'token-map__row--muted',
    ]
      .filter(Boolean)
      .join(' ');

  if (isEmpty) {
    return <div className="token-map__notice">No tokens match the current filters.</div>;
  }

  return (
    <div
      className="token-map__scroller"
      ref={scrollerRef}
      onKeyDown={(e) => {
        // The page pops the map focus on Escape; follow it from the row it leaves.
        if (e.key === 'Escape') requestRefocus({ kind: 'focus', fallback: view.focusId });
      }}
    >
      <div className="token-map__canvas">
        <div className="token-map__heads">
          <div className="token-map__heads-inner">
            {MAP_COLUMNS.map((c) => (
              <div key={c} className={`token-map__head token-map__head--${c}`} style={columnStyle(c)}>
                <h2 id={`${headId}-${c}`} className="token-map__head-title">
                  {COLUMN_HEADS[c].title}
                  <span className="token-map__head-count">{view.totals[c]}</span>
                </h2>
                <span className="token-map__head-caption">{COLUMN_HEADS[c].caption}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="token-map__plot" ref={plotRef} style={{ height: layout.height }}>
          <svg
            className={`token-map__edges${lit ? ' token-map__edges--tracing' : ''}`}
            viewBox={`0 0 100 ${layout.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g>{restingLinks}</g>
            {lit && (
              <g>
                {links
                  .filter((l) => lit.has(l.link.left) && lit.has(l.link.right))
                  .map((l) => (
                    <path
                      key={l.key}
                      className="token-map__edge token-map__edge--lit"
                      d={l.d}
                      strokeWidth={l.width}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
              </g>
            )}
          </svg>

          {MAP_COLUMNS.map((c, i) => {
            const rows = view.columns[c];
            return (
              <section
                key={c}
                className={`token-map__column token-map__column--${c}`}
                style={columnStyle(c)}
                aria-labelledby={`${headId}-${c}`}
              >
                {rows.length === 0 && (
                  <p className="token-map__column-empty" style={{ top: layout.height / 2 - ROW.h }}>
                    {COLUMN_HEADS[c].empty}
                    {focusColumn >= 0 && (i < focusColumn ? ' upstream' : ' downstream')}
                  </p>
                )}
                {layout.sections
                  .filter((s) => s.column === c)
                  .map((s) => (
                    <h3 key={`${s.label}@${s.top}`} className="token-map__section" style={{ top: s.top }}>
                      {s.label}
                    </h3>
                  ))}
                {rows.map((row, r) => (
                  <RowSlot
                    key={row.id}
                    row={row}
                    top={layout.top.get(row.id) ?? 0}
                    searching={searching}
                    foldable={row.collapse === 'expanded' && rows[r - 1]?.toggleId !== row.toggleId}
                    classes={rowClasses(row)}
                    onActivate={activate}
                    onFold={fold}
                    onHover={setHoverId}
                    onKeyboardFocus={setKeyboardId}
                  />
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
