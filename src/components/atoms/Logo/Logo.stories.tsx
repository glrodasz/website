import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Atoms/Information/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'contrast'],
      description: 'Color variant (default for dark bg, contrast for light bg)',
    },
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Size variant (small = icon only, large = icon + text)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'large',
  },
};

export const DefaultSmall: Story = {
  args: {
    variant: 'default',
    size: 'small',
  },
};

export const Contrast: Story = {
  args: {
    variant: 'contrast',
    size: 'large',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const ContrastSmall: Story = {
  args: {
    variant: 'contrast',
    size: 'small',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Clickable: Story = {
  args: {
    variant: 'default',
    size: 'large',
    onClick: () => alert('Logo clicked! Navigate to home.'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Default variant */}
      <div>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '14px', fontWeight: 600 }}>
          Default Variant (for light backgrounds)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Logo variant="default" size="large" />
            <span style={{ fontSize: '12px', color: '#666' }}>Large</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Logo variant="default" size="small" />
            <span style={{ fontSize: '12px', color: '#666' }}>Small</span>
          </div>
        </div>
      </div>

      {/* Contrast variant */}
      <div>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '14px', fontWeight: 600 }}>
          Contrast Variant (for dark backgrounds)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Logo variant="contrast" size="large" />
            <span style={{ fontSize: '12px', color: '#ccc' }}>Large</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Logo variant="contrast" size="small" />
            <span style={{ fontSize: '12px', color: '#ccc' }}>Small</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InNavigationExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        width: '600px',
      }}
    >
      <Logo variant="default" size="large" onClick={() => console.log('Navigate to home')} />
      <nav style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
        <a href="#" style={{ color: '#333', textDecoration: 'none' }}>Products</a>
        <a href="#" style={{ color: '#333', textDecoration: 'none' }}>About</a>
        <a href="#" style={{ color: '#333', textDecoration: 'none' }}>Contact</a>
      </nav>
    </div>
  ),
};

export const InDarkNavigationExample: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        width: '600px',
      }}
    >
      <Logo variant="contrast" size="large" onClick={() => console.log('Navigate to home')} />
      <nav style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Products</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
      </nav>
    </div>
  ),
};
