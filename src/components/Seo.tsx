import { defaultDescription } from '../data/site';

function normalizeBase(url: string): string {
  return url.replace(/\/$/, '');
}

function joinUrl(base: string, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${normalizeBase(base)}${p}`;
}

export interface SeoProps {
  title: string;
  description?: string;
  /** Path only, e.g. `/contact` or `/about/history` */
  path?: string;
}

/**
 * Document head tags (React 19 hoists these). Set `VITE_SITE_URL` (no trailing slash)
 * for canonical, og:url, and og:image absolute URLs.
 */
export function Seo({ title, description, path = '/' }: SeoProps) {
  const baseRaw = import.meta.env.VITE_SITE_URL;
  const base =
    typeof baseRaw === 'string' && baseRaw.length > 0 ? normalizeBase(baseRaw) : '';
  const canonical = base ? joinUrl(base, path) : undefined;
  const desc = description ?? defaultDescription;
  const ogImage = base ? `${base}/images/guillermo-rodas.png` : undefined;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta
        name="twitter:card"
        content={ogImage ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </>
  );
}
