/**
 * CSS Variable Generator
 * Generates CSS file from resolved tokens
 */

import { formatValue } from './parser';

interface ResolvedToken {
  originalPath: string;
  cssVarName: string;
  type: string;
  resolvedValue: string;
  level: 'global' | 'system' | 'component';
}

interface ResolvedTokenMap {
  [path: string]: ResolvedToken;
}

interface GroupedTokens {
  global: ResolvedToken[];
  system: ResolvedToken[];
  component: ResolvedToken[];
}

/**
 * Group tokens by level
 */
function groupTokensByLevel(tokens: ResolvedTokenMap): GroupedTokens {
  const grouped: GroupedTokens = {
    global: [],
    system: [],
    component: []
  };

  for (const path in tokens) {
    const token = tokens[path];
    grouped[token.level].push(token);
  }

  return grouped;
}

/**
 * Get category from token path
 */
function getCategory(path: string): string {
  const parts = path.split('.');

  // For global tokens: global tokens.colors, global tokens.sizing, etc.
  if (path.startsWith('global tokens')) {
    return parts[1] || 'other';
  }

  // For system tokens: system tokens.colors, system tokens.sizing, etc.
  if (path.startsWith('system tokens')) {
    return parts[1] || 'other';
  }

  // For component tokens: components tokens.button, components tokens.typography, etc.
  if (path.startsWith('components tokens')) {
    return parts[1] || 'other';
  }

  return 'other';
}

/**
 * Group tokens by category within a level
 */
function groupByCategory(tokens: ResolvedToken[]): Map<string, ResolvedToken[]> {
  const categoryMap = new Map<string, ResolvedToken[]>();

  for (const token of tokens) {
    const category = getCategory(token.originalPath);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(token);
  }

  return categoryMap;
}

/**
 * Generate CSS variable declaration
 */
function generateCSSVariable(token: ResolvedToken): string {
  const formattedValue = formatValue(token.resolvedValue, token.type, token.originalPath);
  return `  ${token.cssVarName}: ${formattedValue};`;
}

/**
 * Generate section header
 */
function generateSectionHeader(title: string): string {
  const border = '='.repeat(60);
  return `\n  /* ${border} */\n  /*  ${title.toUpperCase().padEnd(56)} */\n  /* ${border} */\n`;
}

/**
 * Generate category comment
 */
function generateCategoryComment(category: string): string {
  return `\n  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */`;
}

/**
 * Generate CSS variables from resolved tokens
 */
export function generateCSSVariables(resolvedTokens: ResolvedTokenMap): string {
  const grouped = groupTokensByLevel(resolvedTokens);
  let css = ':root {\n';

  // Generate Global Tokens
  if (grouped.global.length > 0) {
    css += generateSectionHeader('GLOBAL TOKENS');
    const globalByCategory = groupByCategory(grouped.global);

    for (const [category, tokens] of globalByCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => {
        css += '\n' + generateCSSVariable(token);
      });
      css += '\n';
    }
  }

  // Generate System Tokens
  if (grouped.system.length > 0) {
    css += generateSectionHeader('SYSTEM TOKENS');
    const systemByCategory = groupByCategory(grouped.system);

    for (const [category, tokens] of systemByCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => {
        css += '\n' + generateCSSVariable(token);
      });
      css += '\n';
    }
  }

  // Generate Component Tokens
  if (grouped.component.length > 0) {
    css += generateSectionHeader('COMPONENT TOKENS');
    const componentByCategory = groupByCategory(grouped.component);

    for (const [category, tokens] of componentByCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => {
        css += '\n' + generateCSSVariable(token);
      });
      css += '\n';
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate CSS variables for a theme block (used in themed output)
 */
function generateThemeBlock(selector: string, tokens: ResolvedToken[]): string {
  let css = `\n${selector} {\n`;
  const byCategory = groupByCategory(tokens);
  for (const [category, catTokens] of byCategory) {
    css += generateCategoryComment(category);
    catTokens.forEach(token => {
      css += '\n' + generateCSSVariable(token);
    });
    css += '\n';
  }
  css += '}\n';
  return css;
}

/**
 * Generate themed CSS variables — system color tokens go into [data-theme] blocks,
 * everything else (global, non-color system, component) goes into :root.
 */
export function generateThemedCSSVariables(
  resolvedTokens: ResolvedTokenMap,
  resolvedDarkSystemTokens: ResolvedTokenMap
): string {
  const grouped = groupTokensByLevel(resolvedTokens);

  const systemColorTokens = grouped.system.filter(t => t.type === 'color');
  const systemNonColorTokens = grouped.system.filter(t => t.type !== 'color');

  const darkSystemColorTokens = Object.values(resolvedDarkSystemTokens).filter(
    t => t.level === 'system' && t.type === 'color'
  );

  let css = ':root {\n';

  // Global tokens
  if (grouped.global.length > 0) {
    css += generateSectionHeader('GLOBAL TOKENS');
    const globalByCategory = groupByCategory(grouped.global);
    for (const [category, tokens] of globalByCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => { css += '\n' + generateCSSVariable(token); });
      css += '\n';
    }
  }

  // Non-color system tokens (sizing, spacing, typography, etc.)
  if (systemNonColorTokens.length > 0) {
    css += generateSectionHeader('SYSTEM TOKENS (non-color)');
    const byCategory = groupByCategory(systemNonColorTokens);
    for (const [category, tokens] of byCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => { css += '\n' + generateCSSVariable(token); });
      css += '\n';
    }
  }

  // Component tokens
  if (grouped.component.length > 0) {
    css += generateSectionHeader('COMPONENT TOKENS');
    const componentByCategory = groupByCategory(grouped.component);
    for (const [category, tokens] of componentByCategory) {
      css += generateCategoryComment(category);
      tokens.forEach(token => { css += '\n' + generateCSSVariable(token); });
      css += '\n';
    }
  }

  css += '}\n';

  // [data-theme="light"] — light system color tokens
  if (systemColorTokens.length > 0) {
    css += generateThemeBlock('[data-theme="light"]', systemColorTokens);
  }

  // [data-theme="dark"] — dark system color tokens
  if (darkSystemColorTokens.length > 0) {
    css += generateThemeBlock('[data-theme="dark"]', darkSystemColorTokens);
  }

  return css;
}

/**
 * Generate statistics about the tokens
 */
export function generateStats(resolvedTokens: ResolvedTokenMap): {
  total: number;
  global: number;
  system: number;
  component: number;
} {
  const grouped = groupTokensByLevel(resolvedTokens);

  return {
    total: Object.keys(resolvedTokens).length,
    global: grouped.global.length,
    system: grouped.system.length,
    component: grouped.component.length
  };
}
