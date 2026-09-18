import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapOptions {
  /**
   * Where focus lands when the trap engages. 'first' (default) focuses the
   * first control inside. 'container' focuses the container itself — use it
   * when the first control is a text field, which would open the on-screen
   * keyboard (and zoom the page on iOS) just from opening the panel.
   */
  initialFocus?: 'first' | 'container';
}

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  { initialFocus = 'first' }: FocusTrapOptions = {},
) {
  const previousFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    const container = ref.current;
    if (!container) return;

    previousFocus.current = document.activeElement;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest('[aria-hidden="true"]')
      );

    const first = initialFocus === 'container' ? undefined : focusables()[0];
    if (first) {
      first.focus();
    } else {
      container.focus({ preventScroll: true });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const els = focusables();
      if (els.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = els[0];
      const lastEl = els[els.length - 1];

      if (e.shiftKey) {
        // The container itself can hold focus (initialFocus: 'container'), and
        // it sits before every control, so shift-tab from it wraps to the last.
        if (document.activeElement === firstEl || document.activeElement === container) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      const prev = previousFocus.current;
      if (prev instanceof HTMLElement) {
        prev.focus();
      }
    };
  }, [active, ref, initialFocus]);
}
