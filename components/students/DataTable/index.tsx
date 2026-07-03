"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/shared/DataTable"
import { TableSkeleton } from "@/components/ui/Skeletons/TableSkeleton";
import { useGetStudents } from "@/hooks/students/queries/useGetStudents"

export default function StudentDataTable() {
  const {data,isLoading} = useGetStudents();
  if(isLoading){
    return <TableSkeleton/>
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  )
}