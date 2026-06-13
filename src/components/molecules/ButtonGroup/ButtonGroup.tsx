import React from 'react';
import './ButtonGroup.css';

/**
 * ButtonGroup molecule - Lays out a set of Button/IconButton atoms
 *
 * Applies consistent padding and gap from the button-group tokens.
 */
export interface ButtonGroupProps {
  /**
   * Size variant controlling padding and gap
   */
  size?: 'small' | 'large';
  /**
   * Stacking direction of the buttons
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Buttons to lay out
   */
  children: React.ReactNode;
  /**
   * Additional CSS class names
   */
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  size = 'large',
  direction = 'horizontal',
  children,
  className,
}) => {
  const classNames = [
    'qd-button-group',
    `qd-button-group--${size}`,
    `qd-button-group--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};

export default ButtonGroup;
