'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Link } from 'react-router-dom';
import { Analysis } from '@/types/analysis';
import { useHistoryState } from '@/store/history.ts';

/**
 * Defines the column configuration for the GameDetails table.
 *
 * @type {ColumnDef<Analysis>[]}
 *
 * @property {Object} id - The column definition for the selection checkbox.
 * @property {Function} id.header - Renders the header checkbox for selecting all rows.
 * @property {Function} id.cell - Renders the checkbox for selecting individual rows.
 *
 * @property {Object} accessorKey - The column definition for displaying players.
 * @property {string} accessorKey.players - The key for accessing player data.
 * @property {string} accessorKey.header - The header title for the players column.
 * @property {Function} accessorKey.cell - Renders the cell content for players.
 *
 * @property {Object} accessorKey - The column definition for displaying the result.
 * @property {string} accessorKey.header.Result - The key for accessing result data.
 * @property {Function} accessorKey.header - Renders the header with sorting functionality for the result column.
 * @property {boolean} accessorKey.enableSorting - Enables sorting for the result column.
 *
 * @property {Object} accessorKey - The column definition for displaying moves.
 * @property {string} accessorKey.moves - The key for accessing moves data.
 * @property {Function} accessorKey.header - Renders the header with sorting functionality for the moves column.
 *
 * @property {Object} accessorKey - The column definition for displaying the date.
 * @property {string} accessorKey.header.Date - The key for accessing date data.
 * @property {Function} accessorKey.header - Renders the header with sorting functionality for the date column.
 * @property {boolean} accessorKey.enableSorting - Enables sorting for the date column.
 *
 * @property {Object} id - The column definition for the actions dropdown menu.
 * @property {Function} id.cell - Renders the actions dropdown menu for each row.
 */
export const columns: ColumnDef<Analysis>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
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
  // {
  //   accessorKey: 'moves',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Moves
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
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

      const handleDeleteGame = async () => {
        try {
          await deleteGame(gameDetails.id as string);

          useHistoryState
            .getState()
            .setAnalyses((prevAnalyses) => prevAnalyses.filter((analysis) => analysis.id !== gameDetails.id));
        } catch (err) {
          console.error(err);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(gameDetails.id as string)}>
              {i18next.t('history:copyId')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/analysis/${gameDetails.id}`} rel="noreferrer">
                {i18next.t('history:analysis')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteGame}>{i18next.t('history:delete')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
