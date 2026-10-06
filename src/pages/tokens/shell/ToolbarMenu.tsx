/**
 * A toolbar button that opens a popover, Storybook-style.
 *
 * `kind="menu"` makes the popover itself an ARIA menu (the Theme picker).
 * `kind="dialog"` makes it a small non-modal dialog that holds a few plain
 * controls (search, Select all, Clear) above an ARIA menu (the filters).
 * Either way, menu rows are marked `data-menu-row`, each with one
 * `data-menu-primary` item and optionally a `data-menu-secondary` one, and
 * this component gives them the keyboard: arrows, Home/End, typeahead,
 * Left/Right between a row's items, Escape back to the trigger. Activating
 * an item marked `data-menu-close` closes the popover and returns focus to
 * the trigger. It also closes on an outside press or when focus leaves it,
 * and is kept inside the viewport.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export interface ToolbarMenuProps {
  /** The trigger's accessible name; it must contain the trigger's visible text. */
  label: string;
  /** Trigger content (icon, text, badge). */
  trigger: ReactNode;
  kind: 'menu' | 'dialog';
  /** Accessible name of the popover. */
  popupLabel: string;
  /** Selector, inside the popover, of what takes focus on open; defaults to the first row. */
  initialFocus?: string;
  /** Trigger styling for a control whose value differs from its default. */
  active?: boolean;
  className?: string;
  children: ReactNode;
}

const GAP = 6;
const EDGE = 8;
const TYPEAHEAD_MS = 600;
const TEXT_FIELD_ON_TOUCH = '(pointer: coarse)';

function primaryOf(row: Element): HTMLElement | null {
  return row.matches('[data-menu-primary]')
    ? (row as HTMLElement)
    : row.querySelector<HTMLElement>('[data-menu-primary]');
}

export function ToolbarMenu({
  label,
  trigger,
  kind,
  popupLabel,
  initialFocus,
  active,
  className,
  children,
}: ToolbarMenuProps) {
  const [open, setOpen] = useState(false);
  const popupId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Fixed positioning escapes the toolbar's sideways scroll on small screens;
  // the popover is then nudged back inside the viewport.
  const place = useCallback(() => {
    const button = triggerRef.current;
    const popup = popupRef.current;
    if (!button || !popup) return;
    const anchor = button.getBoundingClientRect();
    const top = anchor.bottom + GAP;
    const width = popup.offsetWidth;
    const left = Math.min(Math.max(EDGE, anchor.left), window.innerWidth - width - EDGE);
    popup.style.top = `${top}px`;
    popup.style.left = `${Math.max(EDGE, left)}px`;
    popup.style.maxHeight = `${Math.max(120, window.innerHeight - top - EDGE)}px`;
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const popup = popupRef.current;
    if (!popup) return;
    let target = initialFocus ? popup.querySelector<HTMLElement>(initialFocus) : null;
    // A text field would raise the on-screen keyboard over the list it filters.
    if (target instanceof HTMLInputElement && window.matchMedia(TEXT_FIELD_ON_TOUCH).matches) {
      target = null;
    }
    const firstRow = popup.querySelector('[data-menu-row]');
    (target ?? (firstRow && primaryOf(firstRow)) ?? popup).focus();

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, initialFocus]);

  const rows = () => [...(popupRef.current?.querySelectorAll('[data-menu-row]') ?? [])];

  const focusRow = (index: number) => {
    const all = rows();
    if (all.length === 0) return;
    primaryOf(all[(index + all.length) % all.length])?.focus();
  };

  const onPopupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const all = rows();
    const row = target.closest('[data-menu-row]');
    const index = row ? all.indexOf(row) : -1;
    const inField = target instanceof HTMLInputElement;

    if (e.key === 'ArrowDown' && (index >= 0 || inField)) {
      e.preventDefault();
      focusRow(index + 1);
    } else if (e.key === 'ArrowUp' && index >= 0) {
      e.preventDefault();
      focusRow(index - 1);
    } else if (e.key === 'Home' && index >= 0) {
      e.preventDefault();
      focusRow(0);
    } else if (e.key === 'End' && index >= 0) {
      e.preventDefault();
      focusRow(all.length - 1);
    } else if (e.key === 'ArrowRight' && row) {
      const secondary = row.querySelector<HTMLElement>('[data-menu-secondary]');
      if (secondary) {
        e.preventDefault();
        secondary.focus();
      }
    } else if (e.key === 'ArrowLeft' && row) {
      e.preventDefault();
      primaryOf(row)?.focus();
    } else if (
      index >= 0 &&
      e.key.length === 1 &&
      e.key !== ' ' &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      const now = performance.now();
      const state = typeahead.current;
      state.text = (now - state.at > TYPEAHEAD_MS ? '' : state.text) + e.key.toLowerCase();
      state.at = now;
      const ordered = [...all.slice(index + 1), ...all.slice(0, index + 1)];
      // A repeated letter cycles through the rows starting with it.
      const needle = /^(.)\1+$/.test(state.text) ? state.text[0] : state.text;
      const match = ordered.find((r) =>
        (r.getAttribute('data-menu-text') ?? r.textContent ?? '').trim().toLowerCase().startsWith(needle),
      );
      if (match) {
        e.preventDefault();
        primaryOf(match)?.focus();
      }
    }
  };

  return (
    <span
      ref={rootRef}
      className={`tokens-menu${className ? ` ${className}` : ''}`}
      onKeyDown={(e) => {
        // The page also unwinds on Escape; the open menu is the first layer,
        // whether focus is in the popover or still on its trigger.
        if (open && e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          close(true);
        }
      }}
      onBlur={(e) => {
        // A press on the popover's padding blurs to nothing; only a real move elsewhere closes it.
        const next = e.relatedTarget as Node | null;
        if (open && next && !rootRef.current?.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`tokens-toolbar__button${active ? ' tokens-toolbar__button--active' : ''}`}
        aria-label={label}
        aria-haspopup={kind}
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={popupRef}
          id={popupId}
          className={`tokens-menu__popup tokens-menu__popup--${kind}`}
          role={kind}
          aria-label={popupLabel}
          tabIndex={-1}
          onKeyDown={onPopupKeyDown}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[data-menu-close]')) close(true);
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}
