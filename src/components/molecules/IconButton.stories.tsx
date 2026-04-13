import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

// Simple icon component for demo (using SVG)
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Molecules/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button visual variant',
    },
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Button size',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Icon position relative to text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// Primary variant
export const PrimaryWithCheck: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    icon: <CheckIcon />,
    label: 'Confirm',
    iconPosition: 'left',
  },
};

export const PrimaryWithArrow: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    icon: <ArrowIcon />,
    label: 'Continue',
    iconPosition: 'right',
  },
};

// Secondary variant
export const SecondaryWithPlus: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    icon: <PlusIcon />,
    label: 'Add Item',
    iconPosition: 'left',
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: 'secondary',
    size: 'small',
    icon: <CheckIcon />,
    label: 'Done',
    iconPosition: 'left',
  },
};

// Tertiary variant
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'large',
    icon: <ArrowIcon />,
    label: 'Go Back',
    iconPosition: 'left',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    icon: <CheckIcon />,
    label: 'Disabled',
    disabled: true,
  },
};

// Icon positions
export const IconPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <IconButton
        variant="primary"
        size="large"
        icon={<CheckIcon />}
        label="Icon Left"
        iconPosition="left"
      />
      <IconButton
        variant="primary"
        size="large"
        icon={<ArrowIcon />}
        label="Icon Right"
        iconPosition="right"
      />
    </div>
  ),
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <IconButton variant="primary" size="large" icon={<CheckIcon />} label="Primary" />
        <IconButton variant="secondary" size="large" icon={<PlusIcon />} label="Secondary" />
        <IconButton variant="tertiary" size="large" icon={<ArrowIcon />} label="Tertiary" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <IconButton variant="primary" size="small" icon={<CheckIcon />} label="Small" />
        <IconButton variant="secondary" size="small" icon={<PlusIcon />} label="Small" />
        <IconButton variant="tertiary" size="small" icon={<ArrowIcon />} label="Small" />
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <IconButton variant="primary" disabled icon={<CheckIcon />} label="Disabled" />
        <IconButton variant="secondary" disabled icon={<PlusIcon />} label="Disabled" />
        <IconButton variant="tertiary" disabled icon={<ArrowIcon />} label="Disabled" />
      </div>
    </div>
  ),
};
