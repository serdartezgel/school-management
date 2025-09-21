"use server";

import { cache } from "react";
import z from "zod";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import dbConnect from "../prisma";
import {
  PaginatedSearchParamsSchema,
  SubjectSchema,
  UpdateSubjectSchema,
} from "../validations";

type CreateSubjectParams = z.infer<typeof SubjectSchema>;
type UpdateSubjectParams = z.infer<typeof UpdateSubjectSchema>;

export const getSubjects = cache(async function getSubjects(
  params: PaginatedSearchParams,
): Promise<
  ActionResponse<{
    subjects: SubjectDoc[];
    isNext: boolean;
    totalSubjects: number;
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
    sortBy = "name",
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  let where: Prisma.SubjectWhereInput = {};

  if (query) {
    where = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
        {
          academicYear: {
            year: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  // Sorting logic
  let orderBy: Prisma.SubjectOrderByWithRelationInput = {};
  if (sortBy === "name" || sortBy === "code") {
    orderBy = { [sortBy]: sort };
  } else if (sortBy === "academicYear") {
    orderBy = { academicYear: { year: sort } };
  } else {
    orderBy = { name: "asc" };
  }

  try {
    const totalSubjects = await prisma.subject.count({ where });

    const subjects = await prisma.subject.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        academicYear: true,
      },
    });

    const isNext = totalSubjects > skip + subjects.length;

    return {
      success: true,
      data: {
        subjects,
        isNext,
        totalSubjects,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function createSubject(
  params: CreateSubjectParams,
): Promise<ActionResponse<SubjectDoc>> {
  const validationResult = await action({
    params,
    schema: SubjectSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, code, description, credits, academicYearId } =
    validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to create a subject",
    );

  const prisma = await dbConnect();

  try {
    const createdSubject = await prisma.subject.create({
      data: {
        name,
        code,
        academicYearId,
        ...(description ? { description } : {}),
        ...(credits !== undefined ? { credits } : {}),
      },
    });

    return { success: true, data: createdSubject };
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

export async function updateSubject(
  params: UpdateSubjectParams,
): Promise<ActionResponse<SubjectDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateSubjectSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, code, description, credits, academicYearId, id } =
    validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to update a subject",
    );

  const prisma = await dbConnect();

  try {
    const existingSubject = await prisma.subject.findUnique({ where: { id } });
    if (!existingSubject) throw new NotFoundError("Subject");

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(description && { description }),
        ...(credits !== undefined && { credits }),
        ...(academicYearId && { academicYearId }),
      },
    });

    return { success: true, data: updatedSubject };
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
