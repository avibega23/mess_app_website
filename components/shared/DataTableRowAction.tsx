import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
 } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreVertical } from "lucide-react"
import React from "react"


export interface RowAction<TData> {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (row: TData) => void
    variant?: "default" | "destructive"
    hidden?: (row: TData) => boolean   // conditionally show per row
    separatorBefore?: boolean
  }
  export function DataTableRowActions<TData>({
    row,
    actions,
  }: {
    row: TData
    actions: RowAction<TData>[]
  }) {
    const visible = actions.filter((a) => !a.hidden?.(row))
    if (!visible.length) return null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visible.map((action, i) => (
            <React.Fragment key={action.label}>
              {action.separatorBefore && i > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => action.onClick(row)}
                variant={action.variant}
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }