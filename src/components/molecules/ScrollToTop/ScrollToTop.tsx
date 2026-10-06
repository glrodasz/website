import { useEffect, useRef, type FC } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export interface ScrollToTopProps {
  /** Override scroll behavior. Defaults to `instant` for route changes. */
  behavior?: ScrollBehavior;
}

/**
 * Headless helper: resets document scroll on client-side route changes.
 * React Router does not do this by default. Also blurs the active element
 * so the user's next Tab restarts from the top of the document (skip-link
 * → Logo → nav links) rather than continuing from the link they clicked.
 *
 * A page that replaces its own query string to mirror its state (the token
 * explorer) has not navigated anywhere, so that is left alone: resetting
 * there would throw away the scroll position and keyboard focus the user
 * is working with.
 */
export const ScrollToTop: FC<ScrollToTopProps> = ({ behavior = 'instant' }) => {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const samePage = previousPathname.current === pathname;
    previousPathname.current = pathname;
    if (hash || (samePage && navigationType === 'REPLACE')) return;
    window.scrollTo({ top: 0, left: 0, behavior });
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      active.blur();
    }
  }, [pathname, search, hash, navigationType, behavior]);

  return null;
};

export default ScrollToTop;
