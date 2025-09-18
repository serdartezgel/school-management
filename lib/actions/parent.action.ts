"use server";

import bcrypt from "bcryptjs";
import z from "zod";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import dbConnect from "../prisma";
import {
  PaginatedSearchParamsSchema,
  ParentSchema,
  UpdateParentSchema,
} from "../validations";

type CreateParentParams = z.infer<typeof ParentSchema>;
type UpdateParentParams = z.infer<typeof UpdateParentSchema>;

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

export async function createParent(
  params: CreateParentParams,
): Promise<ActionResponse<ParentDoc>> {
  const validationResult = await action({
    params,
    schema: ParentSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    name,
    email,
    phone,
    address,
    dateOfBirth,
    gender,
    image,
    username,
    password,
    occupation,
    relationship,
    studentIds = [],
  } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to create a parent",
    );

  const hashedPassword = await bcrypt.hash(password, 12);

  const prisma = await dbConnect();

  try {
    const parent = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          role: "PARENT",
          image,
          createdById: validationResult.session?.user.id,
        },
      });

      // 2. Create Account
      await tx.account.create({
        data: {
          userId: user.id,
          username,
          password: hashedPassword,
        },
      });

      // 3. Create Parent
      const parentProfile = await tx.parent.create({
        data: {
          userId: user.id,
          occupation,
          relationship,
        },
        include: { user: true, children: { include: { user: true } } },
      });

      // 4. Connect selected students
      if (studentIds.length > 0) {
        await tx.student.updateMany({
          where: { id: { in: studentIds } },
          data: { parentId: parentProfile.id },
        });
      }

      return parentProfile;
    });

    return { success: true, data: parent };
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

export async function updateParent(
  params: UpdateParentParams,
): Promise<ActionResponse<ParentDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateParentSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, studentIds, occupation, relationship, ...userData } =
    validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to update a parent",
    );

  const prisma = await dbConnect();

  try {
    const updatedParent = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: userData,
      });

      const parent = await tx.parent.update({
        where: { userId },
        data: {
          ...(occupation !== undefined && { occupation }),
          ...(relationship !== undefined && { relationship }),
        },
      });

      // Update student-parent relations if studentIds provided
      if (studentIds) {
        // Disconnect all existing children first
        await tx.student.updateMany({
          where: { parentId: parent.id },
          data: { parentId: null },
        });

        // Connect new children
        await tx.student.updateMany({
          where: { id: { in: studentIds } },
          data: { parentId: parent.id },
        });
      }

      return parent;
    });

    return { success: true, data: updatedParent };
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
