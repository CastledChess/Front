import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@/components/ui/label.tsx';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  args: { children: 'Label' },
  render: (args) => <Label {...args} />,
};
