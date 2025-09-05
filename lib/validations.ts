import z from "zod";

export const SignInSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9.]+$/, {
      message: "Username can only contain letters, numbers, and dots.",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().min(0, "Page must be at least 0").default(0),
  pageSize: z.number().int().min(1, "Page size must be at least 1").default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
