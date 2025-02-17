import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input.tsx';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

export const Text: Story = {
  render: (args) => <Input {...args} />,
};

export const Email: Story = {
  args: { type: 'email' },
  render: (args) => <Input {...args} />,
};

export const Password: Story = {
  args: { type: 'password' },
  render: (args) => <Input {...args} />,
};

export const Number: Story = {
  args: { type: 'number' },
  render: (args) => <Input {...args} />,
};

export const Date: Story = {
  args: { type: 'date' },
  render: (args) => <Input {...args} />,
};

export const Time: Story = {
  args: { type: 'time' },
  render: (args) => <Input {...args} />,
};
