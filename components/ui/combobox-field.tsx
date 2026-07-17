"use client"


import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ComboboxFieldProps<T extends string> {
  label: string
  options: T[]
  value?: T | null
  onChange: (value: T | null) => void
  error?: string
  getLabel?: (item: T) => string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  containerClassName?: string
}

function ComboboxField<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  getLabel = (item) => item,
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  emptyMessage = "No options found.",
  className,
  containerClassName,
}: ComboboxFieldProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Label>{label}</Label>
      <Combobox
        items={options}
        value={options.find((option) => option === value) ?? null}
        onValueChange={onChange}
        itemToStringLabel={getLabel}
      >
        <ComboboxTrigger className={cn("w-full", className)} aria-invalid={!!error}>
          <ComboboxValue placeholder={placeholder} />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder={searchPlaceholder} />
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item: T) => (
              <ComboboxItem key={item} value={item}>
                {getLabel(item)}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { ComboboxField }
