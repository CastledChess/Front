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
import i18next from 'i18next';
import { deleteGame } from '@/api/history';

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
        {i18next.t('history:result')}
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
        {i18next.t('history:date')}
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
              {i18next.t('history:copyId')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href={`/analysis/${gameDetails.id}`} target="_blank" rel="noreferrer">
                {i18next.t('history:analysis')}
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div onClick={() => deleteGame(gameDetails.id)}>{i18next.t('history:delete')}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
