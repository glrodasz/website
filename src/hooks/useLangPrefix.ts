import { useParams } from 'react-router-dom';

export function useLangPrefix(): string {
  const { lang } = useParams<{ lang?: string }>();
  return lang === 'es' ? '/es' : '';
}
