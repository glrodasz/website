import { describe, expect, it } from 'vitest';
import { fittedFontSize } from './useMatchWidth';

describe('fittedFontSize', () => {
  it('scales the glyph width to the target, keeping letter-spacing fixed', () => {
    // 10 chars at 2px tracking: 20px tracking + 80px glyphs = 100px wide.
    // Reaching 140px needs 120px of glyphs, so 1.5x the font size.
    expect(fittedFontSize(16, 100, 140, 2, 10)).toBe(24);
  });

  it('scales proportionally without letter-spacing', () => {
    expect(fittedFontSize(20, 200, 100, 0, 12)).toBe(10);
  });

  it('keeps the font size when tracking alone exceeds the target', () => {
    expect(fittedFontSize(16, 100, 15, 2, 10)).toBe(16);
  });
});
