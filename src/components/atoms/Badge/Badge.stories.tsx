import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Information/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'discovery',
        'info',
        'success',
        'warning',
        'error',
        'neutral',
        'accent',
      ],
    },
    size: { control: 'radio', options: ['small', 'medium'] },
    uppercase: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'neutral',
    size: 'small',
  },
};

export const AccentUppercase: Story = {
  args: {
    children: 'Coming soon',
    variant: 'accent',
    size: 'small',
    uppercase: true,
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    variant: 'info',
    size: 'medium',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 480,
      }}
    >
      <Badge variant="discovery">Discovery</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="accent" uppercase>
        Accent
      </Badge>
    </div>
  ),
};
