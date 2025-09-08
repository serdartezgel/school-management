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

export const TeacherSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name needs to be at least 3 characters." }),
  email: z.email({ message: "Invalid email." }),
  phone: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
    .or(z.literal("")),
  address: z.string().max(255).optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required." }),
  dateOfBirth: z.date().optional(),
  image: z.url().or(z.literal("")),

  username: z
    .string()
    .min(3, "Username needs to be at least 3 characters.")
    .max(20, "Username can be maximum of 20 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),

  employeeId: z.string().min(4, "Employee ID is required."),
  department: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  hireDate: z.date().optional(),
});
