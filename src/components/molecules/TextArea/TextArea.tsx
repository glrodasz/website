import React from 'react';
import './TextArea.css';

/**
 * TextArea component - Multi-line text input field
 *
 * A molecule component combining a label and textarea field for
 * multi-line text input.
 */
export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Size variant
   */
  size?: 'small' | 'large';

  /**
   * Textarea label
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
   * Additional CSS class names
   */
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  size = 'large',
  label,
  error = false,
  errorMessage,
  className = '',
  disabled = false,
  id,
  rows = 4,
  ...rest
}) => {
  const baseClass = 'qd-textarea';
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperClasses = [
    `${baseClass}__wrapper`,
    className,
  ].filter(Boolean).join(' ');

  const textareaClasses = [
    `${baseClass}__field`,
    `${baseClass}__field--${size}`,
    error && `${baseClass}__field--error`,
    disabled && `${baseClass}__field--disabled`,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={textareaId} className={`${baseClass}__label`}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        disabled={disabled}
        rows={rows}
        aria-invalid={error}
        aria-describedby={error && errorMessage ? `${textareaId}-error` : undefined}
        {...rest}
      />
      {error && errorMessage && (
        <span id={`${textareaId}-error`} className={`${baseClass}__error-message`}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
