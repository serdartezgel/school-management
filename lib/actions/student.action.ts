"use server";

import bcrypt from "bcryptjs";
import z from "zod";

import { Prisma } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import dbConnect from "../prisma";
import {
  GetStudentsByIdSchema,
  PaginatedSearchParamsSchema,
  StudentSchema,
  UpdateStudentSchema,
} from "../validations";

type CreateStudentParams = z.infer<typeof StudentSchema>;
type UpdateStudentParams = z.infer<typeof UpdateStudentSchema>;

export async function getStudents(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    students: StudentDoc[];
    isNext: boolean;
    totalStudents: number;
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

  let where: Prisma.StudentWhereInput = {};

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
  const orderBy: Prisma.StudentOrderByWithRelationInput = {
    user: { name: sort },
  };

  try {
    const totalStudents = await prisma.student.count({ where });

    const students = await prisma.student.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: true,
        class: true,
        parent: { include: { user: true } },
      },
    });

    const isNext = totalStudents > skip + students.length;

    return {
      success: true,
      data: {
        students,
        isNext,
        totalStudents,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createStudent(
  params: CreateStudentParams,
): Promise<ActionResponse<StudentDoc>> {
  const validationResult = await action({
    params,
    schema: StudentSchema,
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
    studentId,
    bloodGroup,
    parentId,
    classId,
    emergencyContact,
    admissionDate,
  } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to create a student",
    );

  const hashedPassword = await bcrypt.hash(password, 12);

  const prisma = await dbConnect();

  try {
    const student = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          address,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          role: "STUDENT",
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

      const studentProfile = await tx.student.create({
        data: {
          userId: user.id,
          studentId,
          parentId,
          classId,
          bloodGroup,
          emergencyContact,
          admissionDate: admissionDate ? new Date(admissionDate) : null,
        },
        include: { user: true },
      });

      return studentProfile;
    });

    return { success: true, data: student };
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

export async function updateStudent(
  params: UpdateStudentParams,
): Promise<ActionResponse<StudentDoc>> {
  const validationResult = await action({
    params,
    schema: UpdateStudentSchema,
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
    studentId,
    bloodGroup,
    parentId,
    classId,
    emergencyContact,
    admissionDate,
    userId,
  } = validationResult.params!;

  if (validationResult.session?.user.role !== "ADMIN")
    throw new UnauthorizedError(
      "You do not have permission to update a student",
    );

  const prisma = await dbConnect();

  try {
    const student = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(dateOfBirth !== undefined && {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          }),
          ...(gender !== undefined && { gender }),
          ...(image !== undefined && { image }),
        },
      });

      const studentProfile = await tx.student.update({
        where: { userId },
        data: {
          studentId,
          classId,
          ...(parentId !== undefined && { parentId: parentId || null }),
          ...(bloodGroup !== undefined && { bloodGroup: bloodGroup || null }),
          ...(emergencyContact !== undefined && {
            emergencyContact: emergencyContact || null,
          }),
          ...(admissionDate !== undefined && {
            admissionDate: admissionDate ? new Date(admissionDate) : null,
          }),
        },
        include: { user: true },
      });

      return studentProfile;
    });

    return { success: true, data: student };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getStudentsById(params: GetStudentsByIdParams): Promise<
  ActionResponse<{
    students: StudentDoc[];
  }>
> {
  const validationResult = await action({
    params,
    schema: GetStudentsByIdSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { ids } = validationResult.params!;

  if (!ids || ids.length === 0) {
    return {
      success: true,
      data: { students: [] },
    };
  }

  const prisma = await dbConnect();

  try {
    const students = await prisma.student.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        user: true,
        class: true,
        parent: { include: { user: true } },
      },
    });

    return {
      success: true,
      data: {
        students,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getStudentCounts(): Promise<
  ActionResponse<StudentCounts>
> {
  const prisma = await dbConnect();

  try {
    const [total, male, female] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "STUDENT", gender: "MALE" } }),
      prisma.user.count({ where: { role: "STUDENT", gender: "FEMALE" } }),
    ]);

    return {
      success: true,
      data: { total, male, female },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
