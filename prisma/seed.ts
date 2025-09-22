// prisma/seed.ts
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

import {
  PrismaClient,
  Role,
  Gender,
  AttendanceStatus,
  SubmissionStatus,
  ExamStatus,
  GradeType,
  DayOfWeek,
} from "../prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  const saltRounds = 12;

  // ---------- Academic Years ----------
  const academicYear = await prisma.academicYear.create({
    data: {
      year: "2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // ---------- Classes ----------
  const classes = await Promise.all(
    ["1A", "1B", "2A"].map((name) =>
      prisma.class.create({
        data: {
          name,
          grade: name[0],
          section: name[1],
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- Subjects ----------
  const subjects = await Promise.all(
    ["Math", "English", "Science"].map((name, idx) =>
      prisma.subject.create({
        data: {
          name,
          code: `SUB${idx + 1}`,
          credits: 3,
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- Admin User ----------
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      gender: Gender.MALE,
      role: Role.ADMIN,
      account: { create: { username: "admin", password: adminPassword } },
    },
  });
  await prisma.admin.create({ data: { userId: adminUser.id } });

  // ---------- Teachers ----------
  const teachers = await Promise.all(
    Array.from({ length: 3 }).map(async (_, i) => {
      const hashed = await bcrypt.hash(`teacher${i + 1}`, saltRounds);
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          role: Role.TEACHER,
          account: {
            create: { username: `teacher${i + 1}`, password: hashed },
          },
        },
      });
      return prisma.teacher.create({
        data: {
          userId: user.id,
          employeeId: `EMP${i + 1}`,
          department: "Science",
        },
      });
    }),
  );

  // ---------- Parents ----------
  const parents = await Promise.all(
    Array.from({ length: 2 }).map(async (_, i) => {
      const hashed = await bcrypt.hash(`parent${i + 1}`, saltRounds);
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          role: Role.PARENT,
          account: { create: { username: `parent${i + 1}`, password: hashed } },
        },
      });
      return prisma.parent.create({
        data: {
          userId: user.id,
          occupation: faker.person.jobTitle(),
          relationship: "Parent",
        },
      });
    }),
  );

  // ---------- Students ----------
  const students = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) => {
      const hashed = await bcrypt.hash(`student${i + 1}`, saltRounds);
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          role: Role.STUDENT,
          account: {
            create: { username: `student${i + 1}`, password: hashed },
          },
        },
      });
      const classObj = classes[i % classes.length];
      const parent = parents[i % parents.length];
      return prisma.student.create({
        data: {
          userId: user.id,
          studentId: `STU${i + 1}`,
          classId: classObj.id,
          parentId: parent.id,
          admissionDate: new Date("2025-09-01"),
          bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
          emergencyContact: faker.phone.number(),
        },
      });
    }),
  );

  // ---------- ClassSubjects ----------
  const classSubjects = await Promise.all(
    classes.flatMap((cls) =>
      subjects.map((sub) =>
        prisma.classSubject.create({
          data: { classId: cls.id, subjectId: sub.id },
        }),
      ),
    ),
  );

  // ---------- ClassTeachers ----------
  const classTeachers = await Promise.all(
    classes.map((cls, idx) =>
      prisma.classTeacher.create({
        data: {
          classId: cls.id,
          teacherId: teachers[idx % teachers.length].id,
          isClassTeacher: true,
        },
      }),
    ),
  );

  // ---------- SubjectTeachers ----------
  const subjectTeachers = await Promise.all(
    subjects.map((sub, idx) =>
      prisma.subjectTeacher.create({
        data: {
          subjectId: sub.id,
          teacherId: teachers[idx % teachers.length].id,
        },
      }),
    ),
  );

  // ---------- Attendances ----------
  await Promise.all(
    students.flatMap((stu) =>
      classSubjects.map((cs) =>
        prisma.attendance.create({
          data: {
            studentId: stu.id,
            classSubjectId: cs.id,
            classTeacherId: classTeachers[0].id,
            date: new Date(),
            status: AttendanceStatus.PRESENT,
            academicYearId: academicYear.id,
          },
        }),
      ),
    ),
  );

  // ---------- Assignments ----------
  const assignments = await Promise.all(
    classSubjects.map((cs, idx) =>
      prisma.assignment.create({
        data: {
          title: `Assignment ${idx + 1}`,
          description: faker.lorem.sentence(),
          classSubjectId: cs.id,
          classTeacherId: classTeachers[0].id,
          subjectTeacherId: subjectTeachers[0].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- AssignmentStudents ----------
  await Promise.all(
    students.flatMap((stu) =>
      assignments.map((ass) =>
        prisma.assignmentStudent.create({
          data: {
            assignmentId: ass.id,
            studentId: stu.id,
            status: SubmissionStatus.PENDING,
          },
        }),
      ),
    ),
  );

  // ---------- Exams ----------
  const exams = await Promise.all(
    classSubjects.map((cs, idx) =>
      prisma.exam.create({
        data: {
          title: `Exam ${idx + 1}`,
          description: faker.lorem.sentence(),
          classSubjectId: cs.id,
          classTeacherId: classTeachers[0].id,
          subjectTeacherId: subjectTeachers[0].id,
          examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- ExamStudents ----------
  await Promise.all(
    students.flatMap((stu) =>
      exams.map((exam) =>
        prisma.examStudent.create({
          data: {
            examId: exam.id,
            studentId: stu.id,
            status: ExamStatus.PENDING,
          },
        }),
      ),
    ),
  );

  // ---------- Grades ----------
  await Promise.all(
    students.flatMap((stu) =>
      classSubjects.map((cs, idx) =>
        prisma.grade.create({
          data: {
            studentId: stu.id,
            classSubjectId: cs.id,
            subjectTeacherId: subjectTeachers[0].id,
            type: GradeType.ASSIGNMENT,
            title: `Quiz ${idx + 1}`,
            score: faker.number.int({ min: 50, max: 100 }),
            maxScore: 100,
            grade: "A",
            examDate: new Date(),
            academicYearId: academicYear.id,
          },
        }),
      ),
    ),
  );

  // ---------- Schedules ----------
  const days = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ];
  const times = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  await Promise.all(
    classTeachers.flatMap((ct, ctIdx) =>
      subjects
        .map((sub, subIdx) => {
          const classSub = classSubjects.find(
            (cs) => cs.classId === ct.classId && cs.subjectId === sub.id,
          );
          if (!classSub) return null;

          const day = days[(ctIdx + subIdx) % days.length];
          const startTime = times[(ctIdx + subIdx) % times.length];
          const endTime = times[(ctIdx + subIdx + 1) % times.length];

          return prisma.schedule.create({
            data: {
              classSubjectId: classSub.id,
              classTeacherId: ct.id,
              subjectTeacherId:
                subjectTeachers[subIdx % subjectTeachers.length].id,
              dayOfWeek: day,
              startTime,
              endTime,
            },
          });
        })
        .filter(Boolean),
    ),
  );

  // ---------- Events ----------
  const events = await Promise.all(
    Array.from({ length: 2 }).map((_, idx) =>
      prisma.event.create({
        data: {
          title: `Event ${idx + 1}`,
          description: faker.lorem.sentence(),
          startDate: new Date(),
          endDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
          isImportant: idx % 2 === 0,
        },
      }),
    ),
  );

  // ---------- EventClasses ----------
  await Promise.all(
    events.flatMap((event) =>
      classes.map((cls) =>
        prisma.eventClass.create({
          data: {
            eventId: event.id,
            classId: cls.id,
          },
        }),
      ),
    ),
  );

  // ---------- Announcements ----------
  const announcements = await Promise.all(
    Array.from({ length: 2 }).map((_, idx) =>
      prisma.announcement.create({
        data: {
          title: `Announcement ${idx + 1}`,
          content: faker.lorem.sentence(),
          isImportant: idx % 2 === 0,
          publishDate: new Date(),
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ),
  );

  await Promise.all(
    announcements.flatMap((ann) =>
      classes.map((cls) =>
        prisma.announcementClass.create({
          data: {
            announcementId: ann.id,
            classId: cls.id,
          },
        }),
      ),
    ),
  );

  console.log("✅ Full seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
