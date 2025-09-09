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
  TeacherSchema,
  UpdateTeacherSchema,
} from "../validations";

type CreateTeacherParams = z.infer<typeof TeacherSchema>;
type UpdateTeacherParams = z.infer<typeof UpdateTeacherSchema>;

export async function getTeachers(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    teachers: TeacherDoc[];
    isNext: boolean;
    totalTeachers: number;
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

  let where: Prisma.TeacherWhereInput = {};

  if (query) {
    where = {
      OR: [
        {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    };
  }

  // Sorting logic
  const orderBy: Prisma.TeacherOrderByWithRelationInput = {
    user: { name: sort },
  };

  try {
    const totalTeachers = await prisma.teacher.count({ where });

    const teachers = await prisma.teacher.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true,
      },
    });

    const isNext = totalTeachers > skip + teachers.length;

    return {
      success: true,
      data: {
        teachers,
        isNext,
        totalTeachers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createTeacher(
  params: CreateTeacherParams,
): Promise<ActionResponse<TeacherDoc>> {
  const validationResult = await action({
    params,
    schema: TeacherSchema,
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
    employeeId,
    department,
    experience,
    hireDate,
  } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to create a teacher",
    );

  const hashedPassword = await bcrypt.hash(password, 12);

  const prisma = await dbConnect();

  try {
    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          role: "TEACHER",
          image,
          createdById: validationResult.session?.user.id,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          username,
          password: hashedPassword,
        },
      });

      const teacherProfile = await tx.teacher.create({
        data: {
          userId: user.id,
          employeeId,
          department,
          experience,
          hireDate: hireDate ? new Date(hireDate) : null,
        },
        include: { user: true },
      });

      return teacherProfile;
    });

    return { success: true, data: teacher };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateTeacher(
  params: UpdateTeacherParams,
): Promise<ActionResponse<TeacherDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateTeacherSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    userId,
    name,
    email,
    phone,
    address,
    dateOfBirth,
    gender,
    image,
    employeeId,
    department,
    experience,
    hireDate,
  } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to update a teacher",
    );

  const prisma = await dbConnect();

  try {
    const teacher = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(gender && { gender }),
          ...(image && { image }),
        },
      });

      const teacherProfile = await tx.teacher.update({
        where: { userId },
        data: {
          ...(employeeId && { employeeId }),
          ...(department && { department }),
          ...(experience !== undefined && { experience }),
          ...(hireDate && { hireDate: new Date(hireDate) }),
        },
        include: { user: true },
      });

      return teacherProfile;
    });

    return { success: true, data: teacher };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
