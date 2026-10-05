/**
 * 2D rendering of the token map: four columns of row buttons over a single
 * SVG of links, all inside one scroller.
 *
 * Row and link geometry comes from arrange.ts, so no row is measured. The
 * SVG's viewBox is 100 units wide and as tall as the rows, stretched to the
 * plot, so links follow resizes without JS. Hovering or keyboard-focusing a
 * row lights its lineage and dims everything else. When the scroller is
 * narrower than the map, the columns cut off at either side are named at
 * that edge.
 */

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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

/** Longer values (font stacks, `clamp()` expressions) stay in the tooltip and the inspector. */
const MAX_VALUE_CHARS = 7;
/** Space kept beside a column scrolled into view by the edge hint. */
const REVEAL_MARGIN = 14;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function columnStyle(column: MapColumn): React.CSSProperties {
  const { left, right } = COLUMN_X[column];
  return { left: `${left}%`, width: `${right - left}%` };
}

/** A column's left and right edges in the scroller's content px. */
function columnEdges(plot: HTMLElement, column: MapColumn): [number, number] {
  const at = (percent: number) => plot.offsetLeft + (percent / 100) * plot.clientWidth;
  return [at(COLUMN_X[column].left), at(COLUMN_X[column].right)];
}

/** Link stroke in screen px: thicker for links that stand for more references. */
function strokeWidth(weight: number): number {
  return 1 + Math.min(4, Math.log2(Math.max(1, weight)));
}

/**
 * Resting link opacity for a gap holding `count` links: a dense gap (176
 * system → namespace links in the overview) fades so it reads as texture
 * rather than a solid mass, while a sparse one stays clearly drawn.
 */
function restingOpacity(count: number): number {
  return Math.min(0.35, Math.max(0.08, 0.35 * Math.sqrt(16 / count)));
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

/** The value worth printing in a token row: short ones only, and not when the label already says it. */
function shownValue(row: MapRow): string | null {
  const { value } = row;
  if (row.kind !== 'token' || row.swatches.length > 0 || value === undefined) return null;
  if (value.length > MAX_VALUE_CHARS) return null;
  // Scale steps are named by their value (`Sizing.16` is 16).
  return value === row.label.slice(row.label.lastIndexOf('.') + 1) ? null : value;
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
  | { kind: 'member'; groupId: string }
  /** The edge hint at `side` scrolled its columns into view and went away. */
  | { kind: 'edge'; side: keyof Overflow };

function refocusTarget(root: HTMLElement, r: RefocusTarget): HTMLElement | null {
  const find = (attribute: string, id: string) =>
    root.querySelector<HTMLElement>(`[${attribute}="${CSS.escape(id)}"]`);
  if (r.kind === 'row') return find('data-row-id', r.id);
  if (r.kind === 'member') return find('data-group-id', r.groupId);
  if (r.kind === 'edge') {
    const other = r.side === 'after' ? 'before' : 'after';
    return (
      root.querySelector<HTMLElement>(`.token-map__more--${other} .token-map__more-button`) ??
      rowNearEdge(root, r.side)
    );
  }
  return (
    root.querySelector<HTMLElement>('.token-map__row--focus') ??
    (r.fallback === null ? null : find('data-row-id', r.fallback))
  );
}

/** The first row below the sticky heads in the column nearest that edge that has rows. */
function rowNearEdge(root: HTMLElement, side: keyof Overflow): HTMLElement | null {
  const floor = root.querySelector('.token-map__heads')?.getBoundingClientRect().bottom ?? 0;
  const columns = side === 'after' ? [...MAP_COLUMNS].reverse() : MAP_COLUMNS;
  for (const c of columns) {
    const rows = [
      ...root.querySelectorAll<HTMLElement>(`.token-map__column--${c} .token-map__row`),
    ];
    const row = rows.find((r) => r.getBoundingClientRect().top >= floor) ?? rows[rows.length - 1];
    if (row) return row;
  }
  return null;
}

interface Overflow {
  /** Columns cut off on the left, then on the right, of the scroller. */
  before: readonly MapColumn[];
  after: readonly MapColumn[];
}

const NO_OVERFLOW: Overflow = { before: [], after: [] };

interface RowSlotProps {
  row: MapRow;
  top: number;
  searching: boolean;
  /** In the lineage being traced; rows outside it dim while one is. */
  lit: boolean;
  selected: boolean;
  /** The first member of an expanded group carries the fold control. */
  foldable: boolean;
  /** `viaKeyboard`: activated with Enter or Space rather than a pointer. */
  onActivate: (row: MapRow, viaKeyboard: boolean) => void;
  onFold: (groupId: string, viaKeyboard: boolean) => void;
  onHover: (id: string | null) => void;
  onKeyboardFocus: (id: string | null) => void;
}

/** Memoised on primitive state, so tracing a lineage re-renders only the rows it lights or leaves. */
const RowSlot = memo(function RowSlot({
  row,
  top,
  searching,
  lit,
  selected,
  foldable,
  onActivate,
  onFold,
  onHover,
  onKeyboardFocus,
}: RowSlotProps) {
  const isColor = row.swatches.length > 0;
  const muted = searching && row.matches === 0;
  const value = shownValue(row);
  // Sibling tokens share long prefixes (`text-color.ghost.…`), so the prefix
  // gives way before the last segment that tells them apart.
  const cut = row.kind === 'token' ? row.label.lastIndexOf('.') + 1 : 0;
  const classes = [
    'token-map__row',
    `token-map__row--${row.kind}`,
    row.isFocus && 'token-map__row--focus',
    selected && 'token-map__row--selected',
    row.collapse === 'collapsed' && 'token-map__row--collapsed',
    lit && 'token-map__row--lit',
    muted && 'token-map__row--muted',
  ]
    .filter(Boolean)
    .join(' ');
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
        {value !== null && <code className="token-map__value">{value}</code>}
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
        {muted && <span className="sr-only"> (no match)</span>}
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
});

export function MapView2D({
  view,
  searching,
  selectedId,
  onFocus,
  onSelectToken,
  onToggleGroup,
}: MapView2DProps) {
  const headId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef<string | null | undefined>(undefined);
  const refocus = useRef<RefocusTarget | null>(null);

  const layout = useMemo(() => layoutRows(view), [view]);
  const headingByRow = useMemo(
    () => new Map(layout.sections.map((s) => [s.rowId, s] as const)),
    [layout],
  );
  const columnById = useMemo(
    () => new Map(MAP_COLUMNS.flatMap((c) => view.columns[c].map((r) => [r.id, c] as const))),
    [view],
  );
  const links = useMemo(
    () =>
      view.links.map((l) => ({
        link: l,
        key: `${l.left}\n${l.right}`,
        column: columnById.get(l.left) ?? 'global',
        d: linkPath(l, layout.top, (id) => columnById.get(id) ?? 'global'),
        width: strokeWidth(l.weight),
      })),
    [view.links, layout, columnById],
  );
  // The resting links never change on hover; only the lit overlay does.
  const restingLinks = useMemo(
    () =>
      MAP_COLUMNS.map((column) => {
        const gap = links.filter((l) => l.column === column);
        if (gap.length === 0) return null;
        const style = { '--token-map-edge-rest': restingOpacity(gap.length) } as React.CSSProperties;
        return (
          <g key={column} style={style}>
            {gap.map((l) => (
              <path
                key={l.key}
                className="token-map__edge"
                d={l.d}
                strokeWidth={l.width}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        );
      }),
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
    const [left, right] = columnEdges(plot, MAP_COLUMNS[focusColumn]);
    scroller.scrollLeft = (left + right) / 2 - scroller.clientWidth / 2;
  }, [view, layout, focusColumn]);

  // A keyboard action can replace the row holding focus (a new focus, a group
  // expanded or folded, Escape back out): focus moves to the matching new row
  // rather than dropping to the page. The request only applies to the render
  // that follows it.
  useEffect(() => {
    const pending = refocus.current;
    refocus.current = null;
    const viewport = viewportRef.current;
    const active = document.activeElement;
    if (!pending || !viewport || (active && active !== document.body)) return;
    refocusTarget(viewport, pending)?.focus();
  });

  const focusId = view.focusId;
  const activate = useCallback(
    (row: MapRow, viaKeyboard: boolean) => {
      if (row.collapse === 'collapsed' && row.toggleId) {
        if (viaKeyboard) refocus.current = { kind: 'member', groupId: row.toggleId };
        onToggleGroup(row.toggleId);
        return;
      }
      if (viaKeyboard && row.id !== focusId) refocus.current = { kind: 'focus', fallback: null };
      onFocus(row.id);
      if (row.kind === 'token') onSelectToken(row.id);
    },
    [focusId, onFocus, onSelectToken, onToggleGroup],
  );

  const fold = useCallback(
    (groupId: string, viaKeyboard: boolean) => {
      if (viaKeyboard) refocus.current = { kind: 'row', id: groupId };
      onToggleGroup(groupId);
    },
    [onToggleGroup],
  );

  // Which columns the scroller cuts off, so its edges can name them.
  const [overflow, setOverflow] = useState<Overflow>(NO_OVERFLOW);
  const hintRefs = useRef<Record<keyof Overflow, HTMLButtonElement | null>>({
    before: null,
    after: null,
  });
  const measureOverflow = useCallback(() => {
    const scroller = scrollerRef.current;
    const plot = plotRef.current;
    if (!scroller || !plot) return;
    const start = scroller.scrollLeft;
    const end = start + scroller.clientWidth;
    const before = MAP_COLUMNS.filter((c) => columnEdges(plot, c)[0] < start - 1);
    const after = MAP_COLUMNS.filter((c) => columnEdges(plot, c)[1] > end + 1);
    // A hint unmounts once its columns are in view; if it held focus, focus
    // moves on rather than dropping to the page.
    const focused = (['before', 'after'] as const).find(
      (side) => hintRefs.current[side] === document.activeElement,
    );
    if (focused && { before, after }[focused].length === 0) {
      refocus.current = { kind: 'edge', side: focused };
    }
    setOverflow((prev) =>
      prev.before.join() === before.join() && prev.after.join() === after.join()
        ? prev
        : { before, after },
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [measureOverflow, isEmpty]);

  const reveal = (side: keyof Overflow) => {
    const scroller = scrollerRef.current;
    const plot = plotRef.current;
    const columns = overflow[side];
    if (!scroller || !plot || columns.length === 0) return;
    const left =
      side === 'after'
        ? columnEdges(plot, columns[0])[0] - REVEAL_MARGIN
        : columnEdges(plot, columns[columns.length - 1])[1] + REVEAL_MARGIN - scroller.clientWidth;
    const smooth = !window.matchMedia(REDUCED_MOTION).matches;
    scroller.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
  };

  if (isEmpty) {
    return <div className="token-map__notice">No tokens match the current filters.</div>;
  }

  return (
    <div className="token-map__viewport" ref={viewportRef}>
      <div
        className="token-map__scroller"
        ref={scrollerRef}
        onScroll={measureOverflow}
        onKeyDown={(e) => {
          // The page pops the map focus on Escape; follow it from the row it leaves.
          if (e.key === 'Escape' && focusId !== null) {
            refocus.current = { kind: 'focus', fallback: focusId };
          }
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

          <div
            className={`token-map__plot${lit ? ' token-map__plot--tracing' : ''}`}
            ref={plotRef}
            style={{ height: layout.height }}
          >
            <svg
              className={`token-map__edges${lit ? ' token-map__edges--tracing' : ''}`}
              viewBox={`0 0 100 ${layout.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {restingLinks}
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
                  {rows.flatMap((row, r) => {
                    const heading = headingByRow.get(row.id);
                    const slot = (
                      <RowSlot
                        key={row.id}
                        row={row}
                        top={layout.top.get(row.id) ?? 0}
                        searching={searching}
                        lit={lit?.has(row.id) ?? false}
                        selected={row.id === selectedId}
                        foldable={row.collapse === 'expanded' && rows[r - 1]?.toggleId !== row.toggleId}
                        onActivate={activate}
                        onFold={fold}
                        onHover={setHoverId}
                        onKeyboardFocus={setKeyboardId}
                      />
                    );
                    // Each heading comes right before its first row, so reading order follows the sections.
                    return heading
                      ? [
                          <h3
                            key={`heading:${row.id}`}
                            className="token-map__section"
                            style={{ top: heading.top }}
                          >
                            {heading.label}
                          </h3>,
                          slot,
                        ]
                      : [slot];
                  })}
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {(['before', 'after'] as const).map(
        (side) =>
          overflow[side].length > 0 && (
            <div key={side} className={`token-map__more token-map__more--${side}`}>
              <button
                type="button"
                className="token-map__more-button"
                ref={(el) => {
                  hintRefs.current[side] = el;
                }}
                onClick={() => reveal(side)}
              >
                {side === 'before' && <span aria-hidden="true">←</span>}
                <span className="sr-only">Scroll to </span>
                {overflow[side].map((c) => COLUMN_HEADS[c].title).join(' · ')}
                {side === 'after' && <span aria-hidden="true">→</span>}
              </button>
            </div>
          ),
      )}
    </div>
  );
}
