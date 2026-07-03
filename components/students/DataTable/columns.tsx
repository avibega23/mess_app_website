"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StudentPayload } from "@/types/auth/students.types"
import { MoreVertical } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<StudentPayload>[] = [
    {
        accessorKey: "username",
        header: "Name",
    },
    {
        accessorKey: "mobileNo",
        header: "Mobile No",

    },
    {
        accessorKey: "roomNo",
        header: "Room",
    },
    {
        id: "actions",
        header:"More",
        cell: ({ row }) => {
            return (
                 <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            )
        },
    }
]