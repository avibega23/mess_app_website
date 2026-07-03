"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatMonth } from "@/lib/billing"

interface MonthPickerProps {
    months: string[]
    value: string
    onChange: (month: string) => void
    className?: string
}

export function MonthPicker({ months, value, onChange, className }: MonthPickerProps) {
    return (
        <Select
            value={value}
            onValueChange={(month) => month && onChange(month as string)}
        >
            <SelectTrigger className={className ?? "w-44"}>
                <SelectValue>
                    {(month: string | null) => (month ? formatMonth(month) : "Select month")}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {[...months].reverse().map((month) => (
                    <SelectItem key={month} value={month}>
                        {formatMonth(month)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
