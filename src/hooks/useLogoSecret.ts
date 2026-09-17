import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { advanceStreak, CLICK_STREAK_WINDOW_MS } from './clickStreak';

/** Clicks in one streak that open the component library. */
const CLICKS_TO_COMPONENTS = 3;
/** How long the logo must be held to open the token explorer. */
const LONG_PRESS_MS = 700;

/**
 * Storybook is a separate static build that Vercel serves by rewrite, not a
 * router route, so it needs a real page load. The trailing slash skips the
 * `/components` → `/components/` redirect, and the locale middleware ignores
 * `components/` so this is never bounced to `/es/`.
 */
const COMPONENTS_URL = '/components/';
/** A real (lazy) router route, so this one navigates client-side. */
const TOKENS_PATH = '/tokens';

export interface LogoSecretHandlers {
  onClick: (event: React.MouseEvent) => void;
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

export interface LogoSecret {
  /**
   * Clicks counted so far in the current streak, for the nudge that hints
   * something is being counted. Only ever 0-2: the click that completes the
   * streak navigates instead of rendering.
   */
  streak: number;
  /** Spread onto every element that should respond to the gestures. */
  handlers: LogoSecretHandlers;
}

/**
 * Two hidden ways into the developer pages, both on the site logo.
 *
 * Three quick clicks open the component library, and the third click fires
 * immediately — the first two are left alone so the logo keeps working as the
 * ordinary "back to home" link. Holding the logo opens the token explorer,
 * which works with a thumb as well as a mouse.
 */
export function useLogoSecret(): LogoSecret {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);

  // Mirrored in a ref so the click handler never reads a stale count.
  const streakRef = useRef(0);
  const lastClickAt = useRef<number | null>(null);
  const streakResetTimer = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const pressing = useRef(false);
  /** Set when a hold fired, so the click that follows the release is ignored. */
  const longPressFired = useRef(false);

  const clearStreakResetTimer = () => {
    if (streakResetTimer.current !== null) {
      window.clearTimeout(streakResetTimer.current);
      streakResetTimer.current = null;
    }
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const resetStreak = useCallback(() => {
    clearStreakResetTimer();
    streakRef.current = 0;
    lastClickAt.current = null;
    setStreak(0);
  }, []);

  useEffect(() => () => {
    clearStreakResetTimer();
    clearLongPressTimer();
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      // The release after a hold also fires a click; swallow it so the logo
      // does not navigate home on top of the page the hold just opened.
      if (longPressFired.current) {
        longPressFired.current = false;
        event.preventDefault();
        return;
      }

      const now = Date.now();
      const next = advanceStreak(streakRef.current, lastClickAt.current, now);
      lastClickAt.current = now;

      if (next >= CLICKS_TO_COMPONENTS) {
        event.preventDefault();
        resetStreak();
        window.location.assign(COMPONENTS_URL);
        return;
      }

      // Clicks 1 and 2 fall through to the link, so going home stays instant.
      streakRef.current = next;
      setStreak(next);
      clearStreakResetTimer();
      streakResetTimer.current = window.setTimeout(resetStreak, CLICK_STREAK_WINDOW_MS);
    },
    [resetStreak],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.button !== 0) return; // primary button / touch only
      pressing.current = true;
      longPressFired.current = false;
      clearLongPressTimer();
      longPressTimer.current = window.setTimeout(() => {
        longPressFired.current = true;
        pressing.current = false;
        resetStreak();
        navigate(TOKENS_PATH);
      }, LONG_PRESS_MS);
    },
    [navigate, resetStreak],
  );

  const endPress = useCallback(() => {
    pressing.current = false;
    clearLongPressTimer();
  }, []);

  const onContextMenu = useCallback((event: React.MouseEvent) => {
    // Android raises the context menu mid-hold, which would cancel the gesture.
    // Only suppressed while holding, so right-click still works normally.
    if (pressing.current) event.preventDefault();
  }, []);

  return {
    streak,
    handlers: {
      onClick,
      onPointerDown,
      onPointerUp: endPress,
      onPointerLeave: endPress,
      onPointerCancel: endPress,
      onContextMenu,
    },
  };
}
