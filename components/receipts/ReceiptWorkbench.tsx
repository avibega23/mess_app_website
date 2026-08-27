"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, IndianRupee, Sparkles } from "lucide-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { BillStatusBadge } from "@/components/shared/BillStatusBadge"
import { MonthPicker } from "@/components/shared/MonthPicker"
import { RecordPaymentDialog } from "@/components/bills/RecordPaymentDialog"

import { useGetMonthBills } from "@/hooks/bills/queries/useGetMonthBills"
import { useGenerateBills } from "@/hooks/bills/mutations/useGenerateBills"

import {
  billAmountDue,
  billBalance,
  computeReceipt,
  CURRENT_MONTH,
  defaultDueDate,
  formatDate,
  formatINR,
  formatMonth,
  lateFineOn,
  MONTHS,
  todayISO,
} from "@/lib/billing"
import { Bill, BillStatus } from "@/types/bills/bill.types"
import {
  DEFAULT_RECEIPT_RULES,
  ReceiptRules,
  ReceiptRulesSchema,
} from "@/types/receipts/receipt.types"

interface ReceiptRow {
  billId: string
  studentName: string
  room: string
  canteenBill: number
  dietLabel: string
  specialLabel: string
  fine: number
  prevDue: number
  amountDue: number | null
  paid: number
  balance: number | null
  status: BillStatus
  generated: boolean
  carriedForward: boolean
}

function countLabel(count: number, billed: number) {
  return billed > count ? `${count} → ${billed}` : `${count}`
}

export default function ReceiptWorkbench() {
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)
  const [paymentBill, setPaymentBill] = useState<Bill | null>(null)

  const monthIndex = MONTHS.indexOf(month)
  const prevMonth = monthIndex > 0 ? MONTHS[monthIndex - 1] : null

  const { data: bills, isLoading } = useGetMonthBills(month)
  const { data: prevBills } = useGetMonthBills(prevMonth ?? "")
  const generateBills = useGenerateBills()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReceiptRules>({
    resolver: zodResolver(ReceiptRulesSchema),
    mode: "onChange",
    defaultValues: { ...DEFAULT_RECEIPT_RULES, dueDate: defaultDueDate(CURRENT_MONTH) },
  })

  useEffect(() => {
    setValue("dueDate", defaultDueDate(month))
  }, [month, setValue])

  const rules = watch()
  const rulesValid = ReceiptRulesSchema.safeParse(rules).success

  const monthGenerated = useMemo(
    () => (bills?.length ? bills.every((b) => b.generated) : false),
    [bills]
  )

  // outstanding balance per student from last month, projected to today —
  // this is what generation will carry into the new bills
  const projectedCarry = useMemo(() => {
    const carry = new Map<string, number>()
    for (const prev of prevBills ?? []) {
      if (!prev.generated || prev.carriedForward) continue
      const withLateFine: Bill = { ...prev, lateFine: lateFineOn(prev, todayISO()) }
      const leftover = billBalance(withLateFine) ?? 0
      if (leftover > 0) carry.set(prev.studentId, leftover)
    }
    return carry
  }, [prevBills])

  // generated months show the stored amounts; ungenerated months preview live
  const rows: ReceiptRow[] = useMemo(() => {
    if (!bills) return []
    return bills.map((bill) => {
      const base = {
        billId: bill.id,
        studentName: bill.studentName,
        room: `${bill.roomNo} ${bill.slot}`,
        canteenBill: bill.canteenBill,
        status: bill.status,
        generated: bill.generated,
        carriedForward: !!bill.carriedForward,
      }
      if (bill.generated) {
        return {
          ...base,
          dietLabel: `${bill.dietCount}`,
          specialLabel: `${bill.specialDietCount}`,
          fine: (bill.fine ?? 0) + bill.lateFine,
          prevDue: bill.previousDue,
          amountDue: billAmountDue(bill),
          paid: bill.paidAmount,
          balance: billBalance(bill),
        }
      }
      const prevDue = projectedCarry.get(bill.studentId) ?? 0
      if (!rulesValid) {
        return {
          ...base,
          dietLabel: `${bill.dietCount}`,
          specialLabel: `${bill.specialDietCount}`,
          fine: 0,
          prevDue,
          amountDue: null,
          paid: 0,
          balance: null,
        }
      }
      const computed = computeReceipt(bill, { ...rules, month })
      return {
        ...base,
        dietLabel: countLabel(computed.dietCount, computed.billedDietCount),
        specialLabel: countLabel(
          computed.specialDietCount,
          computed.billedSpecialDietCount
        ),
        fine: computed.fine,
        prevDue,
        amountDue: computed.total + prevDue,
        paid: 0,
        balance: computed.total + prevDue,
      }
    })
  }, [bills, rules, rulesValid, month, projectedCarry])

  const grandTotal = rows.reduce((sum, r) => sum + (r.amountDue ?? 0), 0)
  const totalPrevDue = rows.reduce((sum, r) => sum + r.prevDue, 0)
  const collected = rows.reduce((sum, r) => (r.generated ? sum + r.paid : sum), 0)
  const printable = rows.length > 0 && rows.every((r) => r.amountDue !== null)

  const handleGenerate = () => {
    if (monthGenerated) {
      setConfirmRegenerate(true)
      return
    }
    generateBills.mutate({ ...rules, month })
  }

  const openPayment = (row: ReceiptRow) => {
    const bill = bills?.find((b) => b.id === row.billId)
    if (bill) setPaymentBill(bill)
  }

  const numberField = (name: keyof ReceiptRules, label: string) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="number"
        {...register(name, { valueAsNumber: true })}
      />
      {errors[name] && (
        <p className="text-xs text-destructive">{errors[name]?.message}</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Apply diet prices, thresholds and fines, then generate the month&apos;s
            bills
          </p>
        </div>
        <MonthPicker months={MONTHS} value={month} onChange={setMonth} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Rules</CardTitle>
            <CardDescription>
              Set after the month ends, once diet prices are known
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {numberField("dietPrice", "Diet price (₹)")}
              {numberField("specialDietPrice", "Special diet price (₹)")}
              {numberField("dietThreshold", "Min diets billed")}
              {numberField("specialDietThreshold", "Min special diets")}
              {numberField("fineThresholdAmount", "Fine above (₹)")}
              {numberField("finePercent", "Fine (%)")}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dueDate">Last date to pay</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
                {errors.dueDate && (
                  <p className="text-xs text-destructive">{errors.dueDate.message}</p>
                )}
              </div>
              {numberField("lateFinePerDay", "Late fine (₹/day)")}
            </div>
            <p className="text-xs text-muted-foreground">
              Students below the diet thresholds are billed at the threshold
              count. Bills above the fine limit get the percentage fine. After
              the last date, the per-day late fine accrues; anything still
              unpaid rolls into next month&apos;s bill.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!rulesValid || !rows.length || generateBills.isPending}
              >
                {generateBills.isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {monthGenerated ? "Regenerate Bills" : "Generate Bills"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                disabled={!printable}
              >
                <FileDown className="size-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Students billed</CardDescription>
                <CardTitle className="text-2xl">{rows.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total due</CardDescription>
                <CardTitle className="text-2xl">
                  {printable ? formatINR(grandTotal) : "—"}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Carried dues</CardDescription>
                <CardTitle className="text-2xl">{formatINR(totalPrevDue)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collected</CardDescription>
                <CardTitle className="text-2xl">{formatINR(collected)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {monthGenerated ? "Generated Bills" : "Preview"} ·{" "}
                {formatMonth(month)}
              </CardTitle>
              <CardDescription>
                {monthGenerated
                  ? "Amounts are final — record payments as students clear them."
                  : "Live preview with the current pricing. Diets shown as actual → billed when a threshold applies. Prev. due comes from last month's unpaid balance."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead className="text-right">Canteen</TableHead>
                        <TableHead className="text-right">Diets</TableHead>
                        <TableHead className="text-right">Special</TableHead>
                        <TableHead className="text-right">Fines</TableHead>
                        <TableHead className="text-right">Prev. Due</TableHead>
                        <TableHead className="text-right">Total Due</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.billId}>
                          <TableCell className="font-medium">
                            {row.studentName}
                          </TableCell>
                          <TableCell>{row.room}</TableCell>
                          <TableCell className="text-right">
                            {formatINR(row.canteenBill)}
                          </TableCell>
                          <TableCell className="text-right">{row.dietLabel}</TableCell>
                          <TableCell className="text-right">
                            {row.specialLabel}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.fine > 0 ? formatINR(row.fine) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.prevDue > 0 ? formatINR(row.prevDue) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {row.amountDue !== null ? formatINR(row.amountDue) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.balance !== null
                              ? formatINR(Math.max(row.balance, 0))
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <BillStatusBadge
                              bill={{
                                status: row.status,
                                generated: row.generated,
                                carriedForward: row.carriedForward,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {row.generated &&
                              !row.carriedForward &&
                              (row.balance ?? 0) > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openPayment(row)}
                                >
                                  <IndianRupee className="size-4" />
                                  Record
                                </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {!rows.length && (
                        <TableRow>
                          <TableCell colSpan={11} className="h-24 text-center">
                            No bills for {formatMonth(month)}.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Only this area is visible when printing / saving as PDF */}
      <div className="receipt-print-area hidden">
        <h1 className="text-xl font-bold">Mess Bills — {formatMonth(month)}</h1>
        <p className="mb-4 text-sm">
          Generated on {formatDate(todayISO())} · {rows.length} students · Grand
          total {printable ? formatINR(grandTotal) : "—"}
          {rules.dueDate ? ` · Last date to pay: ${formatDate(rules.dueDate)}` : ""}
        </p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["#", "Student", "Room", "Canteen", "Diets", "Special", "Fines", "Prev. Due", "Total Due", "Status"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="border border-black px-2 py-1 text-left"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.billId}>
                <td className="border border-black px-2 py-1">{index + 1}</td>
                <td className="border border-black px-2 py-1">{row.studentName}</td>
                <td className="border border-black px-2 py-1">{row.room}</td>
                <td className="border border-black px-2 py-1 text-right">
                  {formatINR(row.canteenBill)}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {row.dietLabel}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {row.specialLabel}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {row.fine > 0 ? formatINR(row.fine) : "—"}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {row.prevDue > 0 ? formatINR(row.prevDue) : "—"}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {row.amountDue !== null ? formatINR(row.amountDue) : "—"}
                </td>
                <td className="border border-black px-2 py-1">
                  {!row.generated
                    ? "Preview"
                    : row.status === "PAID"
                      ? "Paid"
                      : row.status === "PARTIAL"
                        ? "Partial"
                        : "Unpaid"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={confirmRegenerate} onOpenChange={setConfirmRegenerate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Regenerate {formatMonth(month)} bills?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This month was already generated. Regenerating overwrites every
              bill&apos;s charges with the current pricing. Payments and carried
              dues are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setConfirmRegenerate(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                generateBills.mutate({ ...rules, month })
                setConfirmRegenerate(false)
              }}
            >
              Regenerate
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RecordPaymentDialog
        bill={paymentBill}
        onOpenChange={(open) => !open && setPaymentBill(null)}
      />
    </div>
  )
}
