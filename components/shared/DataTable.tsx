"use client"

import { Button } from "@/components/ui/button"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ServerPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Rendered above the table — filters, search, CTAs */
  toolbar?: React.ReactNode
  /** When provided, pagination is server-driven; otherwise falls back to client-side */
  pagination?: ServerPagination
  /** Dims the table while a background refetch is in flight */
  isFetching?: boolean
  onRowClick?: (row: TData) => void
  emptyMessage?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  pagination,
  isFetching,
  onRowClick,
  emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination
      ? { manualPagination: true, pageCount: pagination.totalPages }
      : { getPaginationRowModel: getPaginationRowModel() }),
  })

  const canPrevious = pagination ? pagination.page > 1 : table.getCanPreviousPage()
  const canNext = pagination
    ? pagination.page < pagination.totalPages
    : table.getCanNextPage()

  const rangeStart = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : undefined
  const rangeEnd = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.total)
    : undefined

  return (
    <div className="space-y-4">
      {toolbar}
      <div
        className={
          "overflow-hidden rounded-md border transition-opacity" +
          (isFetching ? " opacity-60" : "")
        }
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-1">
        <p className="text-sm text-muted-foreground">
          {pagination && pagination.total > 0
            ? `Showing ${rangeStart}–${rangeEnd} of ${pagination.total}`
            : null}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(pagination.page - 1)
                : table.previousPage()
            }
            disabled={!canPrevious}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(pagination.page + 1)
                : table.nextPage()
            }
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
