/**
 * Token Parser
 * Parses design-tokens.tokens.json and resolves all token references
 */

interface Token {
  type: string;
  value: string | number;
  description?: string;
  blendMode?: string;
  extensions?: any;
}

interface TokenMap {
  [path: string]: Token;
}

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

/**
 * Sanitize token name to valid CSS variable name
 * - Replace spaces with hyphens
 * - Replace dots with double hyphens
 * - Convert to lowercase
 * - Remove special characters
 */
export function sanitizeTokenName(path: string): string {
  return path
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '--')
    .replace(/[^a-z0-9\-]/g, '');
}

/**
 * Determine token level from path
 */
function getTokenLevel(path: string): 'global' | 'system' | 'component' {
  if (path.startsWith('global tokens')) return 'global';
  if (path.startsWith('system tokens')) return 'system';
  if (path.startsWith('components tokens')) return 'component';
  return 'global';
}

/**
 * Traverse nested object and build flat token map
 */
export function parseTokens(obj: any, prefix: string = ''): TokenMap {
  const tokenMap: TokenMap = {};

  function traverse(current: any, path: string) {
    if (current && typeof current === 'object') {
      // Check if this is a token (has type and value)
      if (current.type && current.value !== undefined) {
        tokenMap[path] = {
          type: current.type,
          value: current.value,
          description: current.description,
          blendMode: current.blendMode,
          extensions: current.extensions
        };
      } else {
        // Continue traversing
        for (const key in current) {
          if (current.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key;
            traverse(current[key], newPath);
          }
        }
      }
    }
  }

  traverse(obj, prefix);
  return tokenMap;
}

/**
 * Resolve token references recursively
 * Detects {reference} syntax and resolves to final values
 */
export function resolveReferences(tokenMap: TokenMap): ResolvedTokenMap {
  const resolvedMap: ResolvedTokenMap = {};
  const resolving = new Set<string>(); // Track circular references

  function resolve(path: string, depth: number = 0): string {
    // Prevent infinite recursion
    if (depth > 10) {
      console.warn(`Max recursion depth reached for token: ${path}`);
      return '';
    }

    // Check for circular reference
    if (resolving.has(path)) {
      console.warn(`Circular reference detected: ${path}`);
      return '';
    }

    const token = tokenMap[path];
    if (!token) {
      console.warn(`Token not found: ${path}`);
      return '';
    }

    const value = String(token.value);

    // Check if value is a reference (starts with { and ends with })
    if (value.startsWith('{') && value.endsWith('}')) {
      // Extract reference path
      const referencePath = value.slice(1, -1);

      resolving.add(path);
      const resolvedValue = resolve(referencePath, depth + 1);
      resolving.delete(path);

      return resolvedValue;
    }

    // Return the concrete value
    return value;
  }

  // Process all tokens
  for (const path in tokenMap) {
    const token = tokenMap[path];
    const resolvedValue = resolve(path);

    if (resolvedValue) {
      resolvedMap[path] = {
        originalPath: path,
        cssVarName: `--${sanitizeTokenName(path)}`,
        type: token.type,
        resolvedValue: resolvedValue,
        level: getTokenLevel(path)
      };
    }
  }

  return resolvedMap;
}

/**
 * Format value based on type
 * - Strip 'ff' alpha from colors if present
 * - Add 'px' to numeric dimensions
 * - Keep strings as-is
 */
export function formatValue(value: string, type: string, path: string = ''): string {
  // Handle colors - strip 'ff' alpha if present at the end
  if (type === 'color') {
    // Check if it's actually a color (starts with #) or if type is wrong
    if (value.match(/^#[0-9a-fA-F]{6,8}$/)) {
      if (value.match(/^#[0-9a-fA-F]{8}$/)) {
        // 8-character hex color with alpha
        if (value.toLowerCase().endsWith('ff')) {
          return value.slice(0, 7); // Remove 'ff' alpha
        }
      }
      return value;
    }
    // Type is 'color' but value is numeric - likely spacing/sizing mistyped
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue}px`;
    }
    return value;
  }

  // Handle dimensions - add 'px' if it's a number
  if (type === 'dimension' || type === 'sizing' || type === 'spacing' || type === 'borderRadius') {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue}px`;
    }
  }

  // Handle font weights - keep as numbers
  if (type === 'fontWeight' || type === 'fontWeights') {
    return value;
  }

  // Handle line heights - add px if it's a number
  if (type === 'lineHeight' || type === 'lineHeights') {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue}px`;
    }
  }

  // Handle font sizes
  if (type === 'fontSize' || type === 'fontSizes') {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue}px`;
    }
  }

  // Smart detection: if path contains 'spacing', 'sizing', 'radius' and value is numeric, add px
  const pathLower = path.toLowerCase();
  if ((pathLower.includes('spacing') || pathLower.includes('sizing') || pathLower.includes('radius')) &&
      !pathLower.includes('weight')) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue}px`;
    }
  }

  // Return as-is for everything else
  return value;
}
