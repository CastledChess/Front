'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface GameDetails {
  createdAt: string;
  header: {
    Black: string;
    White: string;
    BlackElo: string;
    WhiteElo: string;
    Result: string;
    Date: string;
    Round: string;
  };
  id: string;
  pgn: string;
}

export const columns: ColumnDef<GameDetails>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'players',
    header: 'Players',
    cell: ({ row }) => `${row.original.header.White} vs ${row.original.header.Black}`,
  },
  {
    accessorKey: 'header.Result',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Result
        {column.getIsSorted() === 'asc' && <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />}
        {column.getIsSorted() === 'desc' && <ArrowUpDown className="ml-2 h-4 w-4" />}
        {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'moves',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Moves
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'header.Date',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Date
        {column.getIsSorted() === 'asc' && <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />}
        {column.getIsSorted() === 'desc' && <ArrowUpDown className="ml-2 h-4 w-4" />}
        {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
      </Button>
    ),
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const gameDetails = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(gameDetails.id)}>
              Copy Game Details ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View game details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
