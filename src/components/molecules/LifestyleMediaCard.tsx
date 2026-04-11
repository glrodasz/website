import React from 'react';
import './LifestyleMediaCard.css';

export interface LifestyleMediaCardProps {
  href: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  /** Shown when `imageUrl` is missing (e.g. ▶ or 📖). */
  placeholder: string;
}

export const LifestyleMediaCard: React.FC<LifestyleMediaCardProps> = ({
  href,
  imageUrl,
  title,
  subtitle,
  placeholder,
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="qd-lifestyle-media-card">
    {imageUrl ? (
      <img src={imageUrl} alt="" className="qd-lifestyle-media-card__media" loading="lazy" />
    ) : (
      <div className="qd-lifestyle-media-card__media-placeholder" aria-hidden="true">
        {placeholder}
      </div>
    )}
    <div className="qd-lifestyle-media-card__meta">
      <span className="qd-lifestyle-media-card__title">{title}</span>
      {subtitle ? <span className="qd-lifestyle-media-card__subtitle">{subtitle}</span> : null}
    </div>
  </a>
);
