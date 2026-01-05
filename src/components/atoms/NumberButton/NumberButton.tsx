import React from 'react';
import './NumberButton.css';

/**
 * NumberButton component - Used in pagination and step indicators
 *
 * Displays a number or text in a clickable button format, commonly used
 * for page numbers in pagination components.
 */
export interface NumberButtonProps {
  /**
   * Size variant
   */
  size?: 'small' | 'large';

  /**
   * Selected/active state
   */
  selected?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Content to display (typically a number)
   */
  children: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;
}

export const NumberButton: React.FC<NumberButtonProps> = ({
  size = 'large',
  selected = false,
  disabled = false,
  children,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseClass = 'qd-number-button';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    selected && `${baseClass}--selected`,
    disabled && `${baseClass}--disabled`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
};
