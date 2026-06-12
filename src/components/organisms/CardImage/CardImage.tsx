import React from 'react';
import { Typography } from '../../atoms';
import './CardImage.css';

/**
 * CardImage organism - Content card with a media area on top
 *
 * Visual treatment is controlled by the card-image tokens:
 * flat (plain background), elevation (drop shadow), edge (border)
 * and contrast (dark background with alternative text colors).
 */
export interface CardImageProps {
  /**
   * Image source URL
   */
  image: string;
  /**
   * Alternative text for the image
   */
  imageAlt?: string;
  /**
   * Card title
   */
  title: string;
  /**
   * Optional supporting text
   */
  description?: string;
  /**
   * Visual variant
   */
  variant?: 'flat' | 'elevation' | 'edge' | 'contrast';
  /**
   * Optional footer actions (e.g. Button, ButtonGroup)
   */
  actions?: React.ReactNode;
  /**
   * Optional extra body content
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class names
   */
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  image,
  imageAlt = '',
  title,
  description,
  variant = 'flat',
  actions,
  children,
  className,
}) => {
  const classNames = [
    'qd-card-image',
    `qd-card-image--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classNames}>
      <div className="qd-card-image__media">
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="qd-card-image__body">
        <Typography variant="title" as="h3" className="qd-card-image__title">
          {title}
        </Typography>
        {description && (
          <Typography variant="paragraph" className="qd-card-image__description">
            {description}
          </Typography>
        )}
        {children}
        {actions && <div className="qd-card-image__actions">{actions}</div>}
      </div>
    </article>
  );
};

export default CardImage;
