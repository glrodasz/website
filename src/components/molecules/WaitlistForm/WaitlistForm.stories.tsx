import type { Meta, StoryObj } from '@storybook/react';
import { WaitlistForm } from './WaitlistForm';

const meta: Meta<typeof WaitlistForm> = {
  title: 'Molecules/WaitlistForm',
  component: WaitlistForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WaitlistForm>;

/**
 * Idle — default state. Submissions go to /api/subscribe which requires
 * BREVO_API_KEY and BREVO_AI_COURSE_LIST_ID on the server.
 */
export const Idle: Story = {
  args: {},
};

/**
 * Success — simulates a successful subscription response by pointing the
 * form at a mock endpoint that always returns `{ ok: true }`.
 */
export const Success: Story = {
  args: {
    endpoint: 'data:application/json,{"ok":true}',
  },
};

/**
 * Error — the endpoint returns a non-2xx response, triggering the inline
 * error message.
 */
export const ErrorState: Story = {
  args: {
    endpoint: '/api/does-not-exist',
  },
};
