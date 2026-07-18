import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { ComboboxField } from "@/components/ui/combobox-field"
import { Spinner } from "@/components/ui/spinner"

import { DialogFooter } from "../ui/dialog"
import { useEffect } from "react"
import { useStudentForm } from "@/hooks/students/local/useStudentForm"
import { RegisterStudentForm } from "@/types/students/student.types"
import { useAuthStore } from "@/store/authStore"
import { useGetRooms } from "@/hooks/rooms/queries/useGetRooms"

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

  const rooms = useGetRooms();

  const roomOptions = [
    {
      _id: "123",
      roomNo: 101
    }
  ]

  const floorOptions = [
    {
      _id: "123",
      floorNo: 1
    }
  ]

  const slotOptions = [
    "A",
    "B"
  ]

  useEffect(() => {
    reset({
      name: props.student?.name ?? "",
      rollNo: props.student?.rollNo ?? "",
      mobileNo: props.student?.mobileNo ?? "",
      roomId: props.student?.roomId ?? {
        _id: "",
        roomNo: undefined,
      },
      messId: props.student?.messId ?? {
        _id: "",
        messBlock: "",
      },
      slot: props.student?.slot ?? "",
      floorId: props.student?.floorId ?? {
        _id: "",
        floorNo: undefined
      },
    })
  }, [reset, props.student])

  const onSubmit = async (data: RegisterStudentForm) => {
    try {
      if (isEdit) {
        await onUpdate(data);
      }
      {
        await onRegister(data);
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
        itemToStringValue={(val) => val.messBlock}
        onChange={(m) => setValue("messId", m ?? "", { shouldValidate: true })}
        getLabel={(m) => `Block ${m.messBlock}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.messId?.message}
      />

      <ComboboxField
        label="Floor"
        options={floorOptions}
        value={floorId}
        onChange={(f) => setValue("floorId", f ?? "", { shouldValidate: true })}
        getLabel={(floor) => `Floor ${floor}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.floorId?.message}
        disabled={messId === ""}
      />


      <ComboboxField
        label="Room"
        options={roomOptions}
        value={roomId}
        onChange={(room) => setValue("roomNo", room ?? "", { shouldValidate: true })}
        getLabel={(room) => `Room ${room}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.roomId?.message}
        disabled={floorId === ""}
      />

      <ComboboxField
        label="Slot"
        options={slotOptions}
        value={slot}
        onChange={(s) => setValue("slot", s ?? "", { shouldValidate: true })}
        getLabel={(slot) => `Slot ${slot}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.slot?.message}
        disabled={roomId === ""}
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
