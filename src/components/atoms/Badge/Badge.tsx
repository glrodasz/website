import React from 'react';
import './Badge.css';

export type BadgeVariant =
  | 'discovery'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'accent';

export interface BadgeProps {
  /**
   * Semantic / emphasis variant (tag component tokens + complementary accent)
   */
  variant?: BadgeVariant;
  /**
   * Padding and type scale
   */
  size?: 'small' | 'medium';
  /**
   * Uppercase label with slightly wider tracking (e.g. “Coming soon”)
   */
  uppercase?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'small',
  uppercase = false,
  children,
  className = '',
}) => {
  const base = 'qd-badge';
  const classes = [
    base,
    `${base}--${variant}`,
    `${base}--${size}`,
    uppercase && `${base}--uppercase`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <span className={`${base}__text`}>{children}</span>
    </span>
  );
};
