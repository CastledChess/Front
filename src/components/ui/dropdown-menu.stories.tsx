import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { ComponentType } from 'react';
import { Button } from '@/components/ui/button.tsx';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Drodown Menu',
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuContent: DropdownMenuContent as ComponentType<unknown>,
    DropdownMenuGroup: DropdownMenuGroup as ComponentType<unknown>,
    DropdownMenuItem: DropdownMenuItem as ComponentType<unknown>,
    DropdownMenuCheckboxItem: DropdownMenuCheckboxItem as ComponentType<unknown>,
    DropdownMenuLabel: DropdownMenuLabel as ComponentType<unknown>,
    DropdownMenuPortal: DropdownMenuPortal as ComponentType<unknown>,
    DropdownMenuRadioGroup: DropdownMenuRadioGroup as ComponentType<unknown>,
    DropdownMenuRadioItem: DropdownMenuRadioItem as ComponentType<unknown>,
    DropdownMenuSeparator: DropdownMenuSeparator as ComponentType<unknown>,
    DropdownMenuShortcut: DropdownMenuShortcut as ComponentType<unknown>,
    DropdownMenuSub: DropdownMenuSub as ComponentType<unknown>,
    DropdownMenuSubContent: DropdownMenuSubContent as ComponentType<unknown>,
    DropdownMenuSubTrigger: DropdownMenuSubTrigger as ComponentType<unknown>,
    DropdownMenuTrigger: DropdownMenuTrigger as ComponentType<unknown>,
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Basic: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
