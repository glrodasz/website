import React from 'react';
import { Typography } from '../../atoms';
import './CardText.css';

/**
 * CardText organism - Text-only content card
 *
 * Visual treatment is controlled by the card-text tokens:
 * flat (plain background), elevation (drop shadow), edge (border)
 * and contrast (dark background with alternative text colors).
 * Note: the card-text spacing/radius tokens are also consumed by
 * page-level CSS (Home, course pages) — changing their values
 * restyles those pages as well.
 */
export interface CardTextProps {
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

export const CardText: React.FC<CardTextProps> = ({
  title,
  description,
  variant = 'flat',
  actions,
  children,
  className,
}) => {
  const classNames = [
    'qd-card-text',
    `qd-card-text--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classNames}>
      <div className="qd-card-text__body">
        <Typography variant="title" as="h3" className="qd-card-text__title">
          {title}
        </Typography>
        {description && (
          <Typography variant="paragraph" className="qd-card-text__description">
            {description}
          </Typography>
        )}
        {children}
        {actions && <div className="qd-card-text__actions">{actions}</div>}
      </div>
    </article>
  );
};

export default CardText;
