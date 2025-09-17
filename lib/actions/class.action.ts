"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

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
