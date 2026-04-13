import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button visual variant based on Quantum Design system',
    },
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary variant stories
export const PrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Primary Button',
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Primary Button',
  },
};

// Secondary variant stories
export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    children: 'Secondary Button',
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: 'secondary',
    size: 'small',
    children: 'Secondary Button',
  },
};

// Tertiary variant stories
export const TertiaryLarge: Story = {
  args: {
    variant: 'tertiary',
    size: 'large',
    children: 'Tertiary Button',
  },
};

export const TertiarySmall: Story = {
  args: {
    variant: 'tertiary',
    size: 'small',
    children: 'Tertiary Button',
  },
};

// Disabled states
export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    disabled: true,
    children: 'Disabled Button',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="primary" size="large">Primary</Button>
        <Button variant="secondary" size="large">Secondary</Button>
        <Button variant="tertiary" size="large">Tertiary</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="primary" size="small">Primary Small</Button>
        <Button variant="secondary" size="small">Secondary Small</Button>
        <Button variant="tertiary" size="small">Tertiary Small</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="tertiary" disabled>Disabled</Button>
      </div>
    </div>
  ),
};
