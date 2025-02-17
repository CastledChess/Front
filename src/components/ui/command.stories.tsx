import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react';

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  subcomponents: {
    CommandEmpty: CommandEmpty as ComponentType<unknown>,
    CommandGroup: CommandGroup as ComponentType<unknown>,
    CommandInput: CommandInput as ComponentType<unknown>,
    CommandItem: CommandItem as ComponentType<unknown>,
    CommandList: CommandList as ComponentType<unknown>,
    CommandSeparator: CommandSeparator as ComponentType<unknown>,
    CommandShortcut: CommandShortcut as ComponentType<unknown>,
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof Command>;

export const Basic: Story = {
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
