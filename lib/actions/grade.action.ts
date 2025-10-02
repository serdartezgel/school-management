"use server";
import z from "zod";

import { GradeType, Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import {
  GetGradesChartDataSchema,
  GetTeacherPendingGradesSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

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

export async function getGradesChartData(params: {
  type: GradeType[];
}): Promise<ActionResponse<{ grade: string; count: number }[]>> {
  const validationResult = await action({
    params,
    schema: GetGradesChartDataSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { type } = validationResult.params!;

  try {
    const grades = await prisma.grade.findMany({
      where: {
        type: { in: type },
      },
      select: {
        score: true,
        maxScore: true,
        type: true,
      },
    });

    const ranges = [
      { label: "0-44", min: 0, max: 44 },
      { label: "45-54", min: 45, max: 54 },
      { label: "55-69", min: 55, max: 69 },
      { label: "70-84", min: 70, max: 84 },
      { label: "85-100", min: 85, max: 100 },
    ];

    // Count students per range
    const data = ranges.map((range) => {
      const count = grades.filter(
        (g) =>
          g.score !== null &&
          g.maxScore !== null &&
          // Convert score to percentage
          (Number(g.score) / Number(g.maxScore)) * 100 >= range.min &&
          (Number(g.score) / Number(g.maxScore)) * 100 <= range.max,
      ).length;

      return { grade: range.label, count };
    });

    return { success: true, data };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTeacherPendingGrades(params: {
  userId: string;
}): Promise<ActionResponse<TeacherTasks[]>> {
  const validationResult = await action({
    params,
    schema: GetTeacherPendingGradesSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    // Fetch assignments and exams that are not yet graded
    const assignments = await prisma.assignmentStudent.findMany({
      where: {
        assignment: { teacher: { userId } },
        grade: null, // non-graded
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            classSubject: {
              include: {
                class: { select: { name: true } },
                subject: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const exams = await prisma.examStudent.findMany({
      where: {
        exam: { teacher: { userId } },
        grade: null, // non-graded
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            examDate: true,
            classSubject: {
              include: {
                class: { select: { name: true } },
                subject: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // Map assignments to unified format
    let assignmentTasks = assignments.map((a) => ({
      id: a.assignment.id,
      title: a.assignment.title,
      type: "assignment",
      date: a.assignment.dueDate,
      className: a.assignment.classSubject.class.name,
      subject: a.assignment.classSubject.subject.name,
      graded: false,
    }));

    // Remove duplicate assignments by id
    const seenAssignments = new Set<string>();
    assignmentTasks = assignmentTasks.filter((task) => {
      if (seenAssignments.has(task.id)) return false;
      seenAssignments.add(task.id);
      return true;
    });

    // Map exams to unified format
    let examTasks = exams.map((e) => ({
      id: e.exam.id,
      title: e.exam.title,
      type: "exam",
      date: e.exam.examDate,
      className: e.exam.classSubject.class.name,
      subject: e.exam.classSubject.subject.name,
      graded: false,
    }));

    // Remove duplicate exams by id
    const seenExams = new Set<string>();
    examTasks = examTasks.filter((task) => {
      if (seenExams.has(task.id)) return false;
      seenExams.add(task.id);
      return true;
    });

    // Combine assignments and exams
    const tasks = [...assignmentTasks, ...examTasks];

    return { success: true, data: tasks };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
