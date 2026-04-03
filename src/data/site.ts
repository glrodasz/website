export const SITE_NAME = 'Guillermo Rodas';

export const SITE_TAGLINE =
  'Senior Full-stack AI JavaScript Engineer';

export const defaultTitle = `${SITE_NAME} | ${SITE_TAGLINE}`;

/** ~155 chars for search snippets */
export const defaultDescription =
  'Guillermo Rodas helps developers level up while shipping quality software. Courses, AI-first programming, YouTube tutorials, and writing on undefined.sh.';

export function titleForPage(pageLabel: string): string {
  return `${pageLabel} | ${SITE_NAME}`;
}
