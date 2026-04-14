import React from 'react';
import './Typography.css';

export interface TypographyProps {
  /**
   * Typography variant
   */
  variant?: 'display' | 'heading' | 'title' | 'subtitle' | 'paragraph' | 'label' | 'button';
  /**
   * Text content
   */
  children: React.ReactNode;
  /**
   * HTML element to render
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'paragraph',
  children,
  as,
  className = '',
  style,
}) => {
  // Auto-select HTML element based on variant if not specified
  const defaultElement: Record<string, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'> = {
    display: 'h1',
    heading: 'h2',
    title: 'h3',
    subtitle: 'h4',
    paragraph: 'p',
    label: 'span',
    button: 'span',
  };

  const Element = (as || defaultElement[variant] || 'p') as React.ElementType<{
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  const classNames = ['qd-typography', `qd-typography--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <Element className={classNames} style={style}>{children}</Element>;
};

export default Typography;
