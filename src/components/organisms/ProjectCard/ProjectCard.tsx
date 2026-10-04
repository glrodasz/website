import React, { useEffect, useState } from 'react';
import { ArrowSquareOut, Check, GithubLogo, LinkSimple, ShareNetwork } from 'phosphor-react';
import { Button } from '../../atoms/Button';
import { Tag } from '../../atoms/Tag';
import { FooterSocialIcon } from '../../molecules/FooterSocialIcon';
import './ProjectCard.css';

const COPIED_RESET_MS = 2000;

export interface ProjectCardProps {
  /** Project name */
  title: string;
  /** One or two sentences about the project */
  description: string;
  /** Live URL — used by the CTA, the title link and every share action */
  url: string;
  /** Screenshot shown on the left. Without one, a browser-window mockup is drawn instead. */
  image?: string;
  /** Alt text for the screenshot */
  imageAlt?: string;
  /** Tech or topic labels */
  tags?: string[];
  /** Source code URL; adds a secondary "source" button */
  repoUrl?: string;
  /** CTA label */
  visitLabel?: string;
  /** Source code button label */
  sourceLabel?: string;
  /** Label in front of the share buttons */
  shareLabel?: string;
  /** Text that goes along with the URL when sharing */
  shareText?: string;
  /** Accessible name for each share link, given the network name */
  shareOnLabel?: (network: string) => string;
  /** Accessible name for the native share sheet button */
  shareNativeLabel?: string;
  /** Accessible name for the copy-link button */
  copyLinkLabel?: string;
  /** Announced after the link was copied */
  copiedLabel?: string;
  className?: string;
}

interface ShareTarget {
  id: 'twitter' | 'linkedin' | 'bluesky';
  network: string;
  href: string;
}

function buildShareTargets(url: string, text: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { id: 'twitter', network: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}` },
    { id: 'linkedin', network: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { id: 'bluesky', network: 'Bluesky', href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}` },
  ];
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * ProjectCard organism — a horizontal card for a side project: screenshot on
 * the left, copy on the right, a CTA to open it and quick share actions.
 * Stacks vertically on narrow screens.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  url,
  image,
  imageAlt,
  tags = [],
  repoUrl,
  visitLabel = 'Visit project',
  sourceLabel = 'Source',
  shareLabel = 'Share',
  shareText,
  shareOnLabel = (network) => `Share on ${network}`,
  shareNativeLabel = 'Share…',
  copyLinkLabel = 'Copy link',
  copiedLabel = 'Link copied',
  className,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShareNatively] = useState(
    () => typeof navigator !== 'undefined' && typeof navigator.share === 'function',
  );

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => window.clearTimeout(id);
  }, [copied]);

  const text = shareText ?? title;
  const shareTargets = buildShareTargets(url, text);
  const host = hostnameOf(url);
  const showImage = Boolean(image) && !imageFailed;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the share links still work.
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // The user dismissed the share sheet.
    }
  };

  const classNames = ['qd-project-card', className].filter(Boolean).join(' ');

  return (
    <article className={classNames}>
      <a
        className="qd-project-card__media"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
      >
        {showImage ? (
          <img
            className="qd-project-card__image"
            src={image}
            alt={imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="qd-project-card__placeholder">
            <div className="qd-project-card__placeholder-window">
              <div className="qd-project-card__placeholder-chrome">
                <span className="qd-project-card__placeholder-dot" />
                <span className="qd-project-card__placeholder-dot" />
                <span className="qd-project-card__placeholder-dot" />
                <span className="qd-project-card__placeholder-url">{host}</span>
              </div>
              <span className="qd-project-card__placeholder-title">{title}</span>
            </div>
          </div>
        )}
      </a>

      <div className="qd-project-card__body">
        {tags.length > 0 && (
          <ul className="qd-project-card__tags">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag size="small" variant="neutral" outlined>
                  {tag}
                </Tag>
              </li>
            ))}
          </ul>
        )}

        <h3 className="qd-project-card__title">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>
        <p className="qd-project-card__description">{description}</p>

        <div className="qd-project-card__footer">
          <div className="qd-project-card__actions">
            <Button
              variant="primary"
              size="small"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ArrowSquareOut size={16} weight="bold" aria-hidden />}
            >
              {visitLabel}
            </Button>
            {repoUrl && repoUrl !== url && (
              <Button
                variant="tertiary"
                size="small"
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={<GithubLogo size={16} weight="bold" aria-hidden />}
              >
                {sourceLabel}
              </Button>
            )}
          </div>

          <div className="qd-project-card__share" role="group" aria-label={`${shareLabel}: ${title}`}>
            <span className="qd-project-card__share-label" aria-hidden="true">
              {shareLabel}
            </span>
            {canShareNatively && (
              <button
                type="button"
                className="qd-project-card__share-button"
                onClick={handleNativeShare}
                aria-label={shareNativeLabel}
                title={shareNativeLabel}
              >
                <ShareNetwork weight="bold" aria-hidden />
              </button>
            )}
            {shareTargets.map((target) => {
              const label = shareOnLabel(target.network);
              return (
                <a
                  key={target.id}
                  className="qd-project-card__share-button"
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <FooterSocialIcon id={target.id} />
                </a>
              );
            })}
            <button
              type="button"
              className={[
                'qd-project-card__share-button',
                copied && 'qd-project-card__share-button--done',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={handleCopy}
              aria-label={copyLinkLabel}
              title={copied ? copiedLabel : copyLinkLabel}
            >
              {copied ? <Check weight="bold" aria-hidden /> : <LinkSimple weight="bold" aria-hidden />}
            </button>
            <span className="sr-only" role="status">
              {copied ? copiedLabel : ''}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
