import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getSubjects(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    subjects: SubjectDoc[];
    isNext: boolean;
    totalSubjects: number;
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

  let where: Prisma.SubjectWhereInput = {};

  if (query) {
    where = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
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
  let orderBy: Prisma.SubjectOrderByWithRelationInput = {};
  if (sortBy === "name" || sortBy === "code") {
    orderBy = { [sortBy]: sort };
  } else if (sortBy === "academicYear") {
    orderBy = { academicYear: { year: sort } };
  } else {
    orderBy = { name: "asc" };
  }

  try {
    const totalSubjects = await prisma.subject.count({ where });

    const subjects = await prisma.subject.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        academicYear: true,
      },
    });

    const isNext = totalSubjects > skip + subjects.length;

    return {
      success: true,
      data: {
        subjects,
        isNext,
        totalSubjects,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
