import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
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

    const first = focusables()[0];
    if (first) {
      first.focus();
    } else {
      container.focus();
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
        if (document.activeElement === firstEl) {
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
  }, [active, ref]);
}
