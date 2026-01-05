import React from 'react';
import type { IconProps as PhosphorIconProps } from 'phosphor-react';
import './Icon.css';

/**
 * Icon component - Wrapper for Phosphor Icons with design token integration
 *
 * This component provides consistent sizing and styling for icons across
 * the Quantum Design system using design tokens.
 */
export interface IconProps extends Omit<PhosphorIconProps, 'size'> {
  /**
   * Icon component from phosphor-react (e.g., House, User, Settings)
   */
  icon: React.ComponentType<PhosphorIconProps>;

  /**
   * Size variant using design system sizing tokens
   */
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'ml' | 'lg' | 'xl' | 'xxl';

  /**
   * Color of the icon (can be a CSS custom property or color value)
   */
  color?: string;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color,
  className = '',
  ...rest
}) => {
  const baseClass = 'qd-icon';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <IconComponent
      className={classes}
      style={{ color }}
      {...rest}
    />
  );
};
