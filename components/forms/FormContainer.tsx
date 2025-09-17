import dynamic from "next/dynamic";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const TeacherForm = dynamic(() => import("./TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

interface FormContainerProps<T extends keyof FormDataMap = keyof FormDataMap> {
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
  data?: FormDataMap[T];
}

const FormContainer = ({ table, type, data }: FormContainerProps) => {
  const forms: Record<
    FormContainerProps["table"],
    React.ComponentType<{
      type: "create" | "update";
      data?: FormDataMap[keyof FormDataMap];
    }>
  > = {
    teacher: TeacherForm,
    student: StudentForm,
    parent: () => <p>Parent form not implemented yet</p>,
    subject: () => <p>Subject form not implemented yet</p>,
    class: ClassForm,
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
        {type === "create" ? (
          <Button className="bg-cyan-600 hover:bg-cyan-500">
            <Image
              src={`/images/${type}.png`}
              alt={`${type} ${table}`}
              width={16}
              height={16}
              className="invert-100"
            />
            <span className="sr-only">Create a {table}</span>
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-start px-2 py-1.5">
            Update {table}
            <span className="sr-only">Update a {table}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-md:h-screen md:max-w-3xl">
        <DialogDescription className="sr-only" />
        <DialogTitle>
          <p className="text-xl font-semibold">
            {type === "create" ? `Create a new ${table}` : `Update ${table}`}
          </p>
        </DialogTitle>
        <FormComponent type={type} data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default FormContainer;
