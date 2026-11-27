"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useBlockStudent } from "@/hooks/students/mutations/useBlockStudent"
import { getErrorMessage } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface BlockStudentSwitchProps {
  studentId: string
  isBlocked: boolean
  showLabel?: boolean
  className?: string
}

export function BlockStudentSwitch({
  studentId,
  isBlocked,
  showLabel = false,
  className,
}: BlockStudentSwitchProps) {
  const blockStudent = useBlockStudent()
  const [error, setError] = useState<string | null>(null)

  const handleCheckedChange = async (checked: boolean) => {
    setError(null)
    try {
      await blockStudent.mutateAsync({ id: studentId, block: checked })
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update account status"))
    }
  }

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <div className="flex items-center gap-2">
        <Switch
          checked={!!isBlocked}
          disabled={blockStudent.isPending}
          onCheckedChange={handleCheckedChange}
          aria-label="Temporarily block"
        />
        {showLabel && (
          isBlocked ? (
            <Badge variant="destructive">Blocked</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Temporarily block</span>
          )
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
