import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy } from 'phosphor-react';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { SegmentedControl } from '../../atoms/SegmentedControl';
import type { SegmentedControlOption } from '../../atoms/SegmentedControl';
import { markdownToPlainText } from './markdownToPlainText';
import './BioCard.css';

const COPIED_RESET_MS = 2000;

type CopyKind = 'text' | 'markdown';

export interface BioCardProps<T extends string = string> {
  /**
   * Card heading, e.g. "Very short"
   */
  title: string;
  /**
   * Where this length fits, e.g. "X, Instagram, GitHub"
   */
  hint: string;
  /**
   * Character count of the plain text, already formatted with its unit
   */
  characterCount: string;
  /**
   * The bio as Markdown; rendered on the card and copied as plain text or Markdown
   */
  markdown: string;
  /**
   * Point-of-view choices
   */
  personOptions: SegmentedControlOption<T>[];
  /**
   * Selected point of view
   */
  person: T;
  /**
   * Called with the newly selected point of view
   */
  onPersonChange: (person: T) => void;
  /**
   * Accessible name for the point-of-view toggle
   */
  personLabel: string;
  /**
   * Label of the plain text copy button
   */
  copyLabel: string;
  /**
   * Label of the Markdown copy button (only shown when the bio has formatting)
   */
  copyMarkdownLabel: string;
  /**
   * Label shown on the button right after copying
   */
  copiedLabel: string;
  /**
   * Additional CSS class names
   */
  className?: string;
}

const markdownComponents = {
  a: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

/**
 * BioCard molecule - one bio with a point-of-view toggle and copy buttons.
 */
export function BioCard<T extends string = string>({
  title,
  hint,
  characterCount,
  markdown,
  personOptions,
  person,
  onPersonChange,
  personLabel,
  copyLabel,
  copyMarkdownLabel,
  copiedLabel,
  className,
}: BioCardProps<T>) {
  const [copyState, setCopyState] = useState<{ kind: CopyKind; markdown: string } | null>(null);
  const plainText = markdownToPlainText(markdown);
  const hasFormatting = plainText !== markdown.trim();

  // A copy confirmation belongs to the text that was copied: switching the point of view clears it.
  const copied = copyState?.markdown === markdown ? copyState.kind : null;

  useEffect(() => {
    if (!copyState) return;
    const id = window.setTimeout(() => setCopyState(null), COPIED_RESET_MS);
    return () => window.clearTimeout(id);
  }, [copyState]);

  const handleCopy = async (kind: CopyKind) => {
    try {
      await navigator.clipboard.writeText(kind === 'text' ? plainText : markdown.trim());
      setCopyState({ kind, markdown });
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the text stays selectable.
    }
  };

  const renderCopyButton = (kind: CopyKind, label: string, variant: 'primary' | 'secondary') => (
    <Button
      variant={variant}
      size="small"
      onClick={() => handleCopy(kind)}
      icon={<Icon icon={copied === kind ? Check : Copy} size="xs" aria-hidden="true" />}
    >
      {copied === kind ? copiedLabel : label}
    </Button>
  );

  const classNames = ['qd-bio-card', className].filter(Boolean).join(' ');

  return (
    <article className={classNames}>
      <header className="qd-bio-card__header">
        <div className="qd-bio-card__heading">
          <h3 className="qd-bio-card__title">{title}</h3>
          <p className="qd-bio-card__meta">
            {hint} · {characterCount}
          </p>
        </div>
        <SegmentedControl
          options={personOptions}
          value={person}
          onChange={onPersonChange}
          ariaLabel={personLabel}
        />
      </header>

      <div className="qd-bio-card__text">
        <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
      </div>

      <div className="qd-bio-card__actions">
        {renderCopyButton('text', copyLabel, 'primary')}
        {hasFormatting && renderCopyButton('markdown', copyMarkdownLabel, 'secondary')}
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? copiedLabel : ''}
        </span>
      </div>
    </article>
  );
}

export default BioCard;
