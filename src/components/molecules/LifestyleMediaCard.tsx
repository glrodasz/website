import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'phosphor-react';
import './LifestyleMediaCard.css';

export interface LifestyleMediaCardProps {
  /** Physical object the card imitates: a hardcover book or a DVD keep case. */
  variant?: 'book' | 'dvd';
  href: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  /** Shown when `imageUrl` is missing or fails to load (e.g. ▶ or 📖). */
  placeholder: string;
  /** Text of the external link on the back face, e.g. "View on Goodreads". */
  linkLabel: string;
  /** Accessible label of the front face button that turns the object over. */
  flipLabel: string;
  /** Accessible label of the back face, which turns the object back when clicked. */
  flipBackLabel: string;
  /** Start turned over, showing the back face. */
  defaultFlipped?: boolean;
  className?: string;
}

const SUMMARY_MIN_FONT_SIZE = '--components-tokens--site--lifestyle-card--back--summary--min-font-size';
const SUMMARY_MAX_FONT_SIZE = '--components-tokens--site--lifestyle-card--back--summary--max-font-size';
const FITTED_FONT_SIZE = '--qd-lifestyle-media-card-fitted-size';
const FIT_PRECISION_PX = 0.25;
const OVERFLOW_CLASS = 'qd-lifestyle-media-card__sheet--overflowing';

/**
 * Grows the back-face text to the largest size, between the token bounds, at which
 * the summary still fits its box. Re-fits whenever the face resizes or fonts load.
 */
function useFittedFontSize(
  sheetRef: React.RefObject<HTMLElement | null>,
  summaryRef: React.RefObject<HTMLElement | null>,
  content: string,
) {
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const summary = summaryRef.current;
    if (!sheet || !summary) return;

    const fit = () => {
      const styles = getComputedStyle(sheet);
      let low = parseFloat(styles.getPropertyValue(SUMMARY_MIN_FONT_SIZE));
      let high = parseFloat(styles.getPropertyValue(SUMMARY_MAX_FONT_SIZE));
      if (Number.isNaN(low) || Number.isNaN(high)) return;

      const fits = (size: number) => {
        sheet.style.setProperty(FITTED_FONT_SIZE, `${size}px`);
        return summary.scrollHeight <= summary.clientHeight;
      };

      let overflowing = false;
      if (!fits(high)) {
        while (high - low > FIT_PRECISION_PX) {
          const mid = (low + high) / 2;
          if (fits(mid)) low = mid;
          else high = mid;
        }
        // Even the smallest size can overflow on narrow cards: the summary then scrolls.
        overflowing = !fits(low);
      }
      sheet.classList.toggle(OVERFLOW_CLASS, overflowing);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(sheet);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [sheetRef, summaryRef, content]);
}

export const LifestyleMediaCard: React.FC<LifestyleMediaCardProps> = ({
  variant = 'book',
  href,
  imageUrl,
  title,
  subtitle,
  summary,
  placeholder,
  linkLabel,
  flipLabel,
  flipBackLabel,
  defaultFlipped = false,
  className,
}) => {
  const [imgError, setImgError] = useState(false);
  const [pinned, setPinned] = useState(defaultFlipped);
  const [hovered, setHovered] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const backId = useId();

  useFittedFontSize(sheetRef, summaryRef, `${title}${summary ?? ''}`);

  const showImage = imageUrl && !imgError;
  const flipped = pinned || hovered;

  const turnOver = (event: React.MouseEvent) => {
    setPinned(true);
    // A click with detail 0 comes from the keyboard: follow the content to the back face.
    if (event.detail === 0) requestAnimationFrame(() => linkRef.current?.focus());
  };

  const turnBack = () => {
    setPinned(false);
    setHovered(false);
    requestAnimationFrame(() => frontRef.current?.focus());
  };

  // Any click on the back turns the object over again, except on the link itself.
  const handleSheetClick = (event: React.MouseEvent) => {
    if (!(event.target as Element).closest('a, button')) turnBack();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && flipped) turnBack();
  };

  // Tabbing away turns the object back. Focus lost to nothing (the face that just
  // became inert, or a tap on empty page) has no relatedTarget and keeps it turned.
  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next)) setPinned(false);
  };

  const isMouse = (event: React.PointerEvent) => event.pointerType === 'mouse';

  const classNames = [
    'qd-lifestyle-media-card',
    `qd-lifestyle-media-card--${variant}`,
    flipped && 'qd-lifestyle-media-card--flipped',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const coverStyle = showImage
    ? ({ '--qd-lifestyle-media-card-cover': `url("${imageUrl}")` } as React.CSSProperties)
    : undefined;

  return (
    <article className={classNames} style={coverStyle} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <div
        className="qd-lifestyle-media-card__stage"
        onPointerEnter={(e) => isMouse(e) && setHovered(true)}
        onPointerLeave={(e) => isMouse(e) && setHovered(false)}
      >
        <div className="qd-lifestyle-media-card__object">
          <button
            ref={frontRef}
            type="button"
            className="qd-lifestyle-media-card__face qd-lifestyle-media-card__front"
            aria-label={flipLabel}
            aria-expanded={flipped}
            aria-controls={backId}
            inert={flipped}
            onClick={turnOver}
          >
            {showImage ? (
              <img
                src={imageUrl}
                alt=""
                className="qd-lifestyle-media-card__media"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="qd-lifestyle-media-card__media-placeholder" aria-hidden="true">
                {placeholder}
              </span>
            )}
          </button>
          <div className="qd-lifestyle-media-card__spine" aria-hidden="true" />
          {variant === 'book' ? <div className="qd-lifestyle-media-card__pages" aria-hidden="true" /> : null}
          <div
            id={backId}
            className="qd-lifestyle-media-card__face qd-lifestyle-media-card__back"
            inert={!flipped}
          >
            <div ref={sheetRef} className="qd-lifestyle-media-card__sheet" onClick={handleSheetClick}>
              <span className="qd-lifestyle-media-card__back-title" aria-hidden="true">
                {title}
              </span>
              <p ref={summaryRef} className="qd-lifestyle-media-card__summary">
                {summary}
              </p>
              <a
                ref={linkRef}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="qd-lifestyle-media-card__link"
              >
                {linkLabel}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <button
                type="button"
                className="qd-lifestyle-media-card__flip-back"
                aria-label={flipBackLabel}
                onClick={turnBack}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="qd-lifestyle-media-card__caption">
        <h3 className="qd-lifestyle-media-card__title">{title}</h3>
        {subtitle ? <span className="qd-lifestyle-media-card__subtitle">{subtitle}</span> : null}
      </div>
    </article>
  );
};
