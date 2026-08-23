"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, IndianRupee } from "lucide-react"

import { DataTable } from "@/components/shared/DataTable"
import { DataTableRowActions } from "@/components/shared/DataTableRowAction"
import { BillStatusBadge } from "@/components/shared/BillStatusBadge"
import { MonthPicker } from "@/components/shared/MonthPicker"
import { RecordPaymentDialog } from "@/components/bills/RecordPaymentDialog"

import { useGetBills } from "@/hooks/bills/queries/useGetBills"
import { Bill } from "@/types/bills/bill.types"
import {
  billAmountDue,
  billBalance,
  formatDate,
  formatINR,
  formatMonth,
} from "@/lib/billing"

interface BillColumnActions {
  onViewStudent: (bill: Bill) => void
  onRecordPayment: (bill: Bill) => void
}

function getBillColumns({
  onViewStudent,
  onRecordPayment,
}: BillColumnActions): ColumnDef<Bill>[] {
  return [
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.studentName}</span>
      ),
    },
    {
      id: "room",
      header: "Room",
      cell: ({ row }) => `${row.original.roomNo} ${row.original.slot}`,
    },
    {
      accessorKey: "canteenBill",
      header: () => <div className="text-right">Canteen</div>,
      cell: ({ row }) => (
        <div className="text-right">{formatINR(row.original.canteenBill)}</div>
      ),
    },
    {
      accessorKey: "dietCount",
      header: () => <div className="text-right">Diets</div>,
      cell: ({ row }) => <div className="text-right">{row.original.dietCount}</div>,
    },
    {
      accessorKey: "specialDietCount",
      header: () => <div className="text-right">Special</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.original.specialDietCount}</div>
      ),
    },
    {
      id: "amountDue",
      header: () => <div className="text-right">Amount Due</div>,
      cell: ({ row }) => {
        const due = billAmountDue(row.original)
        return (
          <div className="text-right">
            {due !== null ? formatINR(due) : "—"}
            {row.original.previousDue > 0 && (
              <p className="text-xs text-muted-foreground">
                incl. {formatINR(row.original.previousDue)} prev. due
              </p>
            )}
          </div>
        )
      },
    },
    {
      id: "balance",
      header: () => <div className="text-right">Balance</div>,
      cell: ({ row }) => {
        const balance = billBalance(row.original)
        if (balance === null) return <div className="text-right">—</div>
        return (
          <div
            className={
              "text-right font-medium" +
              (balance > 0 ? " text-destructive" : "")
            }
          >
            {formatINR(Math.max(balance, 0))}
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <BillStatusBadge bill={row.original} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DataTableRowActions
            row={row.original}
            actions={[
              { label: "View student", icon: Eye, onClick: onViewStudent },
              {
                label: "Record payment",
                icon: IndianRupee,
                onClick: onRecordPayment,
                hidden: (bill) =>
                  !bill.generated ||
                  !!bill.carriedForward ||
                  (billBalance(bill) ?? 0) <= 0,
              },
            ]}
          />
        </div>
      ),
    },
  ]
}

export default function BillsTable() {
  const router = useRouter()
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [page, setPage] = useState(1)
  const [paymentBill, setPaymentBill] = useState<Bill | null>(null)

  const { data, isLoading, isFetching } = useGetBills({ month, page, pageSize: 10 })

  const columns = useMemo(
    () =>
      getBillColumns({
        onViewStudent: (bill) => router.push(`/dashboard/student/${bill.studentId}`),
        onRecordPayment: setPaymentBill,
      }),
    [router]
  )

  const monthGenerated = data?.data.every((b) => b.generated) ?? false
  const dueDate = data?.data.find((b) => b.dueDate)?.dueDate

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <MonthPicker
        months={MONTHS}
        value={month}
        onChange={(m) => {
          setMonth(m)
          setPage(1)
        }}
      />
      {monthGenerated && dueDate && (
        <p className="text-sm text-muted-foreground">
          Last date to pay: {formatDate(dueDate)}
        </p>
      )}
      {!monthGenerated && (data?.data.length ?? 0) > 0 && (
        <p className="text-sm text-muted-foreground">
          Diet prices not applied yet — generate {formatMonth(month)} from the
          Receipts section.
        </p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto space-y-2">
      <div>
        <h1 className="text-2xl font-semibold">Bills</h1>
        <p className="text-sm text-muted-foreground">
          Month-wise canteen bills and diet counts per student
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        toolbar={toolbar}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={`No bills for ${formatMonth(month)}.`}
        pagination={
          data
            ? {
              page: data.page,
              pageSize: data.pageSize,
              total: data.total,
              totalPages: data.totalPages,
              onPageChange: setPage,
            }
            : undefined
        }
      />

      <RecordPaymentDialog
        bill={paymentBill}
        onOpenChange={(open) => !open && setPaymentBill(null)}
      />
    </div>
  )
}
