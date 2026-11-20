import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';
import type { SegmentedControlProps } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

type ControlledProps = Omit<SegmentedControlProps, 'value' | 'onChange'> & { initial: string };

const PERSON_OPTIONS = [
  { value: 'first', label: 'First person' },
  { value: 'third', label: 'Third person' },
];

export const Default: Story = {
  args: {
    options: PERSON_OPTIONS,
    value: 'first',
    ariaLabel: 'Point of view',
    onChange: () => {},
  },
};

export const ThirdPersonSelected: Story = {
  args: { ...Default.args, value: 'third' },
};

const Controlled = ({ initial, ...args }: ControlledProps) => {
  const [value, setValue] = useState(initial);
  return <SegmentedControl {...args} value={value} onChange={setValue} />;
};

export const Interactive: Story = {
  render: (args) => <Controlled {...args} initial="first" />,
  args: { options: PERSON_OPTIONS, ariaLabel: 'Point of view' },
};

export const ThreeOptions: Story = {
  render: (args) => <Controlled {...args} initial="light" />,
  args: {
    ariaLabel: 'Theme',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
};
