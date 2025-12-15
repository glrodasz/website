import designTokens from '../../design-tokens.tokens.json';

export interface DesignToken {
  type: string;
  value: string;
  blendMode?: string;
  extensions?: Record<string, unknown>;
}

export interface TokenCollection {
  [key: string]: DesignToken | TokenCollection;
}

/**
 * Get a token value by path
 * @param path - Dot-separated path to the token (e.g., 'global tokens.colors.schemas.frozen ribon.blue ribon.400')
 * @returns The token value or undefined if not found
 */
export function getToken(path: string): string | undefined {
  const keys = path.split('.');
  let current: any = designTokens;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current?.value || current;
}

/**
 * Get a color token value
 * @param path - Path within the colors object
 * @returns The color value
 */
export function getColor(path: string): string {
  return getToken(`global tokens.colors.${path}`) || '#000000';
}

/**
 * CSS custom properties generator
 * Creates CSS variables from design tokens
 */
export function generateCSSVariables(tokens: TokenCollection, prefix = ''): Record<string, string> {
  const variables: Record<string, string> = {};

  function traverse(obj: TokenCollection, path: string) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}-${key.replace(/\s+/g, '-')}` : key.replace(/\s+/g, '-');

      if (value && typeof value === 'object' && 'value' in value) {
        variables[`--${currentPath}`] = (value as DesignToken).value;
      } else if (value && typeof value === 'object') {
        traverse(value as TokenCollection, currentPath);
      }
    }
  }

  traverse(tokens, prefix);
  return variables;
}

/**
 * Export all tokens for direct access
 */
export const tokens = designTokens;

/**
 * Export typed token access
 */
export default {
  getToken,
  getColor,
  generateCSSVariables,
  tokens,
};
