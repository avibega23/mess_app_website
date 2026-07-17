import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface InputFieldProps extends React.ComponentProps<typeof Input> {
  label: string
  error?: string
  containerClassName?: string
}

function InputField({
  label,
  error,
  id,
  containerClassName,
  ...props
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { InputField }
