"use server";
import z from "zod";

import { GradeType, Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getGrades(
  params: PaginatedSearchParams & {
    userId?: string;
    role?: Role;
    type: GradeType[];
  },
): Promise<
  ActionResponse<{
    grades: GradeDoc[];
    isNext: boolean;
    totalGrades: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema.extend({
      userId: z.string().optional(),
      role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
      type: z.array(
        z.enum(["ASSIGNMENT", "QUIZ", "MIDTERM", "FINAL", "PROJECT"]),
      ),
    }),
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    sort = "desc",
    sortBy = "date",
    filterByClass,
    filterBySubject,
    userId,
    role,
    type,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  // Start building where conditions
  const filterConditions: Prisma.GradeWhereInput[] = [{ type: { in: type } }];

  if (query) {
    filterConditions.push({
      OR: [
        {
          student: { user: { name: { contains: query, mode: "insensitive" } } },
        },
        {
          examStudent: {
            exam: { title: { contains: query, mode: "insensitive" } },
          },
          assignmentStudent: {
            assignment: { title: { contains: query, mode: "insensitive" } },
          },
        },
        {
          classSubject: {
            class: { name: { contains: query, mode: "insensitive" } },
          },
        },
        {
          classSubject: {
            subject: { name: { contains: query, mode: "insensitive" } },
          },
        },
        {
          teacher: {
            user: { name: { contains: query, mode: "insensitive" } },
          },
        },
        {
          academicYear: {
            year: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Filter by class
  if (filterByClass && filterByClass !== "all") {
    filterConditions.push({
      classSubject: {
        class: { name: { contains: filterByClass, mode: "insensitive" } },
      },
    });
  }

  // Filter by subject
  if (filterBySubject && filterBySubject !== "all") {
    filterConditions.push({
      classSubject: {
        subject: { name: { contains: filterBySubject, mode: "insensitive" } },
      },
    });
  }

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({
        teacher: { userId },
      });
    }
    if (role === "STUDENT") {
      filterConditions.push({
        student: { userId },
      });
    }
    if (role === "PARENT") {
      filterConditions.push({
        student: { parent: { userId } },
      });
    }
  }

  // Merge all filters into `AND`
  const where: Prisma.GradeWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  // Sorting logic
  let orderBy: Prisma.GradeOrderByWithRelationInput;
  if (sortBy === "title") {
    orderBy = { title: sort };
  } else if (sortBy === "academicYear") {
    orderBy = { academicYear: { year: sort } };
  } else if (sortBy === "subject") {
    orderBy = { classSubject: { subject: { name: sort } } };
  } else if (sortBy === "class") {
    orderBy = { classSubject: { class: { name: sort } } };
  } else if (sortBy === "teacher") {
    orderBy = { teacher: { user: { name: sort } } };
  } else {
    orderBy = { student: { user: { name: "asc" } } };
  }

  try {
    const totalGrades = await prisma.grade.count({ where });

    const grades = await prisma.grade.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        student: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        classSubject: {
          include: {
            class: { select: { id: true, name: true } },
            subject: { select: { id: true, name: true } },
          },
        },
        teacher: { include: { user: { select: { id: true, name: true } } } },
        examStudent: { include: { exam: true } },
        assignmentStudent: { include: { assignment: true } },
        academicYear: { select: { year: true } },
      },
    });

    const normalizedGrades = grades.map((g) => ({
      ...g,
      score: Number(g.score),
      maxScore: Number(g.maxScore),
    }));

    const isNext = totalGrades > skip + normalizedGrades.length;

    return {
      success: true,
      data: {
        grades: normalizedGrades,
        isNext,
        totalGrades,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
