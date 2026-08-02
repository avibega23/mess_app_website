"use client"

import { useMemo, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

import { useRecordPayment } from "@/hooks/bills/mutations/useRecordPayment"
import { Bill } from "@/types/bills/bill.types"
import {
    daysLate,
    formatDate,
    formatINR,
    formatMonth,
    lateFineOn,
    todayISO,
} from "@/lib/billing"

interface RecordPaymentDialogProps {
    bill: Bill | null
    onOpenChange: (open: boolean) => void
}

export function RecordPaymentDialog({ bill, onOpenChange }: RecordPaymentDialogProps) {
    const recordPayment = useRecordPayment()
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState(todayISO())
    const [error, setError] = useState<string | null>(null)
    const [lastBillId, setLastBillId] = useState<string | null>(null)

    // reset the form during render whenever a different bill is opened
    if (bill && bill.id !== lastBillId) {
        setLastBillId(bill.id)
        const today = todayISO()
        const lateFine = lateFineOn(bill, today)
        const balance =
            (bill.totalAmount ?? 0) + bill.previousDue + lateFine - bill.paidAmount
        setAmount(String(Math.max(balance, 0)))
        setDate(today)
        setError(null)
    }

    // what the bill looks like if settled on the chosen date
    const projection = useMemo(() => {
        if (!bill || bill.totalAmount === undefined) return null
        const lateFine = lateFineOn(bill, date)
        const amountDue = bill.totalAmount + bill.previousDue + lateFine
        const balance = amountDue - bill.paidAmount
        const late =
            bill.dueDate && bill.lateFinePerDay ? daysLate(bill.dueDate, date) : 0
        return { lateFine, amountDue, balance, late }
    }, [bill, date])

    if (!bill) return null

    const parsedAmount = Number(amount)
    const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0

    const handleSubmit = async () => {
        try {
            await recordPayment.mutateAsync({
                billId: bill.id,
                payment: { amount: parsedAmount, date },
            })
            onOpenChange(false)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <Dialog open={!!bill} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record payment</DialogTitle>
                    <DialogDescription>
                        {bill.studentName} · Room {bill.roomNo} {bill.slot} ·{" "}
                        {formatMonth(bill.month)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-1.5 rounded-md border p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">This month&apos;s bill</span>
                        <span>{formatINR(bill.totalAmount ?? 0)}</span>
                    </div>
                    {bill.previousDue > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Previous dues</span>
                            <span>{formatINR(bill.previousDue)}</span>
                        </div>
                    )}
                    {projection && projection.lateFine > 0 && (
                        <div className="flex justify-between text-destructive">
                            <span>
                                Late fine
                                {projection.late > 0 && bill.dueDate
                                    ? ` (${projection.late} days past ${formatDate(bill.dueDate)})`
                                    : ""}
                            </span>
                            <span>{formatINR(projection.lateFine)}</span>
                        </div>
                    )}
                    {bill.paidAmount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Already paid</span>
                            <span>− {formatINR(bill.paidAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t pt-1.5 font-medium">
                        <span>Balance due</span>
                        <span>{projection ? formatINR(Math.max(projection.balance, 0)) : "—"}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="payment-amount">Amount (₹)</Label>
                        <Input
                            id="payment-amount"
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="payment-date">Payment date</Label>
                        <Input
                            id="payment-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {projection && projection.late > 0 && projection.lateFine > bill.lateFine && (
                    <p className="text-sm text-amber-600 dark:text-amber-500">
                        Paying {projection.late} day{projection.late > 1 ? "s" : ""} late adds a{" "}
                        {formatINR(projection.lateFine - bill.lateFine)} late fine.
                    </p>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!amountValid || recordPayment.isPending}
                    >
                        {recordPayment.isPending ? <Spinner /> : "Record Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
