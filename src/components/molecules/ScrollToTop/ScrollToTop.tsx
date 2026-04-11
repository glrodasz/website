import { useEffect, type FC } from 'react';
import { useLocation } from 'react-router-dom';

export interface ScrollToTopProps {
  /** Override scroll behavior. Defaults to `instant` for route changes. */
  behavior?: ScrollBehavior;
}

/**
 * Headless helper: resets document scroll on client-side route changes.
 * React Router does not do this by default.
 */
export const ScrollToTop: FC<ScrollToTopProps> = ({ behavior = 'instant' }) => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, search, behavior]);

  return null;
};

export default ScrollToTop;
