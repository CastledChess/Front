import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@/components/ui/calendar.tsx';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  render: (args) => <Calendar {...args} />,
};
