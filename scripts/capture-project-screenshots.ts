/**
 * Build Script: Capture screenshots of the Fun Projects
 * Output: src/assets/projects/{slug}.webp
 *
 * Run: npm run build:screenshots            (skips projects that already have one)
 *      npm run build:screenshots -- --force (re-captures everything)
 *      npm run build:screenshots -- walleto html-colors   (only these slugs, always re-captured)
 *
 * Needs network access to every project URL and a Playwright Chromium
 * (`npx playwright install chromium`, or point CHROMIUM_PATH at an existing binary).
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { FUN_PROJECTS } from '../src/data/funProjects';

const VIEWPORT = { width: 1280, height: 800 };
const OUTPUT_WIDTH = 960;
const SETTLE_MS = 1500;
const NAVIGATION_TIMEOUT_MS = 30_000;

const OUT_DIR = path.resolve(import.meta.dirname, '../src/assets/projects');

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('--'));

  const projects = FUN_PROJECTS.filter((p) => p.capturable !== false).filter(
    (p) => only.length === 0 || only.includes(p.slug),
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });

  let failed = 0;
  try {
    for (const project of projects) {
      const outPath = path.join(OUT_DIR, `${project.slug}.webp`);
      if (fs.existsSync(outPath) && !force && only.length === 0) {
        console.log(`  ⏭  Skipped (exists): ${project.slug}.webp`);
        continue;
      }

      const page = await context.newPage();
      try {
        await page.goto(project.url, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT_MS });
        await page.waitForTimeout(SETTLE_MS);
        const png = await page.screenshot({ type: 'png' });
        await sharp(png).resize({ width: OUTPUT_WIDTH }).webp({ quality: 80 }).toFile(outPath);
        console.log(`  ✅ ${project.slug}.webp ← ${project.url}`);
      } catch (error) {
        failed++;
        console.warn(`  ⚠️  ${project.slug}: ${(error as Error).message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  if (failed > 0) {
    console.warn(`\n${failed} project(s) failed; their cards keep the mockup cover.`);
    process.exitCode = 1;
  }
}

main();
