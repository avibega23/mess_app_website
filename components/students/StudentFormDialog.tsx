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
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/components/ui/combobox"
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
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

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
    const user = useAuthStore((state) => state.user)
    const mutation = isEdit ? updateStudent : registerStudent

    const router = useRouter();

    if (!user) {
        router.replace("/login")
    }
    const blocks = [
        {
            block: "A"
        },
        {
            block: "B"
        }
    ]
    const blockOptions = useMemo(() => {
        if(!blocks) return;
        return blocks.filter((b) => {
            return blocks.some((b) => b.block === block)
        })
    }, [])
    const currentRoomId = useMemo(() => {
        if (!student || !rooms) return ""
        return (
            rooms.find((r) => r.roomNo === student.roomNo)
                ?.id ?? ""
        )
    }, [student, rooms])

    // rooms with a free slot; when editing, the student's current room stays selectable
    const roomOptions : {block:string}[] = useMemo(() => {
        if (!rooms) return []
        return rooms.filter(
            (r) => r.occupantCount < r.capacity || r.id === currentRoomId
        )
    }, [rooms, currentRoomId])

    if(!roomOptions) return;

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
        defaultValues: { username: "", rollNo: "", mobileNo: "", roomNo: "", block: "" },
    })
    const roomNo = watch("roomNo")
    const block = watch("block")

    useEffect(() => {
        if (!open) return
        reset({
            username: student?.username ?? "",
            rollNo: student?.rollNo ?? "",
            mobileNo: student?.mobileNo ?? "",
            roomNo: student ? currentRoomId : defaultRoomId ?? "",
            block: student?.block ?? "A"
        })
    }, [open, student, currentRoomId, defaultRoomId, reset])

    const onSubmit: SubmitHandler<RegisterStudentPayload> = async (payload) => {
        try {
            if (isEdit) {
                await updateStudent.mutateAsync({ id: student._id, payload })
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
                        <Label htmlFor="rollNo">Roll No</Label>
                        <Input id="rollNo" placeholder="Student roll number" {...register("rollNo")} />
                        {errors.rollNo && (
                            <p className="text-sm text-destructive">{errors.rollNo.message}</p>
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
                        <Label>Block</Label>
                        <Combobox
                            items={blockOptions}
                            value={blockOptions.find((b) => b.block === block) ?? null}
                            onValueChange={(blocks) =>
                                setValue("block", blocks?.block ?? "", { shouldValidate: true })
                            }
                            itemToStringLabel={(block) =>
                                `Block ${block.block}`
                            }
                        >
                            <ComboboxTrigger className="w-full">
                                <ComboboxValue placeholder="Select a room with a free slot" />
                            </ComboboxTrigger>
                            <ComboboxContent>
                                <ComboboxInput placeholder="Search by room no or block…" />
                                <ComboboxEmpty>No rooms found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(block: (typeof blockOptions)[number]) => (
                                        <ComboboxItem key={block.block} value={block}>
                                            Block {block.block}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        {errors.roomNo && (
                            <p className="text-sm text-destructive">{errors.roomNo.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Room</Label>
                        <Combobox
                            items={roomOptions}
                            value={roomOptions.find((r) => r.id === roomNo) ?? null}
                            onValueChange={(room) =>
                                setValue("roomNo", room?.id ?? "", { shouldValidate: true })
                            }
                            itemToStringLabel={(room) =>
                                `Room ${room.roomNo} · Block ${room.block}`
                            }
                        >
                            <ComboboxTrigger className="w-full">
                                <ComboboxValue placeholder="Select a room with a free slot" />
                            </ComboboxTrigger>
                            <ComboboxContent>
                                <ComboboxInput placeholder="Search by room no or block…" />
                                <ComboboxEmpty>No rooms found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(room: (typeof roomOptions)[number]) => (
                                        <ComboboxItem key={room.id} value={room}>
                                            Room {room.roomNo} · Block {room.block} ({room.occupantCount}/
                                            {room.capacity} filled)
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        {errors.roomNo && (
                            <p className="text-sm text-destructive">{errors.roomNo.message}</p>
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
