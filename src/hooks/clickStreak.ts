/**
 * Click-streak counting, kept free of React and the DOM so it can be tested
 * directly in the node-environment `unit` project.
 */

/**
 * Clicks further apart than this start a new streak rather than extending one.
 *
 * Deliberately roomier than the ~500ms double-click convention: the first click
 * on the logo also navigates home, and that transition eats into the gap before
 * the second click lands.
 */
export const CLICK_STREAK_WINDOW_MS = 800;

/**
 * The streak length after a click at `now`.
 *
 * A click extends the previous streak only when it lands within `windowMs` of
 * the one before it; otherwise it starts a fresh streak at 1.
 */
export function advanceStreak(
  previousCount: number,
  lastClickAt: number | null,
  now: number,
  windowMs: number = CLICK_STREAK_WINDOW_MS,
): number {
  if (lastClickAt === null) return 1;
  if (now - lastClickAt > windowMs) return 1;
  return previousCount + 1;
}
