import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import {
  House,
  User,
  Gear,
  Heart,
  Star,
  MagnifyingGlass,
  ShoppingCart,
  Bell,
  Calendar,
  Check,
} from 'phosphor-react';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Phosphor Icon component',
    },
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'ml', 'lg', 'xl', 'xxl'],
      description: 'Icon size using design system tokens',
    },
    color: {
      control: 'color',
      description: 'Icon color',
    },
    weight: {
      control: 'select',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
      description: 'Icon weight/style',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: House,
    size: 'md',
    weight: 'regular',
  },
};

export const Small: Story = {
  args: {
    icon: User,
    size: 'sm',
    weight: 'regular',
  },
};

export const Large: Story = {
  args: {
    icon: Heart,
    size: 'lg',
    weight: 'fill',
    color: '#e74c3c',
  },
};

export const ExtraLarge: Story = {
  args: {
    icon: Star,
    size: 'xxl',
    weight: 'fill',
    color: '#f39c12',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="xxs" />
        <span style={{ fontSize: '0.75rem' }}>xxs</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="xs" />
        <span style={{ fontSize: '0.75rem' }}>xs</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>sm</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="md" />
        <span style={{ fontSize: '0.75rem' }}>md</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="ml" />
        <span style={{ fontSize: '0.75rem' }}>ml</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="lg" />
        <span style={{ fontSize: '0.75rem' }}>lg</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="xl" />
        <span style={{ fontSize: '0.75rem' }}>xl</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={House} size="xxl" />
        <span style={{ fontSize: '0.75rem' }}>xxl</span>
      </div>
    </div>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="thin" />
        <span style={{ fontSize: '0.75rem' }}>thin</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="light" />
        <span style={{ fontSize: '0.75rem' }}>light</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="regular" />
        <span style={{ fontSize: '0.75rem' }}>regular</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="bold" />
        <span style={{ fontSize: '0.75rem' }}>bold</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="fill" />
        <span style={{ fontSize: '0.75rem' }}>fill</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Heart} size="lg" weight="duotone" />
        <span style={{ fontSize: '0.75rem' }}>duotone</span>
      </div>
    </div>
  ),
};

export const IconShowcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2rem', padding: '1rem' }}>
      <Icon icon={House} size="lg" />
      <Icon icon={User} size="lg" />
      <Icon icon={Gear} size="lg" />
      <Icon icon={Heart} size="lg" weight="fill" color="#e74c3c" />
      <Icon icon={Star} size="lg" weight="fill" color="#f39c12" />
      <Icon icon={MagnifyingGlass} size="lg" />
      <Icon icon={ShoppingCart} size="lg" />
      <Icon icon={Bell} size="lg" />
      <Icon icon={Calendar} size="lg" />
      <Icon icon={Check} size="lg" weight="bold" color="#27ae60" />
    </div>
  ),
};
