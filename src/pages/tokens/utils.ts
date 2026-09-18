/**
 * Shared helpers for the token explorer views.
 */

import type { GraphNode, ThemeMode } from '../../tokens/graph-builder';

export type ExplorerTab = 'components' | 'system' | 'global' | 'audit';

const EXPLORER_TABS: readonly string[] = ['components', 'system', 'global', 'audit'];

export function isExplorerTab(value: string | null): value is ExplorerTab {
  return value !== null && EXPLORER_TABS.includes(value);
}

/** 6- or 8-digit hex colour (8 = with alpha). */
export const HEX_RE = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Resolved value under the active preview theme. */
export function themedValueOf(node: GraphNode, theme: ThemeMode): string {
  return theme === 'dark' && node.resolvedValueDark !== undefined
    ? node.resolvedValueDark
    : node.resolvedValue;
}

/** Case-insensitive substring match against a node's path. */
export function matchesSearch(node: GraphNode, query: string): boolean {
  if (!query) return true;
  return node.path.toLowerCase().includes(query);
}

/**
 * Display name for a component-token namespace: the React component that
 * consumes it where one exists, otherwise the namespace in PascalCase.
 */
const COMPONENT_DISPLAY_NAMES: Record<string, string> = {
  'nav-bar': 'Navigation',
  'input-field': 'InputText',
};

export function displayComponentName(name: string): string {
  const mapped = COMPONENT_DISPLAY_NAMES[name];
  if (mapped) return mapped;
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Maps a component token to the global/system category it belongs to, so the
 * sidebar Categories filter can apply to the Components tab too. Returns null
 * when no category clearly applies (such tokens are never filtered out).
 */
export function categoryOfComponentToken(node: GraphNode): string | null {
  if (node.type === 'color') return 'Colors';
  const property = (node.path.split('.')[2] ?? '').toLowerCase();
  if (property.includes('spacing')) return 'Spacing';
  if (property.includes('radius')) return 'Border radius';
  if (property.includes('sizing')) return 'Sizing';
  if (property.includes('typography') || property.includes('font')) return 'Typography';
  return null;
}
