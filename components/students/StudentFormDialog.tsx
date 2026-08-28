"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  RegisterStudentForm,
} from "@/types/students/student.types"
import { Room } from "@/types/rooms/room.types"
import StudentForm from "./StudentForm"

interface StudentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: RegisterStudentForm
  defaultRoom?: Room
}

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  defaultRoom,
}: StudentFormDialogProps) {
  const [busy, setBusy] = useState(false)
  const isEdit = !!student;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && busy) return
        onOpenChange(next)
      }}
      disablePointerDismissal={busy}
    >
      <DialogContent showCloseButton={!busy}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Register Student"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the student's details or move them to another room."
              : "Add a student to a room that has a free slot."}
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          student={student}
          defaultRoom={defaultRoom}
          onOpenChange={onOpenChange}
          onPendingChange={setBusy}
        />
      </DialogContent>
    </Dialog>
  )
}
