"use server";
import { endOfDay, startOfDay } from "date-fns";
import z from "zod";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getEvents(
  params: PaginatedSearchParams & { userId?: string; role?: Role },
): Promise<
  ActionResponse<{
    events: EventDoc[];
    isNext: boolean;
    totalEvents: number;
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
    date,
    userId,
    role,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  // Start building where conditions
  const filterConditions: Prisma.EventWhereInput[] = [];

  if (query) {
    filterConditions.push({
      OR: [
        {
          title: { contains: query, mode: "insensitive" },
        },
        { location: { contains: query, mode: "insensitive" } },
        {
          classes: {
            some: { class: { name: { contains: query, mode: "insensitive" } } },
          },
        },
      ],
    });
  }

  // Filter by class
  if (filterByClass && filterByClass !== "all") {
    filterConditions.push({
      OR: [
        {
          classes: {
            some: {
              class: { name: { contains: filterByClass, mode: "insensitive" } },
            },
          },
        },
        { classes: { none: {} } },
      ],
    });
  }

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({
        roles: { some: { role: "TEACHER" } },
      });
    }
    if (role === "STUDENT") {
      filterConditions.push({
        roles: { some: { role: "STUDENT" } },
      });
    }
    if (role === "PARENT") {
      filterConditions.push({
        roles: { some: { role: { in: ["STUDENT", "PARENT"] } } },
      });
    }
  }

  if (date) {
    const start = startOfDay(new Date(date));
    const end = endOfDay(new Date(date));

    filterConditions.push({
      startDate: { lte: end },
      endDate: { gte: start },
    });
  }

  // Merge all filters into `AND`
  const where: Prisma.EventWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  // Sorting logic
  let orderBy: Prisma.EventOrderByWithRelationInput[];
  if (sortBy === "title") {
    orderBy = [{ isImportant: "desc" }, { title: sort }];
  } else if (sortBy === "date") {
    orderBy = [{ isImportant: "desc" }, { startDate: sort }];
  } else {
    orderBy = [{ isImportant: "desc" }, { title: "asc" }];
  }

  try {
    const totalEvents = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        classes: { include: { class: { select: { id: true, name: true } } } },
        roles: true,
      },
    });

    const isNext = totalEvents > skip + events.length;

    return {
      success: true,
      data: {
        events,
        isNext,
        totalEvents,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getEventDays(
  params: PaginatedSearchParams & {
    userId?: string;
    role?: Role;
    month: string;
  },
): Promise<ActionResponse<{ days: string[] }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema.extend({
      userId: z.string().optional(),
      role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
      month: z.string(),
    }),
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { month, role, userId } = validationResult.params!;

  const startOfMonth = new Date(month);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  // Build filters
  const filterConditions: Prisma.EventWhereInput[] = [
    {
      startDate: { lte: endOfMonth },
      endDate: { gte: startOfMonth },
    },
  ];

  if (userId && role) {
    if (role === "TEACHER") {
      filterConditions.push({ roles: { some: { role: "TEACHER" } } });
    } else if (role === "STUDENT") {
      filterConditions.push({ roles: { some: { role: "STUDENT" } } });
    } else if (role === "PARENT") {
      filterConditions.push({
        roles: { some: { role: { in: ["STUDENT", "PARENT"] } } },
      });
    }
  }

  const where: Prisma.EventWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  const orderBy: Prisma.EventOrderByWithRelationInput[] = [
    { isImportant: "desc" },
    { title: "asc" },
  ];

  try {
    const events = await prisma.event.findMany({
      where,
      orderBy,
      select: { startDate: true },
    });

    // Extract unique days
    const days = Array.from(
      new Set(events.map((e) => e.startDate.toISOString().split("T")[0])),
    );

    return {
      success: true,
      data: { days },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
