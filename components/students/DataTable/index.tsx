"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Trash2, X } from "lucide-react"

import { DataTable } from "@/components/shared/DataTable"
import { TableSkeleton } from "@/components/ui/Skeletons/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getStudentColumns } from "./columns"
import { StudentFormDialog } from "@/components/students/StudentFormDialog"
import { ClearStudentsDialog } from "@/components/students/ClearStudentsDialog"
import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog"

import { useGetStudents } from "@/hooks/students/queries/useGetStudents"
import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"
import { Student } from "@/types/students/student.types"

export default function StudentDataTable() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [block, setBlock] = useState<string | null>(null)
  const [floor, setFloor] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [registerOpen, setRegisterOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // filters are sent to the API — the backend does the actual filtering
  const filters = useMemo(
    () => ({
      page,
      pageSize: 10,
      block: block ?? undefined,
      floor: floor ?? undefined,
      search: debouncedSearch || undefined,
    }),
    [page, block, floor, debouncedSearch]
  )

  const { data, isLoading, isFetching } = useGetStudents(filters)
  const { data: rooms } = useGetRooms()

  const blocks = useMemo(
    () => [...new Set((rooms ?? []).map((r) => r.block))].sort(),
    [rooms]
  )
  const floors = useMemo(
    () => [...new Set((rooms ?? []).map((r) => r.floor))].sort((a, b) => a - b),
    [rooms]
  )

  const hasFilters = block !== null || floor !== null || search !== ""

  const resetFilters = () => {
    setBlock(null)
    setFloor(null)
    setSearch("")
    setPage(1)
  }

  const columns = useMemo(
    () =>
      getStudentColumns({
        onView: (student) => router.push(`/dashboard/student/${student._id}`),
        onEdit: setEditStudent,
        onDelete: setDeleteStudent,
      }),
    [router]
  )

  if (isLoading) {
    return <TableSkeleton />
  }

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search name, mobile, room…"
            className="w-64 pl-8"
          />
        </div>

        <Select
          value={block}
          onValueChange={(value) => {
            setBlock(value as string | null)
            setPage(1)
          }}
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
          onValueChange={(value) => {
            setFloor(value as number | null)
            setPage(1)
          }}
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

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="size-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setClearOpen(true)}>
          <Trash2 className="size-4" />
          Clear All
        </Button>
        <Button onClick={() => setRegisterOpen(true)}>
          <Plus className="size-4" />
          New Student
        </Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto space-y-2">
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground">
          {data?.total ?? 0} students registered
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        toolbar={toolbar}
        isFetching={isFetching}
        emptyMessage="No students match the current filters."
        onRowClick={(student) => router.push(`/dashboard/student/${student._id}`)}
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

      <StudentFormDialog open={registerOpen} onOpenChange={setRegisterOpen}/>
      <StudentFormDialog
        open={!!editStudent}
        onOpenChange={(open) => !open && setEditStudent(null)}
        student={editStudent ?? undefined}
      />
      <ClearStudentsDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        studentCount={data?.total ?? 0}
      />
      <DeleteStudentDialog
        student={deleteStudent}
        onOpenChange={(open) => !open && setDeleteStudent(null)}
      />
    </div>
  )
}
