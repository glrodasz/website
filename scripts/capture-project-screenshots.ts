/**
 * Build Script: Capture screenshots of the Fun Projects
 * Output: src/assets/projects/{slug}.webp
 *
 * Run: npm run build:screenshots            (skips projects that already have one)
 *      npm run build:screenshots -- --force (re-captures everything)
 *      npm run build:screenshots -- walleto html-colors   (only these slugs, always re-captured)
 *
 * Projects behind a login: run once with `--login <slug>`. Your regular Google Chrome
 * opens on the project with a separate profile; sign in, then press Enter in the terminal.
 * The session is saved to `.auth/{slug}.json` (gitignored) and reused by every later
 * capture of that project.
 *
 *      npm run build:screenshots -- --login walleto
 *      npm run build:screenshots -- walleto
 *
 * Needs network access to every project URL and a Playwright Chromium
 * (`npx playwright install chromium`, or point CHROMIUM_PATH at an existing binary).
 */

import { spawn } from 'child_process';
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
const NETWORK_IDLE_MAX_MS = 10_000;
const CDP_PORT = 9333;

const OUT_DIR = path.resolve(import.meta.dirname, '../src/assets/projects');
const AUTH_DIR = path.resolve(import.meta.dirname, '../.auth');

const authStatePath = (slug: string) => path.join(AUTH_DIR, `${slug}.json`);
const captureUrl = (project: FunProject) => project.screenshotUrl ?? project.url;

function launch(): Promise<Browser> {
  return chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
}

/** Locates the user's regular Google Chrome. Override with CHROME_PATH. */
function findChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  const found = candidates.find((c): c is string => Boolean(c) && fs.existsSync(c!));
  if (!found) throw new Error('Google Chrome not found. Set CHROME_PATH to its executable.');
  return found;
}

/**
 * Opens a plain Chrome window — not driven by Playwright — so Google and other
 * identity providers don't reject the sign-in as an automated browser. Once the
 * user is signed in, Playwright attaches over CDP only to read the cookies.
 */
async function login(slug: string): Promise<void> {
  const project = FUN_PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  const chrome = spawn(
    findChrome(),
    [
      // A dedicated profile: Chrome refuses remote debugging on the default one,
      // and keeping it lets the next --login reuse the identity-provider session.
      `--user-data-dir=${path.join(AUTH_DIR, 'chrome-profile')}`,
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run',
      '--no-default-browser-check',
      captureUrl(project),
    ],
    { stdio: 'ignore' },
  );

  try {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await rl.question(`Sign in to ${project.name} in the Chrome window, then press Enter here… `);
    rl.close();

    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
    await browser.contexts()[0].storageState({ path: authStatePath(slug) });
    await browser.close();
    console.log(`  🔐 Saved session to .auth/${slug}.json`);
  } finally {
    chrome.kill();
  }
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
        await page.goto(target, { waitUntil: 'load', timeout: NAVIGATION_TIMEOUT_MS });
        // Apps with live connections (Firestore listeners, websockets) never go
        // network-idle, so give data time to arrive but don't wait forever.
        await page.waitForLoadState('networkidle', { timeout: NETWORK_IDLE_MAX_MS }).catch(() => {});
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
