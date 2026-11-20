/**
 * Reduces the small Markdown subset used by bios (bold, italic, links) to
 * plain text, for sites that do not render Markdown (X, Instagram, LinkedIn).
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .trim();
}
