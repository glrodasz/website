import React from 'react';
import './Logo.css';

/**
 * Logo component - Brand identity logo
 *
 * Displays the Quantum Design logo with variant and size options.
 * Can be made clickable for navigation purposes.
 */
export interface LogoProps {
  /**
   * Color variant (default for dark backgrounds, contrast for light backgrounds)
   */
  variant?: 'default' | 'contrast';

  /**
   * Size variant (small = icon only, large = icon + text)
   */
  size?: 'small' | 'large';

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Click handler (e.g., for navigation to home)
   */
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'large',
  className = '',
  onClick,
}) => {
  const baseClass = 'qd-logo';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    onClick && `${baseClass}--clickable`,
    className,
  ].filter(Boolean).join(' ');

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={classes}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {/* Logo icon/mark */}
      <svg
        className={`${baseClass}__icon`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple geometric Q logo design */}
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="currentColor"
          strokeWidth="3"
          className={`${baseClass}__circle`}
        />
        <rect
          x="25"
          y="25"
          width="10"
          height="3"
          rx="1.5"
          fill="currentColor"
          className={`${baseClass}__tail`}
          transform="rotate(45 25 25)"
        />
      </svg>

      {/* Logo text (only in large variant) */}
      {size === 'large' && (
        <span className={`${baseClass}__text`}>
          <span className={`${baseClass}__text-quantum`}>quantum</span>
          <span className={`${baseClass}__text-design`}>DESIGN</span>
        </span>
      )}
    </Tag>
  );
};
