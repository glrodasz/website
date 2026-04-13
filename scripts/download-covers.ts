/**
 * Build Script: Download and optimize book/film cover images
 * Output: public/images/covers/{books,films}/*.webp
 *
 * Run: npm run build:covers
 * Idempotent — skips files that already exist locally.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface Cover {
  title: string;
  url: string;
  outDir: 'books' | 'films';
}

const COVERS: Cover[] = [
  // Books
  { title: 'Immune', url: 'https://covers.openlibrary.org/b/id/10954401-M.jpg', outDir: 'books' },
  { title: 'Building a Second Brain', url: 'https://covers.openlibrary.org/b/id/12372866-M.jpg', outDir: 'books' },
  { title: 'Atomic Habits', url: 'https://covers.openlibrary.org/b/id/12539702-M.jpg', outDir: 'books' },
  { title: 'A Mind for Numbers', url: 'https://covers.openlibrary.org/b/id/8352403-M.jpg', outDir: 'books' },
  { title: 'Thanks for the Feedback', url: 'https://covers.openlibrary.org/b/id/9549524-M.jpg', outDir: 'books' },
  // Films
  { title: 'Memento', url: 'https://image.tmdb.org/t/p/w342/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg', outDir: 'films' },
  { title: 'Enemy', url: 'https://image.tmdb.org/t/p/w342/vf40tyDRKZsBmaLsYeopzfFLzLx.jpg', outDir: 'films' },
  { title: 'Donnie Darko', url: 'https://image.tmdb.org/t/p/w342/6FKym4sm5LcqUC80HNpn2ejVoro.jpg', outDir: 'films' },
  { title: 'The Rescue', url: 'https://image.tmdb.org/t/p/w342/kC7fVtCkJACwPBaRr2hlj2whfKX.jpg', outDir: 'films' },
  { title: 'Oldboy', url: 'https://image.tmdb.org/t/p/w342/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg', outDir: 'films' },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function downloadCover(cover: Cover, baseDir: string): Promise<void> {
  const outDir = path.join(baseDir, cover.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const filename = `${slugify(cover.title)}.webp`;
  const outPath = path.join(outDir, filename);

  if (fs.existsSync(outPath)) {
    console.log(`  ⏭  Skipped (exists): ${cover.outDir}/${filename}`);
    return;
  }

  const res = await fetch(cover.url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${cover.url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await sharp(buffer)
    .resize(180, 270, { fit: 'cover', position: 'top' })
    .webp({ quality: 85 })
    .toFile(outPath);

  const { size } = fs.statSync(outPath);
  console.log(`  ✅ Downloaded: ${cover.outDir}/${filename} (${Math.round(size / 1024)} KB)`);
}

async function main() {
  console.log('🖼  Downloading and optimizing cover images...');

  const baseDir = path.join(process.cwd(), 'public', 'images', 'covers');
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const cover of COVERS) {
    try {
      const outPath = path.join(baseDir, cover.outDir, `${slugify(cover.title)}.webp`);
      const existed = fs.existsSync(outPath);
      await downloadCover(cover, baseDir);
      if (existed) skipped++;
      else downloaded++;
    } catch (err) {
      console.error(`  ❌ Failed: ${cover.title} — ${err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('build:covers failed:', err);
  process.exit(1);
});
