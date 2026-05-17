import { useLocation } from 'react-router-dom';

export function useLangPrefix(): string {
  const { pathname } = useLocation();
  return pathname.startsWith('/es') ? '/es' : '';
}
