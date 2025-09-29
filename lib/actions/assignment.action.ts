"use server";
import z from "zod";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getAssignments(
  params: PaginatedSearchParams & { userId?: string; role?: Role },
): Promise<
  ActionResponse<{
    assignments: AssignmentStudentDoc[];
    isNext: boolean;
    totalAssignments: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema.extend({
      userId: z.string().optional(),
      role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
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
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  // Start building where conditions
  const filterConditions: Prisma.AssignmentStudentWhereInput[] = [];

  if (query) {
    filterConditions.push({
      OR: [
        {
          student: { user: { name: { contains: query, mode: "insensitive" } } },
        },
        { assignment: { title: { contains: query, mode: "insensitive" } } },
        {
          assignment: {
            classSubject: {
              class: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          assignment: {
            classSubject: {
              subject: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          assignment: {
            teacher: {
              user: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          assignment: {
            academicYear: {
              year: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  // Filter by class
  if (filterByClass && filterByClass !== "all") {
    filterConditions.push({
      assignment: {
        classSubject: {
          class: { name: { contains: filterByClass, mode: "insensitive" } },
        },
      },
    });
  }

  // Filter by subject
  if (filterBySubject && filterBySubject !== "all") {
    filterConditions.push({
      assignment: {
        classSubject: {
          subject: { name: { contains: filterBySubject, mode: "insensitive" } },
        },
      },
    });
  }

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({
        assignment: { teacher: { userId } },
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
  const where: Prisma.AssignmentStudentWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  // Sorting logic
  let orderBy: Prisma.AssignmentStudentOrderByWithRelationInput;
  if (sortBy === "title") {
    orderBy = { assignment: { title: sort } };
  } else if (sortBy === "academicYear") {
    orderBy = { assignment: { academicYear: { year: sort } } };
  } else if (sortBy === "subject") {
    orderBy = { assignment: { classSubject: { subject: { name: sort } } } };
  } else if (sortBy === "class") {
    orderBy = { assignment: { classSubject: { class: { name: sort } } } };
  } else {
    orderBy = { student: { user: { name: "asc" } } };
  }

  try {
    const totalAssignments = await prisma.assignmentStudent.count({ where });

    const assignments = await prisma.assignmentStudent.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        assignment: {
          include: {
            academicYear: true,
            classSubject: { include: { class: true, subject: true } },
            teacher: { include: { user: true } },
          },
        },
        student: { include: { user: true } },
        grade: { select: { score: true } },
      },
    });

    // Convert Decimal to number
    const plainAssignments = assignments.map((assignmentStudent) => ({
      ...assignmentStudent,
      grade: assignmentStudent.grade
        ? {
            ...assignmentStudent.grade,
            score: Number(assignmentStudent.grade.score),
          }
        : null,
    }));

    const isNext = totalAssignments > skip + plainAssignments.length;

    return {
      success: true,
      data: {
        assignments: plainAssignments,
        isNext,
        totalAssignments,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
