import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ description }: { description?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="small" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog title"
        description={description}
        closeLabel="Close"
      >
        <p>Dialog content goes here. Press Escape, click the backdrop or use the close button to dismiss it.</p>
        <Button variant="primary" size="small" onClick={() => setOpen(false)}>
          Done
        </Button>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};

export const WithDescription: Story = {
  render: () => <Demo description="A short line that explains what this dialog is for." />,
};

export const Open: Story = {
  args: {
    open: true,
    title: 'Dialog title',
    description: 'A short line that explains what this dialog is for.',
    closeLabel: 'Close',
    children: <p>Dialog content goes here.</p>,
  },
};
