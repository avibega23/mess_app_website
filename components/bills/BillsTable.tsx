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
import { Button } from "@/components/ui/button"

import { useGetBills } from "@/hooks/bills/queries/useGetBills"
import { Bill } from "@/types/bills/bill.types"
import {
  billAmountDue,
  billBalance,
  CURRENT_MONTH,
  formatDate,
  formatINR,
  formatMonth,
  MONTHS,
} from "@/lib/billing"
import { getErrorMessage } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

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
        <span className="font-medium">
          {row.original.studentName || "—"}
        </span>
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
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const bill = row.original
        const canPay =
          bill.generated &&
          !bill.carriedForward &&
          (billBalance(bill) ?? 0) > 0

        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2"
              disabled={!bill.studentId}
              title="View student"
              onClick={() => onViewStudent(bill)}
            >
              <Eye className="size-4" />
              View
            </Button>
            <DataTableRowActions
              row={bill}
              actions={[
                {
                  label: "Record payment",
                  icon: IndianRupee,
                  onClick: onRecordPayment,
                  hidden: () => !canPay,
                },
              ]}
            />
          </div>
        )
      },
    },
  ]
}

export default function BillsTable() {
  const router = useRouter()
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [page, setPage] = useState(1)
  const [paymentBill, setPaymentBill] = useState<Bill | null>(null)

  const messId = useAuthStore((state) => state.user?.messId)
  const { data, isLoading, isFetching, isError, error, refetch } = useGetBills({
    month,
    messId,
    page,
    pageSize: 10,
  })

  const bills = data?.data ?? []

  const columns = useMemo(
    () =>
      getBillColumns({
        onViewStudent: (bill) => {
          if (!bill.studentId) return
          router.push(`/student/${bill.studentId}`)
        },
        onRecordPayment: setPaymentBill,
      }),
    [router]
  )

  const monthGenerated = bills.length > 0 && bills.every((b) => b.generated)
  const dueDate = bills.find((b) => b.dueDate)?.dueDate

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
      {!monthGenerated && bills.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Diet prices not applied yet — generate {formatMonth(month)} from the
          Receipts section.
        </p>
      )}
    </div>
  )

  const emptyMessage = isError
    ? getErrorMessage(error, "Failed to load bills.")
    : `No bills for ${formatMonth(month)}.`

  return (
    <div className="container mx-auto space-y-2">
      <div>
        <h1 className="text-2xl font-semibold">Bills</h1>
        <p className="text-sm text-muted-foreground">
          Month-wise canteen bills and diet counts per student
        </p>
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Couldn’t load bills.{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      )}

      <DataTable
        columns={columns}
        data={bills}
        toolbar={toolbar}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={emptyMessage}
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
