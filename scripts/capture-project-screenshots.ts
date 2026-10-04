/**
 * Build Script: Capture screenshots of the Fun Projects
 * Output: src/assets/projects/{slug}.webp
 *
 * Run: npm run build:screenshots            (skips projects that already have one)
 *      npm run build:screenshots -- --force (re-captures everything)
 *      npm run build:screenshots -- walleto html-colors   (only these slugs, always re-captured)
 *
 * Projects behind a login: run once with `--login <slug>`. A browser window opens
 * on the project; sign in, then press Enter in the terminal. The session is saved to
 * `.auth/{slug}.json` (gitignored) and reused by every later capture of that project.
 *
 *      npm run build:screenshots -- --login walleto
 *      npm run build:screenshots -- walleto
 *
 * Needs network access to every project URL and a Playwright Chromium
 * (`npx playwright install chromium`, or point CHROMIUM_PATH at an existing binary).
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { chromium, type Browser } from 'playwright';
import sharp from 'sharp';
import { FUN_PROJECTS, type FunProject } from '../src/data/funProjects';

const VIEWPORT = { width: 1280, height: 800 };
const OUTPUT_WIDTH = 960;
const SETTLE_MS = 1500;
const NAVIGATION_TIMEOUT_MS = 30_000;

const OUT_DIR = path.resolve(import.meta.dirname, '../src/assets/projects');
const AUTH_DIR = path.resolve(import.meta.dirname, '../.auth');

const authStatePath = (slug: string) => path.join(AUTH_DIR, `${slug}.json`);
const captureUrl = (project: FunProject) => project.screenshotUrl ?? project.url;

function launch(headless = true): Promise<Browser> {
  return chromium.launch({ headless, executablePath: process.env.CHROMIUM_PATH || undefined });
}

async function login(slug: string): Promise<void> {
  const project = FUN_PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);

  const browser = await launch(false);
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  await page.goto(captureUrl(project));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await rl.question(`Sign in to ${project.name} in the browser window, then press Enter here… `);
  rl.close();

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  await context.storageState({ path: authStatePath(slug) });
  await browser.close();
  console.log(`  🔐 Saved session to .auth/${slug}.json`);
}

async function capture(args: string[]): Promise<void> {
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('--'));

  const projects = FUN_PROJECTS.filter((p) => p.capturable !== false).filter(
    (p) => only.length === 0 || only.includes(p.slug),
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await launch();

  let failed = 0;
  try {
    for (const project of projects) {
      const outPath = path.join(OUT_DIR, `${project.slug}.webp`);
      if (fs.existsSync(outPath) && !force && only.length === 0) {
        console.log(`  ⏭  Skipped (exists): ${project.slug}.webp`);
        continue;
      }

      const statePath = authStatePath(project.slug);
      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
        storageState: fs.existsSync(statePath) ? statePath : undefined,
      });
      const page = await context.newPage();
      const target = captureUrl(project);
      try {
        await page.goto(target, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT_MS });
        await page.waitForTimeout(SETTLE_MS);

        if (new URL(page.url()).hostname !== new URL(target).hostname) {
          throw new Error(
            `redirected to ${page.url()} — log in first: npm run build:screenshots -- --login ${project.slug}`,
          );
        }

        const png = await page.screenshot({ type: 'png' });
        await sharp(png).resize({ width: OUTPUT_WIDTH }).webp({ quality: 80 }).toFile(outPath);
        console.log(`  ✅ ${project.slug}.webp ← ${target}`);
      } catch (error) {
        failed++;
        console.warn(`  ⚠️  ${project.slug}: ${(error as Error).message.split('\n')[0]}`);
      } finally {
        await context.close();
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const loginIndex = args.indexOf('--login');
  if (loginIndex !== -1) {
    const slug = args[loginIndex + 1];
    if (!slug) throw new Error('Usage: npm run build:screenshots -- --login <slug>');
    await login(slug);
    return;
  }
  await capture(args);
}

main();
