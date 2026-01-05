import type { Meta, StoryObj } from '@storybook/react';
import { Status } from './Status';

const meta: Meta<typeof Status> = {
  title: 'Atoms/Information/Status',
  component: Status,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['lg', 'sm', 'xs'],
      description: 'Size of the status indicator',
    },
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'neutral'],
      description: 'Status variant determining the color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    size: 'lg',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    size: 'lg',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    size: 'lg',
    variant: 'error',
  },
};

export const Neutral: Story = {
  args: {
    size: 'lg',
    variant: 'neutral',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Large size */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large (lg)</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="lg" variant="success" />
            <span style={{ fontSize: '14px' }}>Success</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="lg" variant="warning" />
            <span style={{ fontSize: '14px' }}>Warning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="lg" variant="error" />
            <span style={{ fontSize: '14px' }}>Error</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="lg" variant="neutral" />
            <span style={{ fontSize: '14px' }}>Neutral</span>
          </div>
        </div>
      </div>

      {/* Small size */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small (sm)</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="sm" variant="success" />
            <span style={{ fontSize: '14px' }}>Success</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="sm" variant="warning" />
            <span style={{ fontSize: '14px' }}>Warning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="sm" variant="error" />
            <span style={{ fontSize: '14px' }}>Error</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="sm" variant="neutral" />
            <span style={{ fontSize: '14px' }}>Neutral</span>
          </div>
        </div>
      </div>

      {/* Extra small size */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Extra Small (xs)</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="xs" variant="success" />
            <span style={{ fontSize: '14px' }}>Success</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="xs" variant="warning" />
            <span style={{ fontSize: '14px' }}>Warning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="xs" variant="error" />
            <span style={{ fontSize: '14px' }}>Error</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Status size="xs" variant="neutral" />
            <span style={{ fontSize: '14px' }}>Neutral</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InListExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      {[
        { name: 'Server 1', status: 'success' as const },
        { name: 'Server 2', status: 'success' as const },
        { name: 'Server 3', status: 'warning' as const },
        { name: 'Server 4', status: 'error' as const },
        { name: 'Server 5', status: 'neutral' as const },
      ].map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <Status size="sm" variant={item.status} />
          <span style={{ fontSize: '14px' }}>{item.name}</span>
        </div>
      ))}
    </div>
  ),
};
