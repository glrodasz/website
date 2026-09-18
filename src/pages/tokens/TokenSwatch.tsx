import { HEX_RE } from './utils';

/**
 * Colour swatch for a resolved hex value. 8-digit hex (with alpha) is drawn
 * as-is over a checkerboard so translucent tokens read as translucent.
 */
export function TokenSwatch({ value, size }: { value: string; size?: 'sm' | 'md' }) {
  if (!HEX_RE.test(value)) return null;
  const hasAlpha = value.length === 9 && !value.toLowerCase().endsWith('ff');
  const classNames = [
    'token-swatch',
    size === 'md' && 'token-swatch--md',
    hasAlpha && 'token-swatch--alpha',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classNames} aria-hidden="true">
      <span className="token-swatch__fill" style={{ background: value }} />
    </span>
  );
}
