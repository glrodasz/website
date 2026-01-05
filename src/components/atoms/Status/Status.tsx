import React from 'react';
import './Status.css';

/**
 * Status component - Visual indicator for status states
 *
 * Displays a colored circle to indicate success, warning, error, or neutral status.
 * Commonly used in lists, tables, and dashboards.
 */
export interface StatusProps {
  /**
   * Size variant
   */
  size?: 'lg' | 'sm' | 'xs';

  /**
   * Status variant determining the color
   */
  variant?: 'success' | 'warning' | 'error' | 'neutral';

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

export const Status: React.FC<StatusProps> = ({
  size = 'lg',
  variant = 'neutral',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseClass = 'qd-status';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    `${baseClass}--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      role="status"
      aria-label={ariaLabel || `Status: ${variant}`}
    />
  );
};
