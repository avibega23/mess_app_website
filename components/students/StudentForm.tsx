import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { ComboboxField } from "@/components/ui/combobox-field"
import { Spinner } from "@/components/ui/spinner"

import { DialogFooter } from "../ui/dialog"
import { useEffect } from "react"
import { useStudentForm } from "@/hooks/students/local/useStudentForm"
import { RegisterStudentForm } from "@/types/students/student.types"

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

  const block = watch("block")
  const slot = watch("slot")
  const roomNo = watch("roomNo")
  const floorNo = watch("floorNo")

  const blockOptions = [
    "A",
    "B",
  ]

  const slotOptions = [
    "A",
    "B"
  ]

  const roomOptions = [
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110"
  ]

  const floorOptions = [
    "1",
    "2",
  ]

  useEffect(() => {
    const student = {
      name: "",
      rollNo: "",
      mobileNo: "",
      roomNo: "",
      block: "",
      slot: "",
      floorNo: "",
    }
    reset({
      name: student?.name ?? "",
      rollNo: student?.rollNo ?? "",
      mobileNo: student?.mobileNo ?? "",
      roomNo: student?.roomNo ?? "",
      block: student?.block ?? "",
      slot: student?.slot ?? "",
      floorNo: student?.floorNo ?? "",
    })
  }, [reset])

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
        label="Floor"
        options={floorOptions}
        value={floorNo}
        onChange={(f) => setValue("floorNo", f ?? "", { shouldValidate: true })}
        getLabel={(floor) => `Floor ${floor}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.floorNo?.message}
      />

      <ComboboxField
        label="Block"
        options={blockOptions}
        value={block}
        onChange={(b) => setValue("block", b ?? "", { shouldValidate: true })}
        getLabel={(block) => `Block ${block}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.block?.message}
      />

      <ComboboxField
        label="Room"
        options={roomOptions}
        value={roomNo}
        onChange={(room) => setValue("roomNo", room ?? "", { shouldValidate: true })}
        getLabel={(room) => `Room ${room}`}
        placeholder="Select a room with a free slot"
        searchPlaceholder="Search by room no or block…"
        emptyMessage="No rooms found."
        error={errors.roomNo?.message}
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
