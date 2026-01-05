import React from 'react';
import { X } from 'phosphor-react';
import './Tag.css';

/**
 * Tag component - Labeled badge for categorization and status
 *
 * Displays a pill-shaped badge with optional close button.
 * Used for categories, filters, tags, and status indicators.
 */
export interface TagProps {
  /**
   * Size variant
   */
  size?: 'small' | 'large';

  /**
   * Semantic variant determining the color
   */
  variant?: 'discovery' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

  /**
   * Style variant - filled (solid) or outlined
   */
  outlined?: boolean;

  /**
   * Tag content/label
   */
  children: React.ReactNode;

  /**
   * Optional close button handler
   */
  onClose?: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  size = 'large',
  variant = 'neutral',
  outlined = false,
  children,
  onClose,
  className = '',
}) => {
  const baseClass = 'qd-tag';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    `${baseClass}--${variant}`,
    outlined ? `${baseClass}--outlined` : `${baseClass}--filled`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <span className={`${baseClass}__text`}>{children}</span>
      {onClose && (
        <button
          type="button"
          className={`${baseClass}__close`}
          onClick={onClose}
          aria-label="Remove tag"
        >
          <X weight="bold" />
        </button>
      )}
    </span>
  );
};
