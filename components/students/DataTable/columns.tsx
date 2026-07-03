"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Student } from "@/types/students/student.types"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "@/components/shared/DataTableRowAction"

interface StudentColumnActions {
    onView: (student: Student) => void
    onEdit: (student: Student) => void
    onDelete: (student: Student) => void
}

export function getStudentColumns({
    onView,
    onEdit,
    onDelete,
}: StudentColumnActions): ColumnDef<Student>[] {
    return [
        {
            accessorKey: "username",
            header: "Name",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.username}</span>
            ),
        },
        {
            accessorKey: "fatherName",
            header: "Father's Name",
        },
        {
            accessorKey: "mobileNo",
            header: "Mobile No",
        },
        {
            id: "room",
            header: "Room",
            cell: ({ row }) => `${row.original.roomNo} ${row.original.slot}`,
        },
        {
            accessorKey: "block",
            header: "Block",
            cell: ({ row }) => <Badge variant="outline">Block {row.original.block}</Badge>,
        },
        {
            accessorKey: "floor",
            header: "Floor",
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DataTableRowActions
                        row={row.original}
                        actions={[
                            { label: "View details", icon: Eye, onClick: onView },
                            { label: "Edit", icon: Pencil, onClick: onEdit },
                            {
                                label: "Remove",
                                icon: Trash2,
                                onClick: onDelete,
                                variant: "destructive",
                                separatorBefore: true,
                            },
                        ]}
                    />
                </div>
            ),
        },
    ]
}
