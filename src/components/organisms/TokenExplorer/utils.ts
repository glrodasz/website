/**
 * Shared helpers for the token explorer views.
 */

import type { GraphNode, ThemeMode } from '../../../tokens/graph-builder';

export const HEX_RE = /^#[0-9a-fA-F]{6,8}$/;

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
