/**
 * Token Parser
 * Parses slim W3C DTCG design tokens from JSON files and resolves all token references.
 *
 * References use the standard DTCG syntax with a level prefix:
 *   {global.Colors.Custom.Principal palette.600}
 *   {system.Colors.Complementary.principal}
 *   {components.button.background-color.primary.default}
 * Path segments after the prefix are the exact JSON keys of the target token.
 */

export interface ParsedToken {
  type: string;
  value: string | number;
  level: 'global' | 'system' | 'component';
  isReference: boolean;
  referencePath?: string;
}

export interface TokenMap {
  [path: string]: ParsedToken;
}

export interface ResolvedToken {
  originalPath: string;
  cssVarName: string;
  type: string;
  resolvedValue: string;
  level: 'global' | 'system' | 'component';
  aliasTarget?: string;
}

export interface ResolvedTokenMap {
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

const REFERENCE_PATTERN = /^\{(.+)\}$/;

/**
 * Traverse nested object and build flat token map
 * Supports slim W3C DTCG format
 */
export function parseTokens(
  obj: any,
  prefix: string = '',
  level: 'global' | 'system' | 'component' = 'global'
): TokenMap {
  const tokenMap: TokenMap = {};

  function traverse(current: any, path: string) {
    if (current && typeof current === 'object') {
      // Check for W3C DTCG token (has $type and $value)
      if (current.$type && current.$value !== undefined) {
        let isReference = false;
        let referencePath: string | undefined;

        if (typeof current.$value === 'string') {
          const match = current.$value.match(REFERENCE_PATTERN);
          if (match) {
            isReference = true;
            referencePath = match[1];
          }
        }

        tokenMap[path] = {
          type: current.$type,
          value: current.$value,
          level: level,
          isReference: isReference,
          referencePath: referencePath
        };
      }
      // Continue traversing nested groups
      else {
        const keys = Object.keys(current).filter(k => !k.startsWith('$'));
        for (const key of keys) {
          const newPath = path ? `${path}.${key}` : key;
          traverse(current[key], newPath);
        }
      }
    }
  }

  // Start traversal - if prefix is provided, create the initial path structure
  if (prefix) {
    traverse(obj, prefix);
  } else {
    traverse(obj, '');
  }

  return tokenMap;
}

/** Maps reference level prefixes to the internal token-map path prefixes */
const LEVEL_PREFIXES: Record<string, string> = {
  global: 'global tokens',
  system: 'system tokens',
  components: 'components tokens',
};

/**
 * Find the target token-map path for a {level.path.to.token} reference.
 * Exact match only — segments after the level prefix are the JSON keys of the target.
 */
export function findReferencedPath(
  referencePath: string,
  tokenMap: TokenMap
): string | undefined {
  const dotIndex = referencePath.indexOf('.');
  if (dotIndex === -1) return undefined;

  const levelPrefix = LEVEL_PREFIXES[referencePath.slice(0, dotIndex)];
  if (!levelPrefix) return undefined;

  const targetPath = `${levelPrefix}.${referencePath.slice(dotIndex + 1)}`;
  return targetPath in tokenMap ? targetPath : undefined;
}

/**
 * Generate CSS variable name from path
 */
function generateCssVarName(path: string): string {
  return '--' + sanitizeTokenName(path);
}

/**
 * Resolve token references
 */
export function resolveReferences(tokenMap: TokenMap): ResolvedTokenMap {
  const resolvedMap: ResolvedTokenMap = {};

  // First pass: Resolve all concrete values (non-references)
  for (const path in tokenMap) {
    const token = tokenMap[path];

    if (!token.isReference) {
      resolvedMap[path] = {
        originalPath: path,
        cssVarName: generateCssVarName(path),
        type: token.type,
        resolvedValue: String(token.value),
        level: token.level
      };
    }
  }

  // Second pass: Resolve references
  for (const path in tokenMap) {
    const token = tokenMap[path];

    if (token.isReference && token.referencePath) {
      const targetPath = findReferencedPath(token.referencePath, tokenMap);

      if (targetPath && resolvedMap[targetPath]) {
        resolvedMap[path] = {
          originalPath: path,
          cssVarName: generateCssVarName(path),
          type: token.type,
          resolvedValue: resolvedMap[targetPath].resolvedValue,
          level: token.level,
          aliasTarget: (token.level === 'component' && resolvedMap[targetPath].level === 'system')
            ? resolvedMap[targetPath].cssVarName
            : undefined
        };
      } else {
        console.warn(`⚠️  Could not resolve reference: ${path} -> ${token.referencePath}`);
        // Fallback: emit the unresolved reference string as-is
        resolvedMap[path] = {
          originalPath: path,
          cssVarName: generateCssVarName(path),
          type: token.type,
          resolvedValue: String(token.value),
          level: token.level
        };
      }
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

  // Handle generic 'number' type - use path-based detection
  if (type === 'number') {
    const pathLower = path.toLowerCase();
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      // Add px for size-related tokens
      if (pathLower.includes('font-size') ||
          pathLower.includes('fontsize') ||
          pathLower.includes('line-height') ||
          pathLower.includes('lineheight') ||
          pathLower.includes('spacing') ||
          pathLower.includes('sizing') ||
          pathLower.includes('radius') ||
          pathLower.includes('width') ||
          pathLower.includes('height') ||
          pathLower.includes('offset')) {
        return `${numValue}px`;
      }
      // Keep as number for weights, opacity, etc.
      return value;
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
