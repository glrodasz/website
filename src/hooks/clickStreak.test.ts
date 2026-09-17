import { describe, expect, it } from 'vitest';
import { advanceStreak, CLICK_STREAK_WINDOW_MS } from './clickStreak';

const W = CLICK_STREAK_WINDOW_MS;

describe('advanceStreak', () => {
  it('starts at 1 when there is no previous click', () => {
    expect(advanceStreak(0, null, 1000)).toBe(1);
  });

  it('extends the streak for a click inside the window', () => {
    expect(advanceStreak(1, 1000, 1000 + W - 1)).toBe(2);
    expect(advanceStreak(2, 1000, 1000 + 10)).toBe(3);
  });

  it('extends on a click exactly on the window boundary', () => {
    expect(advanceStreak(1, 1000, 1000 + W)).toBe(2);
  });

  it('restarts when the gap exceeds the window', () => {
    expect(advanceStreak(2, 1000, 1000 + W + 1)).toBe(1);
  });

  it('restarts after a long pause, however high the previous count', () => {
    expect(advanceStreak(9, 1000, 60_000)).toBe(1);
  });

  it('reaches three across three clicks inside the window', () => {
    let count = 0;
    let last: number | null = null;
    for (const t of [0, 200, 400]) {
      count = advanceStreak(count, last, t);
      last = t;
    }
    expect(count).toBe(3);
  });

  it('never reaches three when one gap is too long', () => {
    let count = 0;
    let last: number | null = null;
    for (const t of [0, 200, 200 + W + 1]) {
      count = advanceStreak(count, last, t);
      last = t;
    }
    expect(count).toBe(1);
  });
});
