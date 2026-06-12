import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Plus } from 'phosphor-react';
import { ButtonGroup } from './ButtonGroup';
import { Button, Icon } from '../../atoms';
import { IconButton } from '../IconButton';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large'],
      description: 'Padding and gap size from button-group tokens',
    },
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Stacking direction of the buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  args: {
    size: 'large',
    direction: 'horizontal',
    children: (
      <>
        <Button variant="primary">Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    direction: 'horizontal',
    children: (
      <>
        <Button variant="primary" size="small">Save</Button>
        <Button variant="secondary" size="small">Cancel</Button>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    size: 'large',
    direction: 'vertical',
    children: (
      <>
        <Button variant="primary">Sign Up</Button>
        <Button variant="secondary">Log In</Button>
        <Button variant="tertiary">Continue as Guest</Button>
      </>
    ),
  },
};

export const WithIconButtons: Story = {
  render: () => (
    <ButtonGroup>
      <IconButton
        variant="primary"
        icon={<Icon icon={ArrowRight} size="xs" />}
        label="Continue"
        iconPosition="right"
      />
      <IconButton
        variant="secondary"
        icon={<Icon icon={Plus} size="xs" />}
        label="Add Item"
      />
    </ButtonGroup>
  ),
};

export const WithDisabledButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary" disabled>Submit</Button>
      <Button variant="secondary">Back</Button>
    </ButtonGroup>
  ),
};
