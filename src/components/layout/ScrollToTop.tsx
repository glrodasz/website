import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets document scroll on client-side route changes (React Router does not by default).
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}
