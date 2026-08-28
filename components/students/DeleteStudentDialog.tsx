"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDeleteStudent } from "@/hooks/students/mutations/useDeleteStudent"
import { StudentResponse as Student } from "@/types/students/student.types"
import { getErrorMessage } from "@/lib/utils"

interface DeleteStudentDialogProps {
  student: Student | null
  onOpenChange: (open: boolean) => void
  /** Called after a successful delete, e.g. to navigate away from a detail page */
  onDeleted?: () => void
}

export function DeleteStudentDialog({
  student,
  onOpenChange,
  onDeleted,
}: DeleteStudentDialogProps) {
  const deleteStudent = useDeleteStudent()
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!open && deleteStudent.isPending) return
    if (!open) setError(null)
    onOpenChange(open)
  }

  const handleDelete = async () => {
    if (!student) return
    setError(null)
    try {
      await deleteStudent.mutateAsync(student._id)
      handleOpenChange(false)
      onDeleted?.()
    } catch (err) {
      setError(getErrorMessage(err, "Failed to remove student"))
    }
  }

  return (
    <AlertDialog open={!!student} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {student?.username}?</AlertDialogTitle>
          <AlertDialogDescription>
            This frees Room {student?.roomId.roomNo} of (Block {student?.floorId.floorNo}). Bill history is kept.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <Button
            variant="outline"
            disabled={deleteStudent.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteStudent.isPending}
            onClick={handleDelete}
          >
            {deleteStudent.isPending ? <Spinner /> : "Remove Student"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
