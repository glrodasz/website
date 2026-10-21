/**
 * Open Graph images of the community projects live in `src/assets/community/{slug}.webp`
 * (the site's og:image, resized to 600×315). Projects without a file show a placeholder.
 */
const files = import.meta.glob<string>('../assets/community/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bySlug: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.webp$/, ''), url]),
);

export function communityImage(slug: string): string | undefined {
  return bySlug[slug];
}
