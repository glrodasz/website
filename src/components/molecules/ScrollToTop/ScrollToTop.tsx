import { useEffect, type FC } from 'react';
import { useLocation } from 'react-router-dom';

export interface ScrollToTopProps {
  /** Override scroll behavior. Defaults to `instant` for route changes. */
  behavior?: ScrollBehavior;
}

/**
 * Headless helper: resets document scroll on client-side route changes.
 * React Router does not do this by default. Also blurs the active element
 * so the user's next Tab restarts from the top of the document (skip-link
 * → Logo → nav links) rather than continuing from the link they clicked.
 */
export const ScrollToTop: FC<ScrollToTopProps> = ({ behavior = 'instant' }) => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior });
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      active.blur();
    }
  }, [pathname, search, hash, behavior]);

  return null;
};

export default ScrollToTop;
