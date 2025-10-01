"use server";
import z from "zod";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getAnnouncements(
  params: PaginatedSearchParams & { userId?: string; role?: Role },
): Promise<
  ActionResponse<{
    announcements: AnnouncementDoc[];
    isNext: boolean;
    totalAnnouncements: number;
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
    userId,
    role,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  // Start building where conditions
  const filterConditions: Prisma.AnnouncementWhereInput[] = [];

  if (query) {
    filterConditions.push({
      OR: [
        {
          title: { contains: query, mode: "insensitive" },
        },
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
        OR: [
          { roles: { some: { role: "TEACHER" } } },
          { roles: { none: {} } }, // general
        ],
      });
    }
    if (role === "STUDENT") {
      filterConditions.push({
        OR: [
          { roles: { some: { role: "STUDENT" } } },
          { roles: { none: {} } }, // general
        ],
      });
    }
    if (role === "PARENT") {
      filterConditions.push({
        OR: [
          { roles: { some: { role: { in: ["STUDENT", "PARENT"] } } } },
          { roles: { none: {} } }, // general
        ],
      });
    }
  }

  // Merge all filters into `AND`
  const where: Prisma.AnnouncementWhereInput =
    filterConditions.length > 0 ? { AND: filterConditions } : {};

  const now = new Date();

  if (role !== "ADMIN") {
    (where.AND as Prisma.AnnouncementWhereInput[]).push({
      publishDate: { lte: now },
    });

    (where.AND as Prisma.AnnouncementWhereInput[]).push({
      OR: [{ expiryDate: null }, { expiryDate: { gte: now } }],
    });
  }

  // Sorting logic
  let orderBy: Prisma.AnnouncementOrderByWithRelationInput[];
  if (sortBy === "title") {
    orderBy = [{ isImportant: "desc" }, { title: sort }];
  } else if (sortBy === "date") {
    orderBy = [{ isImportant: "desc" }, { publishDate: sort }];
  } else {
    orderBy = [{ isImportant: "desc" }, { title: "asc" }];
  }

  try {
    const totalAnnouncements = await prisma.announcement.count({ where });

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        classes: { include: { class: { select: { id: true, name: true } } } },
        roles: true,
      },
    });

    const isNext = totalAnnouncements > skip + announcements.length;

    return {
      success: true,
      data: {
        announcements,
        isNext,
        totalAnnouncements,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
