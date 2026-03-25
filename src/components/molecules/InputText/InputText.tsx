import React from 'react';
import type { Icon as PhosphorIcon } from 'phosphor-react';
import './InputText.css';

/**
 * InputText component - Text input field with label and states
 *
 * A molecule component combining a label, input field, and optional
 * icon for form inputs.
 */
export interface InputTextProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Size variant
   */
  size?: 'small' | 'large';

  /**
   * Input label
   */
  label?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Optional icon component from phosphor-react
   */
  icon?: PhosphorIcon;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export const InputText: React.FC<InputTextProps> = ({
  size = 'large',
  label,
  error = false,
  errorMessage,
  icon: IconComponent,
  className = '',
  disabled = false,
  id,
  ...rest
}) => {
  const baseClass = 'qd-input-text';
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperClasses = [
    `${baseClass}__wrapper`,
    className,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    `${baseClass}__container`,
    `${baseClass}__container--${size}`,
    error && `${baseClass}__container--error`,
    disabled && `${baseClass}__container--disabled`,
    IconComponent && `${baseClass}__container--with-icon`,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className={`${baseClass}__label`}>
          {label}
        </label>
      )}
      <div className={containerClasses}>
        {IconComponent && (
          <IconComponent className={`${baseClass}__icon`} weight="regular" />
        )}
        <input
          id={inputId}
          className={`${baseClass}__input`}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && errorMessage && (
        <span id={`${inputId}-error`} className={`${baseClass}__error-message`}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
