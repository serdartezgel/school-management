"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getStudents(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    students: StudentDoc[];
    isNext: boolean;
    totalStudents: number;
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

  let where: Prisma.StudentWhereInput = {};

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
  const orderBy: Prisma.StudentOrderByWithRelationInput = {
    user: { name: sort },
  };

  try {
    const totalStudents = await prisma.student.count({ where });

    const students = await prisma.student.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true,
        class: true,
        parent: { include: { user: true } },
      },
    });

    const isNext = totalStudents > skip + students.length;

    return {
      success: true,
      data: {
        students,
        isNext,
        totalStudents,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
