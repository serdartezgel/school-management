"use server";

import z from "zod";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import dbConnect from "../prisma";
import {
  ClassSchema,
  PaginatedSearchParamsSchema,
  UpdateClassSchema,
} from "../validations";

type CreateClassParams = z.infer<typeof ClassSchema>;
type UpdateClassParams = z.infer<typeof UpdateClassSchema>;

export async function getClasses(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    classes: ClassDoc[];
    isNext: boolean;
    totalClasses: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    sort = "asc",
    sortBy = "name",
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let where: Prisma.ClassWhereInput = {};

  if (query) {
    where = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { grade: { contains: query, mode: "insensitive" } },
        { section: { contains: query, mode: "insensitive" } },
        {
          academicYear: {
            year: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  // Sorting logic
  let orderBy: Prisma.ClassOrderByWithRelationInput;
  if (sortBy === "name" || sortBy === "grade") {
    orderBy = { [sortBy]: sort };
  } else if (sortBy === "academicYear") {
    orderBy = { academicYear: { year: sort } };
  } else {
    orderBy = { name: "asc" };
  }

  try {
    const totalClasses = await prisma.class.count({ where });

    const classes = await prisma.class.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        academicYear: true,
      },
    });

    const isNext = totalClasses > skip + classes.length;

    return {
      success: true,
      data: {
        classes,
        isNext,
        totalClasses,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createClass(
  params: CreateClassParams,
): Promise<ActionResponse<ClassDoc>> {
  const validationResult = await action({
    params,
    schema: ClassSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { grade, section, capacity, academicYearId } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError("You do not have permission to create a class");

  const prisma = await dbConnect();

  try {
    const createdClass = await prisma.class.create({
      data: {
        name: `${grade.trim()}${section.trim()}`,
        grade,
        section,
        capacity: capacity ?? 24,
        academicYearId,
      },
    });

    return { success: true, data: createdClass };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const fields = error.meta?.target as string[];
        return {
          success: false,
          error: {
            message: "Unique constraint failed",
            details: Object.fromEntries(
              fields.map((f) => [f, [`${f} must be unique`]]),
            ),
          },
          status: 400,
        } satisfies ErrorResponse;
      }
    }
    return handleError(error) as ErrorResponse;
  }
}

export async function updateClass(
  params: UpdateClassParams,
): Promise<ActionResponse<ClassDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateClassSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { grade, section, capacity, academicYearId, id } =
    validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError("You do not have permission to update a class");

  const prisma = await dbConnect();

  try {
    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) throw new NotFoundError("Class");

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...(grade || section
          ? {
              name: `${grade ?? existingClass.grade}${section ?? existingClass.section}`,
            }
          : {}),
        ...(grade && { grade }),
        ...(section && { section }),
        ...(capacity !== undefined && { capacity }),
        ...(academicYearId && { academicYearId }),
      },
    });

    return { success: true, data: updatedClass };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const fields = error.meta?.target as string[];
        return {
          success: false,
          error: {
            message: "Unique constraint failed",
            details: Object.fromEntries(
              fields.map((f) => [f, [`${f} must be unique`]]),
            ),
          },
          status: 400,
        } satisfies ErrorResponse;
      }
    }
    return handleError(error) as ErrorResponse;
  }
}
