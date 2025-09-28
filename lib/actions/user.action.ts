"use server";

import { Prisma, Role } from "@/prisma/client";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../prisma";
import { GetAllUsersByRoleSchema } from "../validations";

export async function getAllUsersByRole(params: {
  userId: string | undefined;
  userRole: Role | undefined;
}): Promise<ActionResponse<{ users: UserDoc[] }>> {
  const validationResult = await action({
    params,
    schema: GetAllUsersByRoleSchema,
  });

  const prisma = await dbConnect();

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, userRole } = validationResult.params!;

  try {
    let studentClassId: string | undefined;
    if (userRole === Role.STUDENT) {
      const student = await prisma.student.findUnique({
        where: { userId },
        select: { classId: true },
      });
      studentClassId = student?.classId;
    }

    let childrenClassIds: string[] = [];
    if (userRole === Role.PARENT) {
      const children = await prisma.student.findMany({
        where: { parent: { userId } },
        select: { classId: true },
      });
      childrenClassIds = children.map((c) => c.classId);
    }

    const where: Prisma.UserWhereInput = {
      NOT: { id: userId },
    };

    switch (userRole) {
      case Role.ADMIN:
        break;

      case Role.TEACHER:
        where.OR = [
          {
            studentProfile: {
              class: {
                teachers: { some: { teacher: { userId } } },
              },
            },
          },
          {
            studentProfile: {
              class: {
                subjects: {
                  some: { teacher: { userId } },
                },
              },
            },
          },
          {
            parentProfile: {
              children: {
                some: {
                  OR: [
                    {
                      class: {
                        teachers: { some: { teacher: { userId } } },
                      },
                    },
                    {
                      class: {
                        subjects: { some: { teacher: { userId } } },
                      },
                    },
                  ],
                },
              },
            },
          },
          { role: { in: [Role.ADMIN, Role.TEACHER] } },
        ];
        break;
      case Role.STUDENT:
        where.role = Role.STUDENT;
        where.studentProfile = { classId: studentClassId };
        break;

      case Role.PARENT:
        where.role = Role.TEACHER;
        where.OR = [
          {
            teacherProfile: {
              classes: { some: { classId: { in: childrenClassIds } } },
            },
          },
          {
            teacherProfile: {
              classSubjects: { some: { classId: { in: childrenClassIds } } },
            },
          },
        ];
        break;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        role: true,
        studentProfile: { select: { classId: true, parentId: true } },
        parentProfile: { select: { children: { select: { id: true } } } },
      },
    });

    // Optional: Custom role ordering
    const roleOrder = [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT];
    users.sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

    return { success: true, data: { users } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
