"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

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
  /** Renders skeleton rows in place of data cells for the initial load */
  isLoading?: boolean
  /** Number of skeleton rows to show while isLoading — defaults to the page size */
  skeletonRowCount?: number
  onRowClick?: (row: TData) => void
  emptyMessage?: string
  /** Called with the largest page size that fills the available height */
  onPageSizeChange?: (pageSize: number) => void
  /** Height of a single data row in px used to compute the page size */
  rowHeight?: number
  /** Fixed extra height (toolbar + pagination + gaps) not available to rows */
  reservedHeight?: number
  /** Minimum page size to request from the server */
  minPageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  pagination,
  isFetching,
  isLoading,
  skeletonRowCount = pagination?.pageSize ?? 8,
  onRowClick,
  emptyMessage = "No results.",
  onPageSizeChange,
  rowHeight = 48,
  reservedHeight = 0,
  minPageSize = 5,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination
      ? { manualPagination: true, pageCount: pagination.totalPages }
      : { getPaginationRowModel: getPaginationRowModel() }),
  })

  const bodyRef = useRef<HTMLDivElement>(null)
  const onPageSizeChangeRef = useRef(onPageSizeChange)
  const lastPageSizeRef = useRef<number>(minPageSize)
  useEffect(() => {
    onPageSizeChangeRef.current = onPageSizeChange
  }, [onPageSizeChange])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    const compute = () => {
      const rows = Math.max(
        minPageSize,
        Math.floor((el.clientHeight - reservedHeight) / rowHeight)
      )
      if (rows !== lastPageSizeRef.current) {
        lastPageSizeRef.current = rows
        onPageSizeChangeRef.current?.(rows)
      }
    }

    compute()

    const observer = new ResizeObserver(compute)
    observer.observe(el)
    return () => observer.disconnect()
  }, [rowHeight, reservedHeight, minPageSize])

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
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      <div className="flex-shrink-0">{toolbar}</div>
      <div
        ref={bodyRef}
        className={
          "flex-1 min-h-0 overflow-auto rounded-md border transition-opacity" +
          (isFetching ? " opacity-60" : "")
        }
      >
        <Table className="h-full">
          <TableHeader className="sticky top-0 z-10 bg-background">
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
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
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
      <div className="flex-shrink-0 flex items-center justify-between py-1">
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
            disabled={!canPrevious || isLoading}
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
            disabled={!canNext || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
