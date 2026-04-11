import type { Meta, StoryObj } from '@storybook/react';
import { FooterSocialIcon } from './FooterSocialIcon';

const meta: Meta<typeof FooterSocialIcon> = {
  title: 'Molecules/FooterSocialIcon',
  component: FooterSocialIcon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'select',
      options: [
        'twitter',
        'twitch',
        'youtube',
        'instagram',
        'linkedin',
        'threads',
        'tiktok',
        'facebook',
        'bluesky',
        'mastodon',
        'github',
        'goodreads',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FooterSocialIcon>;

export const Twitter: Story = {
  args: { id: 'twitter' },
  decorators: [
    (Story) => (
      <div style={{ width: 48, height: 48, color: '#002529' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 48px)',
        gap: 12,
        color: '#002529',
      }}
    >
      {[
        'twitter',
        'twitch',
        'youtube',
        'instagram',
        'linkedin',
        'threads',
        'tiktok',
        'facebook',
        'bluesky',
        'mastodon',
        'github',
        'goodreads',
      ].map((id) => (
        <div
          key={id}
          style={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FooterSocialIcon id={id} />
        </div>
      ))}
    </div>
  ),
};
