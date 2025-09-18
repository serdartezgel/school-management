"use server";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { PaginatedSearchParamsSchema } from "../validations";

export async function getParents(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    parents: ParentDoc[];
    isNext: boolean;
    totalParents: number;
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
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let where: Prisma.ParentWhereInput = {};

  if (query) {
    where = {
      OR: [
        { user: { name: { contains: query, mode: "insensitive" } } },
        {
          children: {
            some: { user: { name: { contains: query, mode: "insensitive" } } },
          },
        },
      ],
    };
  }

  // Sorting logic
  const orderBy: Prisma.ParentOrderByWithRelationInput = {
    user: { name: sort },
  };

  try {
    const totalParents = await prisma.parent.count({ where });

    const parents = await prisma.parent.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true,
        children: { include: { user: true } },
      },
    });

    const isNext = totalParents > skip + parents.length;

    return {
      success: true,
      data: {
        parents,
        isNext,
        totalParents,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
