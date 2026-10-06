/**
 * Plain helpers for the playground shell (sidebar, toolbar, addons panel),
 * kept out of the component files so those export components only.
 */

import type { TokenGraph } from '../../../tokens/graph-builder';
import { displayComponentName } from '../utils';

export type PanelTab = 'inspector' | 'usage';

export interface PanelPrefs {
  open: boolean;
  height: number;
  tab: PanelTab;
}

/** Docked panel height bounds, in px. The canvas always keeps PANEL_CANVAS_MIN above it. */
export const PANEL_MIN = 140;
export const PANEL_DEFAULT = 280;
export const PANEL_CANVAS_MIN = 160;
/** Keyboard resize steps on the panel's handle. */
export const PANEL_STEP = 16;
export const PANEL_STEP_LARGE = 64;

const PANEL_KEY = 'tokens-playground:panel';
const DEFAULT_PREFS: PanelPrefs = { open: true, height: PANEL_DEFAULT, tab: 'inspector' };

/**
 * The panel's remembered state. Storage can be missing or throw (private
 * windows, blocked site data), and its contents can be anything; both fall
 * back to the defaults.
 */
export function readPanelPrefs(): PanelPrefs {
  try {
    const raw = window.localStorage.getItem(PANEL_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFS;
    const { open, height, tab } = parsed as Record<string, unknown>;
    return {
      open: typeof open === 'boolean' ? open : DEFAULT_PREFS.open,
      height:
        typeof height === 'number' && Number.isFinite(height)
          ? Math.max(PANEL_MIN, Math.round(height))
          : DEFAULT_PREFS.height,
      tab: tab === 'usage' || tab === 'inspector' ? tab : DEFAULT_PREFS.tab,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePanelPrefs(prefs: PanelPrefs): void {
  try {
    window.localStorage.setItem(PANEL_KEY, JSON.stringify(prefs));
  } catch {
    // Unavailable storage only costs the preference.
  }
}

/** Largest panel height that still leaves the canvas usable in a column `available` px tall. */
export function maxPanelHeight(available: number): number {
  return Math.max(PANEL_MIN, available - PANEL_CANVAS_MIN);
}

export function clampPanelHeight(height: number, available: number): number {
  return Math.round(Math.min(maxPanelHeight(available), Math.max(PANEL_MIN, height)));
}

/** Component namespaces in the order people look for them: by display name. */
export function sortedComponentNames(graph: TokenGraph): string[] {
  return [...graph.componentNames].sort((a, b) =>
    displayComponentName(a).localeCompare(displayComponentName(b)),
  );
}

export function componentTokenCounts(graph: TokenGraph): Map<string, number> {
  const counts = new Map<string, number>();
  for (const node of graph.nodes) {
    if (node.level === 'component' && node.componentName) {
      counts.set(node.componentName, (counts.get(node.componentName) ?? 0) + 1);
    }
  }
  return counts;
}

/** True when the element takes typed text, so single-key shortcuts must leave it alone. */
export function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  if (!(target instanceof HTMLInputElement)) return false;
  return !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'color'].includes(target.type);
}
