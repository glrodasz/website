import React from 'react';
import { Check } from 'phosphor-react';
import './CheckButton.css';

/**
 * CheckButton component - Used in step indicators and progress tracking
 *
 * Displays a checkmark button to indicate completed steps or selections.
 */
export interface CheckButtonProps {
  /**
   * Size variant
   */
  size?: 'small' | 'large';

  /**
   * Active/completed state
   */
  active?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Optional label text
   */
  label?: string;

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

export const CheckButton: React.FC<CheckButtonProps> = ({
  size = 'large',
  active = false,
  disabled = false,
  label,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseClass = 'qd-check-button';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    active && `${baseClass}--active`,
    disabled && `${baseClass}--disabled`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (label ? `${label} ${active ? 'completed' : 'not completed'}` : undefined)}
      aria-checked={active}
      role="checkbox"
    >
      {active && (
        <Check
          className={`${baseClass}__checkmark`}
          weight="bold"
        />
      )}
      {label && <span className={`${baseClass}__label`}>{label}</span>}
    </button>
  );
};
