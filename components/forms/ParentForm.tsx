"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createParent, updateParent } from "@/lib/actions/parent.action";
import { getStudents, getStudentsById } from "@/lib/actions/student.action";
import { ParentSchema, UpdateParentSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const StudentMultiSelect = ({
  field,
}: {
  field: {
    value: string[];
    onChange: (ids: string[]) => void;
  };
}) => {
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<StudentDoc[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<StudentDoc[]>([]);

  useEffect(() => {
    if (!field.value?.length) return;

    const fetchSelected = async () => {
      const result = await getStudentsById({ ids: field.value });
      if (result.success) {
        setSelectedStudents(result.data?.students || []);
      }
    };

    fetchSelected();
  }, [field.value]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) return setStudents([]);

      startTransition(async () => {
        const result = await getStudents({ page: 1, pageSize: 100, query });
        if (result.success) setStudents(result.data?.students || []);
        else toast.error("Failed to load students");
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const studentsToShow = [
    ...new Map(
      [...selectedStudents, ...students].map((s) => [s.id, s]),
    ).values(),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full cursor-pointer justify-start truncate text-gray-500"
        >
          {field.value?.length
            ? (() => {
                const names = field.value
                  .map(
                    (id) => studentsToShow.find((s) => s.id === id)?.user.name,
                  )
                  .filter(Boolean) as string[];

                return names.length > 2
                  ? `${names.slice(0, 2).join(", ")}, +${names.length - 2} more`
                  : names.join(", ");
              })()
            : "Select students..."}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-60 w-60 overflow-y-auto">
        <input
          type="text"
          placeholder="Search students..."
          className="mb-2 w-full rounded border px-2 py-1 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Separator />
        {studentsToShow.map((student) => (
          <DropdownMenuCheckboxItem
            key={student.id}
            checked={field.value?.includes(student.id) ?? false}
            onCheckedChange={(checked) => {
              if (checked) {
                field.onChange([...(field.value || []), student.id]);
              } else {
                field.onChange(field.value?.filter((id) => id !== student.id));
              }
            }}
            onSelect={(event) => event.preventDefault()} // prevent closing
          >
            {student.user.name}
          </DropdownMenuCheckboxItem>
        ))}

        {query === "" && (
          <div className="text-muted-foreground p-2 text-center text-sm">
            Search for more
          </div>
        )}

        {isPending && (
          <div className="text-muted-foreground p-2 text-center text-sm">
            <Loader className="mx-auto mb-1 size-4 animate-spin" />
            Loading...
          </div>
        )}

        {!isPending && studentsToShow.length === 0 && (
          <div className="text-muted-foreground p-2 text-center text-sm">
            No students found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ParentForm = ({
  type,
  data: parent,
}: {
  type: "create" | "update";
  data?: ParentDoc;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = type === "update" ? UpdateParentSchema : ParentSchema;

  const defaultValues =
    type === "update"
      ? {
          name: parent?.user.name ?? "",
          email: parent?.user.email ?? "",
          gender: parent?.user.gender ?? undefined,
          image: parent?.user.image ?? "",
          phone: parent?.user.phone ?? "",
          address: parent?.user.address ?? "",
          dateOfBirth: parent?.user.dateOfBirth
            ? new Date(parent.user.dateOfBirth)
            : undefined,
          occupation: parent?.occupation ?? "",
          relationship: parent?.relationship ?? "",
          studentIds:
            parent?.children?.map((child: StudentDoc) => child.id) || [],
          userId: parent?.user.id,
        }
      : {
          name: "",
          email: "",
          gender: undefined,
          image: "",
          phone: "",
          address: "",
          dateOfBirth: undefined,
          occupation: "",
          relationship: "",
          studentIds: [],
        };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      if (type === "update" && data) {
        const updateData = data as z.infer<typeof UpdateParentSchema>;
        const result = await updateParent(updateData);

        if (result.success) {
          toast.success("Success", {
            description: "Parent updated successfully.",
          });

          if (result.data) router.refresh();
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || "Something went wrong.",
          });
        }

        return;
      }

      const createData = data as z.infer<typeof ParentSchema>;
      const result = await createParent(createData);

      if (result.success) {
        toast.success("Success", {
          description: "Parent created successfully.",
        });

        if (result.data) router.refresh();
      } else {
        toast.error(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong.",
        });
      }
    });
  };

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
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Mother, Father, Guardian, etc."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Students</FormLabel>
                <FormControl>
                  <StudentMultiSelect
                    field={{
                      value: field.value ?? [],
                      onChange: field.onChange,
                    }}
                  />
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
            className="rounded-md max-md:w-full"
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

export default ParentForm;
