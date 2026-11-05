/**
 * Open Graph images of the community projects and games live in
 * `src/assets/{community,games}/{slug}.webp` (the site's og:image, resized to 600×315).
 * A `{slug}-es.webp` file, when present, is used on the Spanish page.
 * Projects without a file show a placeholder.
 */
const files = import.meta.glob<string>('../assets/{community,games}/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bySlug: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.webp$/, ''), url]),
);

export function communityImage(slug: string, isEs = false): string | undefined {
  return (isEs ? bySlug[`${slug}-es`] : undefined) ?? bySlug[slug];
}
