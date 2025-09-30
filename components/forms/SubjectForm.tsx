"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createSubject, updateSubject } from "@/lib/actions/subject.action";
import { SubjectSchema, UpdateSubjectSchema } from "@/lib/validations";

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
import { Textarea } from "../ui/textarea";

const SubjectForm = ({
  type,
  data: subject,
}: {
  type: "create" | "update";
  data?: SubjectDoc;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = type === "update" ? UpdateSubjectSchema : SubjectSchema;

  const defaultValues =
    type === "update"
      ? {
          name: subject?.name || "",
          code: subject?.code || "",
          description: subject?.description || "",
          credits: subject?.credits || undefined,
          academicYearId: subject?.academicYearId || "",
          id: subject?.id,
        }
      : {
          name: "",
          code: "",
          description: "",
          credits: undefined,
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
        credits: data.credits ? Number(data.credits) : undefined,
      };
      if (type === "update" && subject) {
        const updateData = processedData as z.infer<typeof UpdateSubjectSchema>;
        const result = await updateSubject(updateData);

        if (result.success) {
          toast.success("Success", {
            description: "Subject updated successfully.",
          });

          if (result.data) router.refresh();
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || "Something went wrong.",
          });
        }

        return;
      }

      const createData = processedData as z.infer<typeof SubjectSchema>;
      const result = await createSubject(createData);

      if (result.success) {
        toast.success("Success", {
          description: "Subject created successfully.",
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
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

export default SubjectForm;
