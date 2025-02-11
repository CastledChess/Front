import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  subcomponents: {
    AvatarFallback: AvatarFallback as ComponentType<unknown>,
    AvatarImage: AvatarImage as ComponentType<unknown>,
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Basic: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};
