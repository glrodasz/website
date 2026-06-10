import { HEX_RE } from './utils';

export function TokenSwatch({ value, size }: { value: string; size?: 'sm' | 'md' }) {
  if (!HEX_RE.test(value)) return null;
  return (
    <span
      className={`token-swatch${size === 'md' ? ' token-swatch--md' : ''}`}
      style={{ background: value.slice(0, 7) }}
    />
  );
}
