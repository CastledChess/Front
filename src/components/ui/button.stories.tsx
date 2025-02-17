import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button.tsx';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => (
    <Button {...args} variant="default">
      Default
    </Button>
  ),
};

export const Secondary: Story = {
  render: (args) => (
    <Button {...args} variant="secondary">
      Secondary
    </Button>
  ),
};

export const Outline: Story = {
  render: (args) => (
    <Button {...args} variant="outline">
      Outline
    </Button>
  ),
};

export const Link: Story = {
  render: (args) => (
    <Button {...args} variant="link">
      Link
    </Button>
  ),
};

export const Ghost: Story = {
  render: (args) => (
    <Button {...args} variant="ghost">
      Ghost
    </Button>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <Button {...args} variant="destructive">
      Destructive
    </Button>
  ),
};
