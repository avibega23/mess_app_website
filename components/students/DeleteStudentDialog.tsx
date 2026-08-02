"use client"
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
import { Student } from "@/types/students/student.types"

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

    const handleDelete = async () => {
        if (!student) return
        await deleteStudent.mutateAsync(student._id)
        onOpenChange(false)
        onDeleted?.()
    }

    return (
        <AlertDialog open={!!student} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove {student?.username}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This frees Room {student?.roomNo} of (Block {student?.block}). Bill history is kept.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
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
