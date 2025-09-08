import dynamic from "next/dynamic";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const TeacherForm = dynamic(() => import("./TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

interface FormContainerProps {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update";
}

const FormContainer = ({ table, type }: FormContainerProps) => {
  const forms: Record<
    FormContainerProps["table"],
    React.ComponentType<{ type: "create" | "update"; data?: TeacherDoc }>
  > = {
    teacher: TeacherForm,
    student: () => <p>Student form not implemented yet</p>,
    parent: () => <p>Parent form not implemented yet</p>,
    subject: () => <p>Subject form not implemented yet</p>,
    class: () => <p>Class form not implemented yet</p>,
    exam: () => <p>Exam form not implemented yet</p>,
    assignment: () => <p>Assignment form not implemented yet</p>,
    result: () => <p>Result form not implemented yet</p>,
    attendance: () => <p>Attendance form not implemented yet</p>,
    event: () => <p>Event form not implemented yet</p>,
    announcement: () => <p>Announcement form not implemented yet</p>,
  };

  const FormComponent = forms[table];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-500">
          <Image
            src={`/images/${type}.png`}
            alt={type + " " + table}
            width={16}
            height={16}
            className="invert-100"
          />
          <span className="sr-only">Create a teacher</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-md:h-screen md:max-w-3xl">
        <DialogDescription className="sr-only" />
        <DialogTitle>
          <p className="text-xl font-semibold">
            {type === "create" ? "Create a new teacher" : "Update teacher"}
          </p>
        </DialogTitle>
        <FormComponent type={type} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="max-md:w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormContainer;
