import { Prisma } from "@prisma/client";

declare global {
  type FormDataMap = {
    teacher: TeacherDoc;
    student: StudentDoc;
    parent: ParentDoc;
    subject: SubjectDoc;
    class: ClassDoc;
    exam: ExamDoc;
    assignment: AssignmentDoc;
    result: ResultDoc;
    attendance: AttendanceDoc;
    event: EventDoc;
    announcement: AnnouncementDoc;
  };

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
}
