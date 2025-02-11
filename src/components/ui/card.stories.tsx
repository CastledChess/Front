import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/card.tsx';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: (args) => <Card {...args}>Card</Card>,
};
