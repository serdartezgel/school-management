"use server";
import z from "zod";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getExams(
  params: PaginatedSearchParams & { userId?: string; role?: Role },
): Promise<
  ActionResponse<{
    exams: ExamStudentDoc[];
    isNext: boolean;
    totalExams: number;
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
  const filterConditions: Prisma.ExamStudentWhereInput[] = [];

  if (query) {
    filterConditions.push({
      OR: [
        {
          student: { user: { name: { contains: query, mode: "insensitive" } } },
        },
        { exam: { title: { contains: query, mode: "insensitive" } } },
        {
          exam: {
            classSubject: {
              class: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          exam: {
            classSubject: {
              subject: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          exam: {
            teacher: {
              user: { name: { contains: query, mode: "insensitive" } },
            },
          },
        },
        {
          exam: {
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
      exam: {
        classSubject: {
          class: { name: { contains: filterByClass, mode: "insensitive" } },
        },
      },
    });
  }

  // Filter by subject
  if (filterBySubject && filterBySubject !== "all") {
    filterConditions.push({
      exam: {
        classSubject: {
          subject: { name: { contains: filterBySubject, mode: "insensitive" } },
        },
      },
    });
  }

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({
        exam: { teacher: { userId } },
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
  const where: Prisma.ExamStudentWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  // Sorting logic
  let orderBy: Prisma.ExamStudentOrderByWithRelationInput;
  if (sortBy === "title") {
    orderBy = { exam: { title: sort } };
  } else if (sortBy === "academicYear") {
    orderBy = { exam: { academicYear: { year: sort } } };
  } else if (sortBy === "subject") {
    orderBy = { exam: { classSubject: { subject: { name: sort } } } };
  } else if (sortBy === "class") {
    orderBy = { exam: { classSubject: { class: { name: sort } } } };
  } else {
    orderBy = { student: { user: { name: "asc" } } };
  }

  try {
    const totalExams = await prisma.examStudent.count({ where });

    const exams = await prisma.examStudent.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        exam: {
          include: {
            academicYear: true,
            classSubject: { include: { class: true, subject: true } },
            teacher: { include: { user: true } },
            grades: true,
          },
        },
        student: { include: { user: true } },
        grade: { select: { score: true } },
      },
    });

    // Convert Decimal to number
    const plainExams = exams.map((examStudent) => ({
      ...examStudent,
      grade: examStudent.grade
        ? { ...examStudent.grade, score: Number(examStudent.grade.score) }
        : null,
      exam: {
        ...examStudent.exam,
        grades: examStudent.exam.grades.map((grade) => ({
          ...grade,
          score: Number(grade.score),
          maxScore: Number(grade.maxScore),
        })),
      },
    }));

    const isNext = totalExams > skip + plainExams.length;

    return {
      success: true,
      data: {
        exams: plainExams,
        isNext,
        totalExams,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
