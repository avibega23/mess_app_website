"use client"

import { useEffect, useMemo } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"
import { useRegisterStudent } from "@/hooks/students/mutations/useRegisterStudent"
import { useUpdateStudent } from "@/hooks/students/mutations/useUpdateStudent"
import {
    RegisterStudentPayload,
    RegisterStudentSchema,
    Student,
} from "@/types/students/student.types"

interface StudentFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** When provided the dialog edits this student, otherwise it registers a new one */
    student?: Student
    /** Pre-selects a room when registering (e.g. from the room detail page) */
    defaultRoomId?: string
}

export function StudentFormDialog({
    open,
    onOpenChange,
    student,
    defaultRoomId,
}: StudentFormDialogProps) {
    const isEdit = !!student
    const { data: rooms } = useGetRooms()
    const registerStudent = useRegisterStudent()
    const updateStudent = useUpdateStudent()
    const mutation = isEdit ? updateStudent : registerStudent

    const currentRoomId = useMemo(() => {
        if (!student || !rooms) return ""
        return (
            rooms.find((r) => r.block === student.block && r.roomNo === student.roomNo)
                ?.id ?? ""
        )
    }, [student, rooms])

    // rooms with a free slot; when editing, the student's current room stays selectable
    const roomOptions = useMemo(() => {
        if (!rooms) return []
        return rooms.filter(
            (r) => r.occupantCount < r.capacity || r.id === currentRoomId
        )
    }, [rooms, currentRoomId])

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm<RegisterStudentPayload>({
        resolver: zodResolver(RegisterStudentSchema),
        defaultValues: { username: "", fatherName: "", mobileNo: "", roomId: "" },
    })
    const roomId = watch("roomId")

    useEffect(() => {
        if (!open) return
        reset({
            username: student?.username ?? "",
            fatherName: student?.fatherName ?? "",
            mobileNo: student?.mobileNo ?? "",
            roomId: student ? currentRoomId : defaultRoomId ?? "",
        })
    }, [open, student, currentRoomId, defaultRoomId, reset])

    const onSubmit: SubmitHandler<RegisterStudentPayload> = async (payload) => {
        try {
            if (isEdit) {
                await updateStudent.mutateAsync({ id: student.id, payload })
            } else {
                await registerStudent.mutateAsync(payload)
            }
            onOpenChange(false)
        } catch (error) {
            setError("root", { message: (error as Error).message })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Student" : "Register Student"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the student's details or move them to another room."
                            : "Add a student to a room that has a free slot."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Name</Label>
                        <Input id="username" placeholder="Student name" {...register("username")} />
                        {errors.username && (
                            <p className="text-sm text-destructive">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fatherName">Father&apos;s Name</Label>
                        <Input id="fatherName" placeholder="Father's name" {...register("fatherName")} />
                        {errors.fatherName && (
                            <p className="text-sm text-destructive">{errors.fatherName.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="mobileNo">Mobile No</Label>
                        <Input id="mobileNo" type="tel" placeholder="10 digit mobile number" {...register("mobileNo")} />
                        {errors.mobileNo && (
                            <p className="text-sm text-destructive">{errors.mobileNo.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Room</Label>
                        <Select
                            value={roomId || null}
                            onValueChange={(value) =>
                                setValue("roomId", (value as string) ?? "", { shouldValidate: true })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a room with a free slot">
                                    {(value: string | null) => {
                                        const room = roomOptions.find((r) => r.id === value)
                                        return room
                                            ? `Room ${room.roomNo} · Block ${room.block}`
                                            : "Select a room with a free slot"
                                    }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {roomOptions.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                        Room {room.roomNo} · Block {room.block} ({room.occupantCount}/
                                        {room.capacity} filled)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.roomId && (
                            <p className="text-sm text-destructive">{errors.roomId.message}</p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-sm text-destructive">{errors.root.message}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <Spinner />
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "Register Student"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
