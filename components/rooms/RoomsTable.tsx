"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, X } from "lucide-react"

import { DataTable } from "@/components/shared/DataTable"
import { DataTableRowActions } from "@/components/shared/DataTableRowAction"
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
import { FloorData } from "@/types/auth/auth.types"
import { useAuthStore } from "@/store/authStore"
import { useGetFloors } from "@/hooks/floors/queries/useGetFloors"

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
      cell: ({ row }) => <Badge variant="outline">Block {row.original.messId.messBlock}</Badge>,
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
      cell: ({ row }) => `${row.original.occupiedCount} / ${row.original.capacity}`,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.occupiedCount >= row.original.capacity ? (
          <Badge variant="secondary">Full</Badge>
        ) : (
          <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {row.original.capacity - row.original.occupiedCount} vacant
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
  const user = useAuthStore((state) => state.user)
  const [floor, setFloor] = useState<FloorData | null>(null)
  const [onlyVacant, setOnlyVacant] = useState<boolean | null>(null)
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(15);

  const { data, isLoading, isFetching } = useGetRooms({
    messId: user?.messId ?? undefined,
    floor: floor?.floorNo ?? undefined,
    vacant: onlyVacant ? "true" : "false",
    pageLimit,
    pageNo: page
  })


  const { data: floorData } = useGetFloors(user?.messId ?? "");
  const floorOptions = floorData ?? [];

  const hasFilters = floor !== null || onlyVacant !== null

  const columns = useMemo(
    () => getRoomColumns((room) => router.push(`/room/${room._id}`)),
    [router]
  )

  const vacantCount = (data?.data ?? []).filter((r) => r.occupiedCount < r.capacity).length

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline">Block {user?.messBlock || "—"}</Badge>

      <Select
        value={floor}
        onValueChange={(value) => {
          setFloor(value as FloorData | null)
          setPage(1);
        }}
        itemToStringLabel={(f) => `Floor ${f.floorNo}`}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All floors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All floors</SelectItem>
          {floorOptions.map((f) => (
            <SelectItem key={f._id} value={f}>
              Floor {f.floorNo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={onlyVacant}
        onValueChange={(value) => {
          setOnlyVacant(value as boolean | null)
          setPage(1);
        }}
        itemToStringLabel={(value) => value ? "Vacant Only" : "All Rooms"}
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
            setFloor(null)
            setOnlyVacant(null)
            setPage(1);
          }}
        >
          <X className="size-4" />
          Reset
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto h-full flex flex-col gap-2">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading rooms…"
            : `Block ${user?.messBlock || "—"} · ${data?.data.length ?? 0} rooms · ${vacantCount} with vacancy`}
        </p>
      </div>

      <DataTable
        onPageSizeChange={(size) => {
          setPageLimit(size)
          setPage(1)
        }}
        pagination={{
          page: data?.currentPage ?? 0,
          pageSize: data?.limit ?? 0,
          total: data?.total ?? 0,
          totalPages: data?.totalPages ?? 0,
          onPageChange: (page) => setPage(page)
        }}
        columns={columns}
        data={data?.data ?? []}
        toolbar={toolbar}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No rooms match the current filters."
        onRowClick={(room) => router.push(`/room/${room._id}`)}
      />
    </div>
  )
}
