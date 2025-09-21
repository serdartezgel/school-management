"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import {
  GetAttendanceNumbersSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function getAttendances(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    attendances: AttendanceDoc[];
    isNext: boolean;
    totalAttendances: number;
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
    sort = "desc",
    sortBy = "date",
    filter = "all",
    filterBy,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let where: Prisma.AttendanceWhereInput = {};

  if (query) {
    where.OR = [
      {
        student: {
          user: { name: { contains: query, mode: "insensitive" } },
        },
      },
      {
        teacher: {
          teacher: {
            user: { name: { contains: query, mode: "insensitive" } },
          },
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
        academicYear: { year: { contains: query, mode: "insensitive" } },
      },
    ];
  }

  if (filter && filterBy && filter !== "all") {
    const filterCondition: Prisma.AttendanceWhereInput =
      filterBy === "classes"
        ? {
            classSubject: {
              class: { name: { contains: filter, mode: "insensitive" } },
            },
          }
        : filterBy === "subjects"
          ? {
              classSubject: {
                subject: { name: { contains: filter, mode: "insensitive" } },
              },
            }
          : {};
    const existingAnd = Array.isArray(where.AND)
      ? where.AND
      : where.AND
        ? [where.AND]
        : [];
    where = { ...where, AND: [...existingAnd, filterCondition] };
  }

  // Sorting logic
  let orderBy: Prisma.AttendanceOrderByWithRelationInput;
  if (sortBy === "date" || sortBy === "status") {
    orderBy = { [sortBy]: sort };
  } else if (sortBy === "student") {
    orderBy = { student: { user: { name: sort } } };
  } else if (sortBy === "class") {
    orderBy = { classSubject: { class: { name: sort } } };
  } else if (sortBy === "subject") {
    orderBy = { classSubject: { subject: { name: sort } } };
  } else {
    orderBy = { date: "desc" }; // default
  }

  try {
    const totalAttendances = await prisma.attendance.count({ where });

    const attendances = await prisma.attendance.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        student: { include: { user: true } },
        classSubject: { include: { class: true, subject: true } },
        teacher: { include: { teacher: { include: { user: true } } } },
        academicYear: true,
      },
    });

    const isNext = totalAttendances > skip + attendances.length;

    return {
      success: true,
      data: {
        attendances,
        isNext,
        totalAttendances,
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

  const { date } = validationResult.params!;

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const where: Prisma.AttendanceWhereInput = {
      date: { gte: startOfDay, lte: endOfDay },
    };

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
