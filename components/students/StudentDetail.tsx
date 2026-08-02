"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

import { BillStatusBadge } from "@/components/shared/BillStatusBadge"
import { StudentFormDialog } from "@/components/students/StudentFormDialog"
import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog"

import { useGetStudent } from "@/hooks/students/queries/useGetStudent"
import { useGetStudentBills } from "@/hooks/students/queries/useGetStudentBills"
import { billBalance, formatINR, formatMonth } from "@/lib/billing"

export default function StudentDetail({ id }: { id: string }) {
    const router = useRouter()
    const { data: student, isLoading, isError } = useGetStudent(id)
    const { data: bills, isLoading: billsLoading } = useGetStudentBills(id)

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="container mx-auto space-y-6 py-10">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (isError || !student) {
        return (
            <div className="container mx-auto flex flex-col items-start gap-4 py-10">
                <p className="text-muted-foreground">Student not found.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard/student")}>
                    <ChevronLeft className="size-4" />
                    Back to Students
                </Button>
            </div>
        )
    }

    // carried-forward bills are excluded — their balance lives in the next month
    const unpaidTotal = (bills ?? [])
        .filter((b) => b.generated && !b.carriedForward)
        .reduce((sum, b) => sum + Math.max(billBalance(b) ?? 0, 0), 0)

    return (
        <div className="container mx-auto space-y-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard/student")}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{student.username}</h1>
                        <p className="text-sm text-muted-foreground">
                            Room {student.roomNo} {student.slot} · Block {student.block} · Floor{" "}
                            {student.floor}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setEditOpen(true)}>
                        <Pencil className="size-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="size-4" />
                        Remove
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Father&apos;s Name</span>
                            <span className="font-medium">{student.fatherName}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Mobile No</span>
                            <span className="font-medium">{student.mobileNo}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Room</span>
                            <span className="font-medium">
                                {student.roomNo} {student.slot}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Block / Floor</span>
                            <span className="font-medium">
                                {student.block} / {student.floor}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Outstanding</span>
                            {unpaidTotal > 0 ? (
                                <Badge variant="destructive">{formatINR(unpaidTotal)} due</Badge>
                            ) : (
                                <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    All clear
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Bill History</CardTitle>
                        <CardDescription>
                            Month-wise mess bills and payment status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {billsLoading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : (
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead className="text-right">Canteen</TableHead>
                                            <TableHead className="text-right">Diets</TableHead>
                                            <TableHead className="text-right">Special</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Paid</TableHead>
                                            <TableHead className="text-right">Balance</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(bills ?? []).map((bill) => {
                                            const balance = billBalance(bill)
                                            return (
                                                <TableRow key={bill.id}>
                                                    <TableCell className="font-medium">
                                                        {formatMonth(bill.month)}
                                                        {bill.previousDue > 0 && (
                                                            <p className="text-xs font-normal text-muted-foreground">
                                                                incl. {formatINR(bill.previousDue)} prev. due
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatINR(bill.canteenBill)}
                                                    </TableCell>
                                                    <TableCell className="text-right">{bill.dietCount}</TableCell>
                                                    <TableCell className="text-right">
                                                        {bill.specialDietCount}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {bill.generated && bill.totalAmount !== undefined
                                                            ? formatINR(
                                                                bill.totalAmount + bill.previousDue + bill.lateFine
                                                            )
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {bill.generated ? formatINR(bill.paidAmount) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {balance !== null ? (
                                                            <span
                                                                className={
                                                                    balance > 0 && !bill.carriedForward
                                                                        ? "font-medium text-destructive"
                                                                        : undefined
                                                                }
                                                            >
                                                                {formatINR(Math.max(balance, 0))}
                                                            </span>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <BillStatusBadge bill={bill} />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {!bills?.length && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-24 text-center">
                                                    No bills yet.
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

            <StudentFormDialog open={editOpen} onOpenChange={setEditOpen} student={student} />
            <DeleteStudentDialog
                student={deleteOpen ? student : null}
                onOpenChange={(open) => !open && setDeleteOpen(false)}
                onDeleted={() => router.push("/dashboard/student")}
            />
        </div>
    )
}
