"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import axios from "axios";

import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, Paginated } from "@/types/common/api.types";
import { StudentResponse as Student } from "@/types/students/student.types";

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "username",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.username}</span>
    ),
  },
  {
    accessorKey: "rollNo",
    header: "Roll No",
    cell: ({ row }) => row.original.rollNo,
  },
  {
    accessorKey: "mobileNo",
    header: "Mobile No",
    cell: ({ row }) => row.original.mobileNo,
  },
  {
    id: "room",
    header: "Room",
    cell: ({ row }) => `${row.original.roomId.roomNo} ${row.original.slot}`,
  },
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <Badge variant="outline">Block {row.original.messId.messBlock}</Badge>
    ),
  },
  {
    accessorKey: "floor",
    header: "Floor",
    cell: ({ row }) => (
      <Badge variant="outline">Floor {row.original.floorId.floorNo}</Badge>
    ),
  },
];

async function fetchRegisteredStudents(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<Paginated<Student>> {
  const { data } = await axios.get<ApiResponse<Paginated<Student>>>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}clerk/registered-students`,
    { params },
  );
  return data.data;
}

export default function RegisteredStudentsTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      search: debouncedSearch || undefined,
    }),
    [page, pageSize, debouncedSearch],
  );

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["registered-students", filters],
    queryFn: () => fetchRegisteredStudents(filters),
    placeholderData: keepPreviousData,
  });

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name, mobile, room…"
          className="w-64 pl-8"
        />
      </div>
      {search !== "" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
        >
          <X className="size-4" />
          Reset
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto flex h-full min-h-0 flex-col gap-2 p-4 sm:p-6">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-semibold">Registered Students</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading students…"
            : isError
              ? "Unable to load the student list."
              : `${data?.total ?? 0} students registered — search to check your name`}
        </p>
        {isError && (
          <p className="mt-1 text-sm text-red-500">
            {axios.isAxiosError(error)
              ? ((error.response?.data as { message?: string } | undefined)
                  ?.message ?? error.message)
              : error instanceof Error
                ? error.message
                : "Something went wrong"}
          </p>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        toolbar={toolbar}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No students match your search."
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
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
    </div>
  );
}
