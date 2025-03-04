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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { format, parse } from 'date-fns';
import { Analysis } from '@/types/analysis.ts';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrowserView } from 'react-device-detect';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

/**
 * DataTable component for displaying and managing a table with sorting, pagination, and row selection capabilities.
 *
 * @template TData - The type of data being displayed in the table, extending GameDetails.
 * @param {DataTableProps<TData>} props - The properties for the DataTable component.
 * @param {ColumnDef<TData>[]} props.columns - The column definitions for the table.
 * @param {TData[]} props.data - The data to be displayed in the table.
 *
 * @returns {JSX.Element} The rendered DataTable component.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { accessorKey: 'name', header: 'Name' },
 *   { accessorKey: 'age', header: 'Age' },
 * ];
 * const data = [
 *   { name: 'John Doe', age: 30 },
 *   { name: 'Jane Smith', age: 25 },
 * ];
 *
 * <DataTable columns={columns} data={data} />
 * ```
 */

export function DataTable<TData extends Analysis>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData> & { isLoading?: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const { t } = useTranslation('history');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Important pour activer le tri
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting, // Met à jour l'état du tri
  });

  return (
    <>
      <div className="rounded-md border overflow-y-auto custom-scrollbar h-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                      {/* {header.column.id === 'moves' ? t(String(header.column.id).toLowerCase()) : null} */}

                      <BrowserView>{header.column.id === 'header_Date' ? t('date') : null}</BrowserView>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'select' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                      {cell.column.id === 'players' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                      {cell.column.id === 'header_Result'
                        ? t(String(cell.row.original.header.Termination).toLowerCase())
                        : null}
                      {/* {cell.column.id === 'moves' ? cell.row.original.header.Round : null} */}
                      <BrowserView>
                        {cell.column.id === 'header_Date'
                          ? format(
                              cell.row.original.header.Date
                                ? parse(cell.row.original.header.Date, 'yyyy.MM.dd', new Date())
                                : new Date(),
                              'dd / MM / yyyy',
                            )
                          : null}
                      </BrowserView>
                      {cell.column.id === 'actions' ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && table.getRowModel().rows?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24  text-center">
                  <Link to="/start-analysis">
                    <Button variant="outline">
                      <Plus />
                      New Analysis
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {t('previous')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {t('next')}
        </Button>
      </div>
    </>
  );
}
