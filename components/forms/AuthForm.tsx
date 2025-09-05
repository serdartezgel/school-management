"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import z, { ZodType } from "zod";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast.success("Success", {
        description: "Signed in successfully.",
      });

      router.push("/");
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel>
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    type={field.name === "password" ? "password" : "text"}
                    className="bg-background no-focus min-h-12 rounded-md border border-cyan-700 text-gray-600 dark:text-gray-300"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="cursor-pointer bg-cyan-700 text-cyan-50 hover:bg-cyan-600"
        >
          {form.formState.isSubmitting ? "Signing In" : "Sign In"}
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Having trouble signing in? Please contact the administration office
          for assistance.
        </p>
      </form>
    </Form>
  );
};

export default AuthForm;
