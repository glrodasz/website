import { useLocation } from 'react-router-dom';

export function useLangPrefix(): string {
  const { pathname } = useLocation();
  return pathname === '/es' || pathname.startsWith('/es/') ? '/es' : '';
}
