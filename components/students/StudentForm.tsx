import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { ComboboxField } from "@/components/ui/combobox-field"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DialogFooter } from "../ui/dialog"
import { useStudentForm } from "@/hooks/students/local/useStudentForm"
import { RegisterStudentForm } from "@/types/students/student.types"
import { useAuthStore } from "@/store/authStore"
import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"
import { MessData } from "@/types/auth/auth.types"
import { Room, RoomFilters } from "@/types/rooms/room.types"
import { useGetFloors } from "@/hooks/floors/queries/useGetFloors"
import { useGetRoom } from "@/hooks/rooms/queries/useGetRoom"
import { getErrorMessage } from "@/lib/utils"

interface StudentFormProps {
  student?: RegisterStudentForm;
  defaultRoom?: Room;
  onOpenChange: (val: boolean) => void;
  onPendingChange?: (pending: boolean) => void;
}

const StudentForm = (props: StudentFormProps) => {
  const isEdit = !!props.student;
  const {
    form,
    isSubmitting,
    onRegister,
    onUpdate
  } = useStudentForm()

  const [confirmData, setConfirmData] = useState<RegisterStudentForm | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const {
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = form;

  const messId = watch("messId")
  const slot = watch("slot")
  const roomId = watch("roomId")
  const floorId = watch("floorId")

  const messOptions: MessData[] = useAuthStore((state) => state.messes) ?? [];
  const user = useAuthStore((state) => state.user);

  const roomFilters: RoomFilters = useMemo(() => ({
    messId: messId._id,
    floor: floorId.floorNo,
    vacant: "true",
    pageLimit: 50
  }), [messId._id, floorId.floorNo]);

  const { data: rooms } = useGetRooms(roomFilters, { enabled: !!messId._id });
  const roomOptions = useMemo(() => {
    const opts = rooms?.data?.map((room) => ({ _id: room._id, roomNo: Number(room.roomNo) })) ?? [];
    // The currently selected room may not be "vacant" (e.g. it's occupied by
    // the student being edited), so it won't come back from the vacant-only
    // rooms query. Keep it in the list so the field can still display it.
    if (roomId._id && !opts.some((r) => r._id === roomId._id)) {
      opts.push(roomId);
    }
    return opts;
  }, [rooms, roomId]);

  const { data: floors } = useGetFloors(messId._id);
  const floorOptions = useMemo(() => floors ?? [], [floors]);

  const { data: room } = useGetRoom(roomId._id);
  const slotOptions = useMemo(() => {
    const opts = room?.slot?.filter((slot) => !slot.occupied).map((slot) => slot.label) ?? [];
    // Same as above: the student's current slot is occupied by themself, so
    // it gets filtered out unless we add it back explicitly.
    if (slot && !opts.includes(slot)) {
      opts.push(slot);
    }
    return opts;
  }, [room, slot]);

  useEffect(() => {
    // Keep the parent dialog open while confirming or submitting.
    props.onPendingChange?.(isSubmitting || !!confirmData)
  }, [isSubmitting, confirmData, props.onPendingChange])

  useEffect(() => {
    reset({
      _id: props.student?._id ?? "",
      name: props.student?.name ?? "",
      rollNo: props.student?.rollNo ?? "",
      mobileNo: props.student?.mobileNo ?? "",
      roomId: props.student?.roomId ?? (props.defaultRoom ? {
        _id: props.defaultRoom._id,
        roomNo: Number(props.defaultRoom.roomNo),
      } : {
        _id: "",
        roomNo: 0,
      }),
      messId: props.student?.messId ?? props.defaultRoom?.messId ?? {
        _id: "",
        messBlock: "",
      },
      slot: props.student?.slot ?? "",
      floorId: props.student?.floorId ?? props.defaultRoom?.floorId ?? {
        _id: "",
        floorNo: 0
      },
    })
  }, [reset, props.student, props.defaultRoom])

  const onSubmit = async (data: RegisterStudentForm) => {
    clearErrors("root")
    if (!isEdit) {
      setConfirmError(null)
      setConfirmData(data)
      return
    }

    try {
      await onUpdate(data, user?.hostelId ?? "");
      props.onOpenChange(false);
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error, "Failed to update student"),
      })
    }
  };

  const handleConfirmRegister = async () => {
    if (!confirmData) return
    setConfirmError(null)
    try {
      await onRegister(confirmData, user?.hostelId ?? "");
      setConfirmData(null)
      props.onOpenChange(false);
    } catch (error) {
      setConfirmError(getErrorMessage(error, "Failed to register student"))
    }
  }

  const detail = confirmData

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          id="name"
          label="Name"
          placeholder="Student name"
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          id="rollNo"
          label="Roll No"
          placeholder="Student roll number"
          error={errors.rollNo?.message}
          {...register("rollNo")}
        />

        <InputField
          id="mobileNo"
          label="Mobile No"
          type="tel"
          placeholder="10 digit mobile number"
          error={errors.mobileNo?.message}
          {...register("mobileNo", { maxLength: 10 })}
        />

        <ComboboxField
          label="Block"
          options={messOptions}
          value={messId}
          getItemKey={(item) => item._id}
          itemToStringValue={(val) => val.messBlock}
          onChange={(m) => {
            setValue("messId", m ?? { _id: "", messBlock: "" }, { shouldValidate: true });
            setValue("floorId", { _id: "", floorNo: 0 });
            setValue("roomId", { _id: "", roomNo: 0 });
            setValue("slot", "");
          }}
          getLabel={(m) => `Block ${m.messBlock}`}
          placeholder="Select a Mess Block"
          searchPlaceholder="Search by Block Label"
          emptyMessage="No Block found."
          error={errors.messId?._id?.message}
        />

        <ComboboxField
          label="Floor"
          options={floorOptions}
          value={floorId}
          getItemKey={(item) => item._id}
          onChange={(f) => {
            setValue("floorId", f ?? { _id: "", floorNo: 0 }, { shouldValidate: true });
            setValue("roomId", { _id: "", roomNo: 0 });
            setValue("slot", "");
          }}
          itemToStringValue={(val) => `Floor ${val.floorNo}`}
          getLabel={(floor) => `Floor ${floor.floorNo}`}
          placeholder="Select a Floor"
          searchPlaceholder="Search Floor No."
          emptyMessage="No Floor Found"
          error={errors.floorId?._id?.message}
          disabled={messId._id === ""}
        />

        <ComboboxField
          label="Room"
          options={roomOptions}
          value={roomId}
          itemToStringValue={(item) => `Room ${item.roomNo}`}
          getItemKey={(item) => item._id}
          onChange={(room) => {
            setValue("roomId", room ?? { _id: "", roomNo: 0 }, { shouldValidate: true });
            setValue("slot", "");
          }}
          getLabel={(room) => `Room ${room.roomNo}`}
          placeholder="Select a room with a free slot"
          searchPlaceholder="Search by room no or block…"
          emptyMessage="No rooms found."
          error={errors.roomId?._id?.message}
          disabled={floorId._id === ""}
        />

        <ComboboxField
          label="Slot"
          options={slotOptions}
          value={slot}
          getItemKey={(item) => item}
          onChange={(s) => setValue("slot", s ?? "", { shouldValidate: true })}
          getLabel={(slot) => `Slot ${slot}`}
          placeholder="Select a Slot"
          searchPlaceholder="Search by Label"
          emptyMessage="No Slot found."
          error={errors.slot?.message}
          disabled={roomId._id === ""}
        />

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => props.onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && isEdit ? (
              <Spinner />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Register Student"
            )}
          </Button>
        </DialogFooter>
      </form>

      <AlertDialog
        open={!!confirmData}
        onOpenChange={(open) => {
          if (!open && isSubmitting) return
          if (!open) {
            setConfirmData(null)
            setConfirmError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm registration?</AlertDialogTitle>
            <AlertDialogDescription>
              Review the details below before registering this student.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {detail && (
            <div className="space-y-1.5 rounded-md border p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Name</span>
                <span className="text-right font-medium">{detail.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Roll No</span>
                <span className="text-right">{detail.rollNo}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Mobile</span>
                <span className="text-right">{detail.mobileNo}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Block</span>
                <span className="text-right">Block {detail.messId.messBlock}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Floor</span>
                <span className="text-right">Floor {detail.floorId.floorNo}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Room</span>
                <span className="text-right">Room {detail.roomId.roomNo}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Slot</span>
                <span className="text-right">Slot {detail.slot}</span>
              </div>
            </div>
          )}

          {confirmError && (
            <p className="text-sm text-destructive">{confirmError}</p>
          )}

          <AlertDialogFooter>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setConfirmData(null)
                setConfirmError(null)
              }}
            >
              Back
            </Button>
            <Button disabled={isSubmitting} onClick={handleConfirmRegister}>
              {isSubmitting ? <Spinner /> : "Confirm Register"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default StudentForm;
