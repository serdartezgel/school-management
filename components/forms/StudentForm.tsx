"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { getClasses } from "@/lib/actions/class.action";
import { createStudent, updateStudent } from "@/lib/actions/student.action";
import {
  StudentSchema,
  UpdateStudentSchema,
  UpdateTeacherSchema,
} from "@/lib/validations";

import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const StudentForm = ({
  type,
  data: student,
}: {
  type: "create" | "update";
  data?: StudentDoc;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [classes, setClasses] = useState<ClassDoc[]>([]);

  const schema = type === "update" ? UpdateStudentSchema : StudentSchema;

  const defaultValues =
    type === "update"
      ? {
          studentId: student?.studentId ?? "",
          classId: student?.classId ?? "",
          parentId: student?.parentId ?? undefined,
          emergencyContact: student?.emergencyContact ?? undefined,
          bloodGroup: student?.bloodGroup ?? undefined,
          name: student?.user.name ?? "",
          email: student?.user.email ?? "",
          gender: student?.user.gender ?? undefined,
          image: student?.user.image ?? undefined,
          phone: student?.user.phone ?? undefined,
          dateOfBirth: student?.user.dateOfBirth
            ? new Date(student.user.dateOfBirth)
            : undefined,
          admissionDate: student?.admissionDate
            ? new Date(student.admissionDate)
            : undefined,
          address: student?.user.address ?? undefined,
          userId: student?.user.id, // for update schema
        }
      : {
          username: "",
          password: "",
          studentId: "",
          classId: "",
          parentId: undefined,
          emergencyContact: "",
          bloodGroup: "",
          name: "",
          email: "",
          gender: undefined,
          image: "",
          phone: "",
          dateOfBirth: undefined,
          admissionDate: undefined,
          address: "",
        };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      if (type === "update" && student) {
        const updateData = data as z.infer<typeof UpdateTeacherSchema>;
        const result = await updateStudent(updateData);

        if (result.success) {
          toast.success("Success", {
            description: "Student updated successfully.",
          });

          if (result.data) router.push(`/students/${result.data.userId}`);
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || "Something went wrong.",
          });
        }

        return;
      }

      const createData = data as z.infer<typeof StudentSchema>;
      const result = await createStudent(createData);

      if (result.success) {
        toast.success("Success", {
          description: "Student created successfully.",
        });

        if (result.data) router.push(`/students/${result.data.userId}`);
      } else {
        toast.error(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong.",
        });
      }
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const result = await getClasses({ page: 1, pageSize: 100, query: "" });
      if (result.success) setClasses(result.data?.classes || []);
      else toast.error("Failed to load classes");
    });
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid items-center gap-4 md:grid-cols-3">
          {type === "create" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {type === "create" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Parent</SelectLabel>
                        <SelectItem value="10000">Parent 1</SelectItem>
                        <SelectItem value="10001">Parent 2</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Class</SelectLabel>
                        {classes.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No classes available
                          </SelectItem>
                        ) : (
                          classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name} ({cls.capacity})
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} placeholder="555 55 55" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} placeholder="555 55 55" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="max-md:w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-cyan-600 text-white hover:bg-cyan-500 max-md:w-full"
          >
            {isPending ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
              </>
            ) : (
              <> {type === "create" ? "Create" : "Update"}</>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StudentForm;
