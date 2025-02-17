import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { ComponentType } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  subcomponents: {
    SelectContent: SelectContent as ComponentType<unknown>,
    SelectItem: SelectItem as ComponentType<unknown>,
    SelectTrigger: SelectTrigger as ComponentType<unknown>,
    SelectValue: SelectValue as ComponentType<unknown>,
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="dark" id="animation-speed">
        <SelectValue placeholder="Animation speed" />
      </SelectTrigger>

      <SelectContent className="dark">
        <SelectItem value="500">Super slow (500ms)</SelectItem>
        <SelectItem value="350">Slow (350ms)</SelectItem>
        <SelectItem value="250">Normal (250ms)</SelectItem>
        <SelectItem value="150">Fast (150ms)</SelectItem>
        <SelectItem value="75">Super fast (75ms)</SelectItem>
        <SelectItem value="0">Instant (0ms)</SelectItem>
      </SelectContent>
    </Select>
  ),
};
