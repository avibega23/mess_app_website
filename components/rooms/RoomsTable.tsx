"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, X } from "lucide-react"

import { DataTable } from "@/components/shared/DataTable"
import { DataTableRowActions } from "@/components/shared/DataTableRowAction"
import { TableSkeleton } from "@/components/ui/Skeletons/TableSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"
import { RoomWithOccupancy } from "@/types/rooms/room.types"

function getRoomColumns(
    onView: (room: RoomWithOccupancy) => void
): ColumnDef<RoomWithOccupancy>[] {
    return [
        {
            accessorKey: "roomNo",
            header: "Room",
            cell: ({ row }) => <span className="font-medium">{row.original.roomNo}</span>,
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
            accessorKey: "capacity",
            header: "Capacity",
            cell: ({ row }) => `${row.original.capacity} seater`,
        },
        {
            id: "occupancy",
            header: "Occupancy",
            cell: ({ row }) => `${row.original.occupantCount} / ${row.original.capacity}`,
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) =>
                row.original.occupantCount >= row.original.capacity ? (
                    <Badge variant="secondary">Full</Badge>
                ) : (
                    <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {row.original.capacity - row.original.occupantCount} vacant
                    </Badge>
                ),
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DataTableRowActions
                        row={row.original}
                        actions={[{ label: "View details", icon: Eye, onClick: onView }]}
                    />
                </div>
            ),
        },
    ]
}

export default function RoomsTable() {
    const router = useRouter()
    const [block, setBlock] = useState<string | null>(null)
    const [floor, setFloor] = useState<number | null>(null)
    const [onlyVacant, setOnlyVacant] = useState<boolean | null>(null)

    // filters are passed to the API layer, mirroring the backend contract
    const { data, isLoading, isFetching } = useGetRooms({
        block: block ?? undefined,
        floor: floor ?? undefined,
        onlyVacant: onlyVacant ?? undefined,
    })
    const { data: allRooms } = useGetRooms()

    const blocks = useMemo(
        () => [...new Set((allRooms ?? []).map((r) => r.block))].sort(),
        [allRooms]
    )
    const floors = useMemo(
        () => [...new Set((allRooms ?? []).map((r) => r.floor))].sort((a, b) => a - b),
        [allRooms]
    )

    const hasFilters = block !== null || floor !== null || onlyVacant !== null

    const columns = useMemo(
        () => getRoomColumns((room) => router.push(`/dashboard/room/${room.id}`)),
        [router]
    )

    if (isLoading) {
        return <TableSkeleton />
    }

    const vacantCount = (data ?? []).filter((r) => r.occupantCount < r.capacity).length

    const toolbar = (
        <div className="flex flex-wrap items-center gap-2">
            <Select
                value={block}
                onValueChange={(value) => setBlock(value as string | null)}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="All blocks" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={null}>All blocks</SelectItem>
                    {blocks.map((b) => (
                        <SelectItem key={b} value={b}>
                            Block {b}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={floor}
                onValueChange={(value) => setFloor(value as number | null)}
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="All floors" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={null}>All floors</SelectItem>
                    {floors.map((f) => (
                        <SelectItem key={f} value={f}>
                            Floor {f}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={onlyVacant}
                onValueChange={(value) => setOnlyVacant(value as boolean | null)}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All rooms" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={null}>All rooms</SelectItem>
                    <SelectItem value={true}>With vacancy</SelectItem>
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setBlock(null)
                        setFloor(null)
                        setOnlyVacant(null)
                    }}
                >
                    <X className="size-4" />
                    Reset
                </Button>
            )}
        </div>
    )

    return (
        <div className="container mx-auto space-y-2">
            <div>
                <h1 className="text-2xl font-semibold">Rooms</h1>
                <p className="text-sm text-muted-foreground">
                    {data?.length ?? 0} rooms · {vacantCount} with vacancy
                </p>
            </div>

            <DataTable
                columns={columns}
                data={data ?? []}
                toolbar={toolbar}
                isFetching={isFetching}
                emptyMessage="No rooms match the current filters."
                onRowClick={(room) => router.push(`/dashboard/room/${room.id}`)}
            />
        </div>
    )
}
