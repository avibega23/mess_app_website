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

interface ComboboxFieldProps<T> {
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
  disabled?: boolean
  getItemKey: (item: T) => string
  itemToStringValue?: (val: T) => string
}

function ComboboxField<T>({
  label,
  options,
  value,
  onChange,
  error,
  getLabel = (item) => String(item),
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  getItemKey,
  emptyMessage = "No options found.",
  className,
  containerClassName,
  disabled,
  itemToStringValue = (item) => String(item)
}: ComboboxFieldProps<T>) {
  const selectedOption =
    value != null
      ? options.find((option) => itemToStringValue(option) === itemToStringValue(value)) ?? null
      : null

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Label>{label}</Label>
      <Combobox
        items={options}
        value={selectedOption}
        itemToStringValue={itemToStringValue}
        onValueChange={onChange}
        itemToStringLabel={getLabel}
        disabled={disabled}
      >
        <ComboboxTrigger className={cn("w-full", className)} aria-invalid={!!error}>
          <ComboboxValue placeholder={placeholder} />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder={searchPlaceholder} />
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item: T) => (
              <ComboboxItem key={getItemKey(item)} value={item}>
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
