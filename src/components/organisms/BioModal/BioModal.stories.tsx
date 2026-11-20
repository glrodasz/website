import type { Meta, StoryObj } from '@storybook/react';
import { BioModal } from './BioModal';

const meta: Meta<typeof BioModal> = {
  title: 'Organisms/BioModal',
  component: BioModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
