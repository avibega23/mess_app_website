import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { ComboboxField } from "@/components/ui/combobox-field"
import { Spinner } from "@/components/ui/spinner"

import { DialogFooter } from "../ui/dialog"
import { useEffect, useMemo } from "react"
import { useStudentForm } from "@/hooks/students/local/useStudentForm"
import { RegisterStudentForm } from "@/types/students/student.types"
import { useAuthStore } from "@/store/authStore"
import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"
import { MessData } from "@/types/auth/auth.types"
import { RoomFilters } from "@/types/rooms/room.types"
import { useGetFloors } from "@/hooks/floors/queries/useGetFloors"
import { useGetRoom } from "@/hooks/rooms/queries/useGetRoom"

interface StudentFormProps {
  student?: RegisterStudentForm;
  onOpenChange: (val: boolean) => void;
}

const StudentForm = (props: StudentFormProps) => {
  const isEdit = !!props.student;
  const {
    form,
    isSubmitting,
    onRegister,
    onUpdate
  } = useStudentForm()


  const {
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
    setError
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
  const roomOptions = useMemo(
    () => rooms?.map((room) => ({ _id: room._id, roomNo: Number(room.roomNo) })) ?? [],
    [rooms]
  );

  const { data: floors } = useGetFloors(messId._id);
  const floorOptions = useMemo(() => floors ?? [], [floors]);

  const { data: room } = useGetRoom(roomId._id);
  const slotOptions = useMemo(
    () => room?.slot?.filter((slot) => !slot.occupied).map((slot) => slot.label) ?? [],
    [room]
  );



  useEffect(() => {
    reset({
      name: props.student?.name ?? "",
      rollNo: props.student?.rollNo ?? "",
      mobileNo: props.student?.mobileNo ?? "",
      roomId: props.student?.roomId ?? {
        _id: "",
        roomNo: 0,
      },
      messId: props.student?.messId ?? {
        _id: "",
        messBlock: "",
      },
      slot: props.student?.slot ?? "",
      floorId: props.student?.floorId ?? {
        _id: "",
        floorNo: 0
      },
    })
  }, [reset, props.student])

  const onSubmit = async (data: RegisterStudentForm) => {
    try {
      if (isEdit) {
        onUpdate(data, user?.hostelId ?? "");
      }
      {
        onRegister(data, user?.hostelId ?? "");
      }
      props.onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setError("root", {
          message: error.message
        })
      }
      else setError("root", { message: "Failed To Register Student" })
    }
  };

  return (
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
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
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
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
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
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.slot?.message}
        disabled={roomId._id === ""}
      />

      {errors.root && (
        <div className="text-sm text-destructive flex justify-center w-full">{errors.root.message}</div>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Register Student"
          )}
        </Button>
      </DialogFooter>
    </form>

  )
}

export default StudentForm;
