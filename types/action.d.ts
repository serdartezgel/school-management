import { Prisma } from "@prisma/client";

declare global {
  interface AuthCredentials {
    name: string;
    username: string;
    role: string;
    password: string;
  }

  interface GetStudentsByIdParams {
    ids: string[];
  }

  export type TeacherDoc = Prisma.TeacherGetPayload<{
    include: {
      user: true;
    };
  }>;
  export type TeacherAccount = Prisma.TeacherGetPayload<{
    include: {
      user: {
        include: {
          account: true;
        };
      };
    };
  }>;

  type StudentDoc = Prisma.StudentGetPayload<{
    include: {
      user: true;
      class: true;
      parent: {
        include: {
          user: true;
          children: true;
        };
      };
    };
  }>;
  export type StudentAccount = Prisma.StudentGetPayload<{
    include: {
      user: {
        include: {
          account: true;
        };
      };
    };
  }>;

  export type ParentDoc = Prisma.ParentGetPayload<{
    include: {
      user: true;
      children: true;
    };
  }>;

  export type ParentAccount = Prisma.ParentGetPayload<{
    include: {
      user: {
        include: {
          account: true;
        };
      };
    };
  }>;

  export type ClassDoc = Prisma.ClassGetPayload<{
    include: { academicYear: true };
  }>;

  export type SubjectDoc = Prisma.SubjectGetPayload<{
    include: { academicYear: true };
  }>;
}
