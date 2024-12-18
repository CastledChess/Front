'use client';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import {
  SortingState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import Moment from 'moment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { GameDetails } from './columns';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData extends GameDetails>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const { t } = useTranslation('history');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Important pour activer le tri
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting, // Met à jour l'état du tri
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  console.log('DEBUG_1', header.column.columnDef.header);
                  return (
                    <TableHead key={header.id}>
                      {/* {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())} */}
                      {header.column.id === 'select'
                        ? flexRender(header.column.columnDef.header, header.getContext())
                        : null}
                      {header.column.id === 'players' ? t(String(header.column.columnDef.header).toLowerCase()) : null}
                      {header.column.id === 'header_Result'
                        ? flexRender(header.column.columnDef.header, header.getContext())
                        : null}
                      {header.column.id === 'moves' ? t(String(header.column.id).toLowerCase()) : null}
                      {header.column.id === 'header_Date' ? t('date') : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'select' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                      {cell.column.id === 'players' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                      {cell.column.id === 'header_Result'
                        ? t(String(cell.row.original.header.Result).toLowerCase())
                        : null}
                      {cell.column.id === 'moves' ? cell.row.original.header.Round : null}
                      {cell.column.id === 'header_Date'
                        ? Moment(cell.row.original.header.Date).format(' DD / MM / YYYY')
                        : null}
                      {cell.column.id === 'actions' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
