"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createClass, updateClass } from "@/lib/actions/class.action";
import { ClassSchema, UpdateClassSchema } from "@/lib/validations";

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

const ClassForm = ({
  type,
  data: classData,
}: {
  type: "create" | "update";
  data?: ClassDoc;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = type === "update" ? UpdateClassSchema : ClassSchema;

  const defaultValues =
    type === "update"
      ? {
          grade: classData?.grade || "",
          section: classData?.section || "",
          capacity: classData?.capacity || undefined,
          academicYearId: classData?.academicYearId || "",
          id: classData?.id,
        }
      : {
          grade: "",
          section: "",
          capacity: undefined,
          academicYearId: "",
        };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      const processedData = {
        ...data,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      };
      if (type === "update" && classData) {
        const updateData = processedData as z.infer<typeof UpdateClassSchema>;
        const result = await updateClass(updateData);

        if (result.success) {
          toast.success("Success", {
            description: "Class updated successfully.",
          });

          if (result.data) router.refresh();
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || "Something went wrong.",
          });
        }

        return;
      }

      const createData = processedData as z.infer<typeof ClassSchema>;
      const result = await createClass(createData);

      if (result.success) {
        toast.success("Success", {
          description: "Class created successfully.",
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
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    value={field.value ?? undefined}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academicYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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

export default ClassForm;
