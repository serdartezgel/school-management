"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import dbConnect from "../prisma";
import {
  AttendanceSchema,
  GetAttendanceNumbersSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getAttendances(
  params: PaginatedSearchParams & { userId?: string; role?: Role },
): Promise<
  ActionResponse<{
    attendances: StudentWithAttendanceDoc[];
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
    query,
    date,
    sort = "asc",
    sortBy = "class",
    filterByClass,
    filterBySubject,
    userId,
    role,
  } = validationResult.params!;

  // Start building where conditions
  const filterConditions: Prisma.ClassSubjectWhereInput[] = [];

  // Query search
  if (query) {
    filterConditions.push({
      OR: [
        {
          class: {
            students: {
              some: {
                user: { name: { contains: query, mode: "insensitive" } },
              },
            },
          },
        },
        {
          teacher: {
            user: { name: { contains: query, mode: "insensitive" } },
          },
        },
        {
          class: { name: { contains: query, mode: "insensitive" } },
        },
        {
          subject: { name: { contains: query, mode: "insensitive" } },
        },
        {
          class: {
            academicYear: { year: { contains: query, mode: "insensitive" } },
          },
        },
      ],
    });
  }

  // Filter by class
  if (filterByClass && filterByClass !== "all") {
    filterConditions.push({
      class: { name: { contains: filterByClass, mode: "insensitive" } },
    });
  }

  // Filter by subject
  if (filterBySubject && filterBySubject !== "all") {
    filterConditions.push({
      subject: { name: { contains: filterBySubject, mode: "insensitive" } },
    });
  }

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({
        teacher: { userId },
      });
    }
  }

  // Merge all filters into `AND`
  const where: Prisma.ClassSubjectWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  // Sorting logic
  let orderBy: Prisma.ClassSubjectOrderByWithRelationInput;

  if (sortBy === "teacher") {
    orderBy = { teacher: { user: { name: sort } } };
  } else if (sortBy === "class") {
    orderBy = { class: { name: sort } };
  } else if (sortBy === "subject") {
    orderBy = { subject: { name: sort } };
  } else {
    orderBy = { class: { name: "asc" } }; // default
  }

  try {
    const classSubjects = await prisma.classSubject.findMany({
      where,
      orderBy,
      include: {
        class: {
          include: {
            students: {
              include: {
                user: true,
                parent: { include: { user: true } },
              },
            },
            academicYear: true,
          },
        },
        subject: true,
        teacher: { include: { user: true } },
        attendances: true,
      },
    });

    const studentsWithAttendance: StudentWithAttendanceDoc[] =
      classSubjects.flatMap((cs) =>
        cs.class.students
          // Filter students based on role
          .filter((student) => {
            if (role === "STUDENT") return student.user.id === userId;
            if (role === "PARENT") return student.parent?.userId === userId;
            return true; // TEACHER / ADMIN see all
          })
          .map((student) => {
            // Find attendance record for the selected date only
            const attendanceForDate = date
              ? cs.attendances.find((a) => {
                  const aDate = new Date(a.date);
                  const targetDate = new Date(date);
                  return (
                    a.studentId === student.id &&
                    aDate.getFullYear() === targetDate.getFullYear() &&
                    aDate.getMonth() === targetDate.getMonth() &&
                    aDate.getDate() === targetDate.getDate()
                  );
                })
              : undefined;

            return {
              ...student,
              classSubject: cs,
              attendanceStatus: attendanceForDate?.status ?? "PENDING",
            };
          }),
      );

    return {
      success: true,
      data: {
        attendances: studentsWithAttendance,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getAttendanceNumbers(
  params: GetAttendanceNumbersParams,
): Promise<
  ActionResponse<{
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetAttendanceNumbersSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { date, userId, role } = validationResult.params!;

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let where: Prisma.AttendanceWhereInput = {
      date: { gte: startOfDay, lte: endOfDay },
    };

    if (userId && role) {
      if (role === "TEACHER") {
        where = {
          ...where,
          classSubject: {
            teacher: {
              userId,
            },
          },
        };
      }
      if (role === "STUDENT") {
        where = {
          ...where,
          student: {
            userId,
          },
        };
      }
      if (role === "PARENT") {
        where = {
          ...where,
          student: {
            parent: {
              userId,
            },
          },
        };
      }
    }

    const attendances = await prisma.attendance.findMany({
      where,
      select: { status: true },
    });

    const numbers = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: attendances.length,
    };

    attendances.forEach((a) => {
      if (a.status === "PRESENT") numbers.present++;
      if (a.status === "ABSENT") numbers.absent++;
      if (a.status === "LATE") numbers.late++;
      if (a.status === "EXCUSED") numbers.excused++;
    });

    return {
      success: true,
      data: numbers,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

type UpdateAttendanceParams = z.infer<typeof AttendanceSchema>;

export async function updateAttendanceStatus(
  params: UpdateAttendanceParams,
): Promise<ActionResponse<AttendanceDoc>> {
  const validationResult = await action({
    params,
    schema: AttendanceSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { studentId, classSubjectId, date, status, academicYearId } =
    validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError("You do not have permission to create a class");

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const prisma = await dbConnect();

  try {
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_classSubjectId_date: {
          studentId,
          classSubjectId,
          date: attendanceDate,
        },
      },
      update: {
        status,
      },
      create: {
        studentId,
        classSubjectId,
        date: attendanceDate,
        status,
        academicYearId,
      },
    });
    revalidatePath("/attendances");

    return { success: true, data: attendance };
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
