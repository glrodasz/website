import React from 'react';
import './Button.css';

export interface ButtonProps {
  /**
   * Button variant based on Quantum Design system
   */
  variant?: 'primary' | 'secondary' | 'ghost-light' | 'ghost-dark';
  /**
   * Button size
   */
  size?: 'small' | 'large';
  /**
   * Button state
   */
  disabled?: boolean;
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
  /**
   * Optional additional CSS class
   */
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  disabled = false,
  children,
  onClick,
  icon,
  className,
}) => {
  const classNames = [
    'qd-button',
    `qd-button--${variant}`,
    `qd-button--${size}`,
    disabled && 'qd-button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="qd-button__icon">{icon}</span>}
      <span className="qd-button__text">{children}</span>
    </button>
  );
};

export default Button;
