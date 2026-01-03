/**
 * Token Parser
 * Parses W3C DTCG design tokens from JSON files and resolves all token references
 */

// W3C DTCG format - Color value structure from Figma export
// Used for type documentation when extracting hex values
// @ts-expect-error - Interface kept for documentation purposes
interface ColorValue {
  colorSpace: string;
  components: number[];
  alpha: number;
  hex: string;
}

interface ParsedToken {
  type: string;
  value: string | number;
  extensions?: any;
  level: 'global' | 'system' | 'component';
  isReference: boolean;
  referencePath?: string;
}

interface TokenMap {
  [path: string]: ParsedToken;
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
 * Traverse nested object and build flat token map
 * Supports W3C DTCG format
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
        let resolvedValue = current.$value;
        let isReference = false;
        let referencePath: string | undefined;

        // Check if this is a reference via aliasData
        const aliasData = current.$extensions?.['com.figma.aliasData'];
        if (aliasData?.targetVariableName) {
          isReference = true;
          referencePath = aliasData.targetVariableName;
        }

        // Extract actual value from complex objects
        if (current.$type === 'color' && typeof resolvedValue === 'object') {
          // Use hex value from color object
          const hex = resolvedValue.hex || '#000000';
          const alpha = resolvedValue.alpha;

          // If alpha is less than 1, append alpha channel to hex
          if (alpha !== undefined && alpha < 1) {
            // Convert alpha (0-1) to hex (00-FF)
            const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
            resolvedValue = hex + alphaHex;
          } else {
            resolvedValue = hex;
          }
        }

        tokenMap[path] = {
          type: current.$type,
          value: resolvedValue,
          extensions: current.$extensions,
          level: level,
          isReference: isReference,
          referencePath: referencePath
        };
      }
      // Continue traversing (including mode definition containers)
      else {
        const keys = Object.keys(current).filter(k => k !== '$extensions');
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

/**
 * Build a mapping of Figma variable names to internal paths
 * for resolving aliasData references
 */
function buildNameToPathMap(tokenMap: TokenMap): Map<string, string> {
  const nameToPath = new Map<string, string>();

  for (const path in tokenMap) {
    const token = tokenMap[path];

    // Only map concrete values (not references)
    if (!token.isReference) {
      // Extract the path without level prefix
      const pathParts = path.split('.');
      if (pathParts.length >= 2) {
        const levelPrefix = pathParts[0]; // "global tokens", "system tokens", "components tokens"
        const relativePath = pathParts.slice(1).join('/');

        // Map both with and without level for flexibility
        nameToPath.set(relativePath, path);
        nameToPath.set(`${levelPrefix}/${relativePath}`, path);

        // Also map with dots instead of slashes
        const dotPath = pathParts.slice(1).join('.');
        nameToPath.set(dotPath, path);
      }
    }
  }

  return nameToPath;
}

/**
 * Find the target path for a Figma reference
 * Tries multiple strategies to locate the referenced token
 */
function findReferencedPath(
  referencePath: string,
  nameToPath: Map<string, string>,
  resolvedMap: ResolvedTokenMap
): string | undefined {
  // Strategy 1: Direct match
  let targetPath = nameToPath.get(referencePath);
  if (targetPath) return targetPath;

  // Strategy 2: Try with different level prefixes
  for (const level of ['global tokens', 'system tokens', 'components tokens']) {
    const prefixedPath = `${level}/${referencePath}`;
    targetPath = nameToPath.get(prefixedPath);
    if (targetPath) return targetPath;
  }

  // Strategy 3: Try converting slashes to dots and searching
  const dotPath = referencePath.replace(/\//g, '.');
  for (const candidatePath in resolvedMap) {
    if (candidatePath.endsWith(`.${dotPath}`) || candidatePath.endsWith(dotPath)) {
      return candidatePath;
    }
  }

  return undefined;
}

/**
 * Generate CSS variable name from path
 */
function generateCssVarName(path: string): string {
  return '--' + sanitizeTokenName(path);
}

/**
 * Resolve token references using W3C DTCG aliasData
 */
export function resolveReferences(tokenMap: TokenMap): ResolvedTokenMap {
  const resolvedMap: ResolvedTokenMap = {};
  const nameToPath = buildNameToPathMap(tokenMap);

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

  // Second pass: Resolve references via aliasData
  for (const path in tokenMap) {
    const token = tokenMap[path];

    if (token.isReference && token.referencePath) {
      const targetPath = findReferencedPath(token.referencePath, nameToPath, resolvedMap);

      if (targetPath && resolvedMap[targetPath]) {
        resolvedMap[path] = {
          originalPath: path,
          cssVarName: generateCssVarName(path),
          type: token.type,
          resolvedValue: resolvedMap[targetPath].resolvedValue,
          level: token.level
        };
      } else {
        console.warn(`⚠️  Could not resolve reference: ${path} -> ${token.referencePath}`);
        // Fallback: use the current value as-is
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
          pathLower.includes('height')) {
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
