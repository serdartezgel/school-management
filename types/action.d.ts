import { Prisma } from "@prisma/client";

import { Role } from "@/prisma/client";

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

  interface StudentCounts {
    total: number;
    male: number;
    female: number;
  }

  interface WeeklyAttendanceDay {
    day: string;
    present: number;
    absent: number;
  }

  type UserDoc = Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      role: true;
      teacherProfile: true;
      studentProfile: {
        select: { classId: true; parentId: true };
      };
      parentProfile: {
        select: {
          children: { select: { id: true } };
        };
      };
    };
  }>;

  type TeacherDoc = Prisma.TeacherGetPayload<{
    include: {
      user: true;
    };
  }>;
  type TeacherAccount = Prisma.TeacherGetPayload<{
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

  type ClassSubjectDoc = Prisma.ClassSubjectGetPayload<{
    include: {
      class: { include: { students: { include: { user: true } } } };
      subject: true;
      teacher: { include: { user: true } };
    };
  }>;

  type SubjectDoc = Prisma.SubjectGetPayload<{
    include: { academicYear: true };
  }>;

  type AttendanceDoc = Prisma.AttendanceGetPayload<{
    include: {
      student: { include: { user: true } };
      classSubject: { include: { class: true; subject: true } };
      academicYear: true;
    };
  }>;

  type StudentWithAttendanceDoc = Prisma.StudentGetPayload<{
    include: {
      user: true;
    };
  }> & {
    attendance: Prisma.AttendanceGetPayload<{
      include: {
        classSubject: { include: { class: true; subject: true } };
        academicYear: true;
      };
    }>;
  };

  interface GetAttendanceNumbersParams {
    date: Date;
    userId?: string;
    role?: Role;
  }

  type ExamDoc = Prisma.ExamGetPayload<{
    include: {
      examStudents: true;
    };
  }>;

  type ExamStudentDoc = Prisma.ExamStudentGetPayload<{
    include: {
      exam: true;
      student: { include: { user: true } };
    };
  }>;

  type AssignmentDoc = Prisma.AssignmentGetPayload<{
    include: {
      assignmentStudents: true;
    };
  }>;

  type AssignmentStudentDoc = Prisma.AssignmentStudentGetPayload<{
    include: {
      assignment: true;
      student: { include: { user: true } };
    };
  }>;

  type GradeDoc = Prisma.GradeGetPayload<{
    include: {
      student: {
        include: { user: { select: { id: true; name: true; image: true } } };
      };
      classSubject: {
        include: {
          class: { select: { id: true; name: true } };
          subject: { select: { id: true; name: true } };
        };
      };
      teacher: { include: { user: { select: { id: true; name: true } } } };
      examStudent: { include: { exam: true } };
      assignmentStudent: { include: { assignment: true } };
      academicYear: { select: { year: true } };
    };
  }>;

  type EventDoc = Prisma.EventGetPayload<{
    include: {
      roles: true;
      classes: true;
    };
  }>;

  type EventRoleDoc = Prisma.EventRoleGetPayload;

  type AnnouncementDoc = Prisma.AnnouncementGetPayload<{
    include: {
      roles: true;
      classes: true;
    };
  }>;

  type AnnouncementRoleDoc = Prisma.AnnouncementRoleGetPayload;

  type ConversationDoc = Prisma.ConversationGetPayload<{
    include: { messages: true };
  }>;

  type MessageDoc = Prisma.MessageGetPayload<{
    include: {
      sender: {
        select: { id: true; name: true; image: true; role: true };
      };
    };
  }>;
}
