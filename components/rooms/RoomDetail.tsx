"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Pencil, Plus, Trash2, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { StudentFormDialog } from "@/components/students/StudentFormDialog"
import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog"

import { useGetRoom } from "@/hooks/rooms/queries/useGetRoom"
import { Student } from "@/types/students/student.types"

export default function RoomDetail({ id }: { id: string }) {
    const router = useRouter()
    const { data: room, isLoading, isError } = useGetRoom(id)

    const [addOpen, setAddOpen] = useState(false)
    const [editStudent, setEditStudent] = useState<Student | null>(null)
    const [removeStudent, setRemoveStudent] = useState<Student | null>(null)

    if (isLoading) {
        return (
            <div className="container mx-auto space-y-6 py-10">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (isError || !room) {
        return (
            <div className="container mx-auto flex flex-col items-start gap-4 py-10">
                <p className="text-muted-foreground">Room not found.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard/room")}>
                    <ChevronLeft className="size-4" />
                    Back to Rooms
                </Button>
            </div>
        )
    }

    const hasVacancy = room.occupants.length < room.capacity

    return (
        <div className="container mx-auto space-y-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard/room")}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Room {room.roomNo}</h1>
                        <p className="text-sm text-muted-foreground">
                            Block {room.block} · Floor {room.floor} · {room.capacity} seater
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasVacancy ? (
                        <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {room.capacity - room.occupants.length} slot
                            {room.capacity - room.occupants.length > 1 ? "s" : ""} free
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Full</Badge>
                    )}
                    <Button onClick={() => setAddOpen(true)} disabled={!hasVacancy}>
                        <Plus className="size-4" />
                        Add Student
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Occupants</CardTitle>
                    <CardDescription>
                        {room.occupants.length} of {room.capacity} slots filled
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {room.occupants.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            This room is empty.
                        </p>
                    )}
                    {room.occupants.map((student) => (
                        <div
                            key={student.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                    <UserRound className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {student.username}{" "}
                                        <Badge variant="outline" className="ml-1">
                                            Slot {student.slot}
                                        </Badge>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {student.fatherName} · {student.mobileNo}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/dashboard/student/${student.id}`)}
                                >
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditStudent(student)}
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => setRemoveStudent(student)}
                                >
                                    <Trash2 className="size-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <StudentFormDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                defaultRoomId={room.id}
            />
            <StudentFormDialog
                open={!!editStudent}
                onOpenChange={(open) => !open && setEditStudent(null)}
                student={editStudent ?? undefined}
            />
            <DeleteStudentDialog
                student={removeStudent}
                onOpenChange={(open) => !open && setRemoveStudent(null)}
            />
        </div>
    )
}
