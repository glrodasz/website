import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export interface ButtonProps {
  /**
   * Button variant based on Quantum Design system
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
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
   * Optional click handler (button only)
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
  /**
   * Internal route — renders as React Router Link
   */
  to?: string;
  /**
   * External URL — renders as anchor tag
   */
  href?: string;
  /**
   * Anchor target (e.g. "_blank")
   */
  target?: string;
  /**
   * Anchor rel attribute
   */
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  disabled = false,
  children,
  onClick,
  icon,
  className,
  to,
  href,
  target,
  rel,
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

  const content = (
    <>
      {icon && <span className="qd-button__icon">{icon}</span>}
      <span className="qd-button__text">{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classNames}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
};

export default Button;
