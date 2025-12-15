import React from 'react';
import { Button, ButtonProps } from '../atoms';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonProps, 'icon' | 'children'> {
  /**
   * Icon component or element to display
   */
  icon: React.ReactNode;
  /**
   * Button text label
   */
  label: string;
  /**
   * Icon position relative to text
   */
  iconPosition?: 'left' | 'right';
}

/**
 * IconButton molecule - combines Button atom with an icon
 * Based on Quantum Design system
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  iconPosition = 'left',
  ...buttonProps
}) => {
  const content = (
    <div className={`qd-icon-button__content qd-icon-button__content--${iconPosition}`}>
      <span className="qd-icon-button__icon">{icon}</span>
      <span className="qd-icon-button__label">{label}</span>
    </div>
  );

  return (
    <Button {...buttonProps} className="qd-icon-button">
      {content}
    </Button>
  );
};

export default IconButton;
