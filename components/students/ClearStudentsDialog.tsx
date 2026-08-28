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
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useClearStudents } from "@/hooks/students/mutations/useClearStudents"
import { getErrorMessage } from "@/lib/utils"

const CONFIRM_WORD = "CLEAR"

interface ClearStudentsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentCount: number
}

export function ClearStudentsDialog({
    open,
    onOpenChange,
    studentCount,
}: ClearStudentsDialogProps) {
    const [confirmText, setConfirmText] = useState("")
    const [error, setError] = useState<string | null>(null)
    const clearStudents = useClearStudents()

    const handleOpenChange = (next: boolean) => {
        if (!next && clearStudents.isPending) return
        if (!next) {
            setConfirmText("")
            setError(null)
        }
        onOpenChange(next)
    }

    const handleClear = async () => {
        setError(null)
        try {
            await clearStudents.mutateAsync()
            handleOpenChange(false)
        } catch (err) {
            setError(getErrorMessage(err, "Failed to clear students"))
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Clear all students?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes all {studentCount} registered students — meant for the
                        semester changeover. Bill history is kept, but room assignments are
                        wiped. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        Type <span className="font-semibold text-foreground">{CONFIRM_WORD}</span> to confirm.
                    </p>
                    <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={CONFIRM_WORD}
                        autoComplete="off"
                        disabled={clearStudents.isPending}
                    />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        disabled={clearStudents.isPending}
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={confirmText !== CONFIRM_WORD || clearStudents.isPending}
                        onClick={handleClear}
                    >
                        {clearStudents.isPending ? <Spinner /> : "Clear All Students"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
