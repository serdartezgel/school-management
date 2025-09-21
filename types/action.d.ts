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
  type StudentAccount = Prisma.StudentGetPayload<{
    include: {
      user: {
        include: {
          account: true;
        };
      };
    };
  }>;

  type ParentDoc = Prisma.ParentGetPayload<{
    include: {
      user: true;
      children: true;
    };
  }>;

  type ParentAccount = Prisma.ParentGetPayload<{
    include: {
      user: {
        include: {
          account: true;
        };
      };
    };
  }>;

  type ClassDoc = Prisma.ClassGetPayload<{
    include: { academicYear: true };
  }>;

  type SubjectDoc = Prisma.SubjectGetPayload<{
    include: { academicYear: true };
  }>;

  type AttendanceDoc = Prisma.AttendanceGetPayload<{
    include: {
      student: { include: { user: true } };
      classSubject: { include: { class: true; subject: true } };
      teacher: { include: { teacher: { include: { user: true } } } };
      academicYear: true;
    };
  }>;

  interface GetAttendanceNumbersParams {
    date: Date;
  }
}
