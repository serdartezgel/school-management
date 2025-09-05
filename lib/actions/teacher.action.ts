"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getTeachers(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    teachers: TeacherDoc[];
    isNext: boolean;
    totalTeachers: number;
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
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let where: Prisma.TeacherWhereInput = {};

  if (query) {
    where = {
      OR: [
        {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  // Sorting logic
  const orderBy: Prisma.TeacherOrderByWithRelationInput = {
    user: { name: sort },
  };

  try {
    const totalTeachers = await prisma.teacher.count({ where });

    const teachers = await prisma.teacher.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true, // include user fields (name, email, etc.)
      },
    });

    const isNext = totalTeachers > skip + teachers.length;

    return {
      success: true,
      data: {
        teachers: JSON.parse(JSON.stringify(teachers)),
        isNext,
        totalTeachers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
