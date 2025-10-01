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
      subjects.map((sub, idx) =>
        prisma.classSubject.create({
          data: {
            classId: cls.id,
            subjectId: sub.id,
            teacherId: teachers[idx % teachers.length].id,
          },
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
          teacherId: teachers[idx % teachers.length].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- AssignmentStudents + Grades ----------
  await Promise.all(
    students.flatMap((stu) =>
      assignments.map(async (ass, idx) => {
        // create grade first
        const grade = await prisma.grade.create({
          data: {
            studentId: stu.id,
            classSubjectId: ass.classSubjectId,
            teacherId: ass.teacherId,
            type: GradeType.ASSIGNMENT,
            title: `Assignment ${idx + 1} Grade`,
            score: faker.number.int({ min: 50, max: 100 }),
            maxScore: 100,
            grade: "A",
            academicYearId: academicYear.id,
          },
        });

        return prisma.assignmentStudent.create({
          data: {
            assignmentId: ass.id,
            studentId: stu.id,
            gradeId: grade.id,
            status: SubmissionStatus.PENDING,
          },
        });
      }),
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
          teacherId: teachers[idx % teachers.length].id,
          examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          academicYearId: academicYear.id,
        },
      }),
    ),
  );

  // ---------- ExamStudents + Grades ----------
  await Promise.all(
    students.flatMap((stu) =>
      exams.map(async (exam, idx) => {
        const grade = await prisma.grade.create({
          data: {
            studentId: stu.id,
            classSubjectId: exam.classSubjectId,
            teacherId: exam.teacherId,
            type: GradeType.MIDTERM,
            title: `Exam ${idx + 1} Grade`,
            score: faker.number.int({ min: 50, max: 100 }),
            maxScore: 100,
            grade: "A",
            academicYearId: academicYear.id,
          },
        });

        return prisma.examStudent.create({
          data: {
            examId: exam.id,
            studentId: stu.id,
            gradeId: grade.id,
            status: ExamStatus.PENDING,
          },
        });
      }),
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

  // ---------- Conversations ----------
  await prisma.conversation.create({
    data: {
      user1Id: teachers[0].userId, // Teacher 1
      user2Id: students[0].userId, // Student 1
      messages: {
        create: [
          {
            senderId: teachers[0].userId,
            content: "Hello, welcome to the new school year!",
          },
          {
            senderId: students[0].userId,
            content: "Thank you, teacher!",
          },
        ],
      },
    },
  });

  await prisma.conversation.create({
    data: {
      user1Id: adminUser.id, // Admin
      user2Id: parents[0].userId, // Parent 1
      messages: {
        create: [
          {
            senderId: adminUser.id,
            content: "We have scheduled a parent-teacher meeting next week.",
          },
          {
            senderId: parents[0].userId,
            content: "Thanks, I’ll be there.",
          },
        ],
      },
    },
  });

  // Example: Teacher sending to multiple users (if you extend schema to support multiple receivers)
  await prisma.conversation.create({
    data: {
      user1Id: teachers[1].userId, // Teacher 2
      user2Id: students[1].userId, // Student 2
      messages: {
        create: [
          {
            senderId: teachers[1].userId,
            content: "Reminder: Homework is due tomorrow!",
          },
        ],
      },
    },
  });

  // ---------- Events ----------
  const roles: Role[] = ["ADMIN", "TEACHER", "STUDENT", "PARENT"];
  const events = await Promise.all(
    Array.from({ length: 10 }).map(async (_, idx) => {
      return prisma.event.create({
        data: {
          title: `Event ${idx + 1}`,
          description: faker.lorem.sentence(),
          location: "Gym",
          startDate: faker.date.soon({ days: 30 }),
          endDate: faker.date.soon({ days: 31 }),
          isImportant: faker.datatype.boolean(),
        },
      });
    }),
  );

  // ---------- EventRoles ----------
  await Promise.all(
    events.map(async (event) => {
      // Assign 1-2 roles randomly
      const eventRoles = faker.helpers.arrayElements(
        roles,
        faker.number.int({ min: 1, max: 2 }),
      );
      return Promise.all(
        eventRoles.map((role) =>
          prisma.eventRole.create({
            data: {
              eventId: event.id,
              role,
            },
          }),
        ),
      );
    }),
  );

  // ---------- EventClasses ----------
  await Promise.all(
    events.map(async (event) => {
      const assignToClasses = faker.datatype.boolean(); // 50% chance event is class-specific
      if (!assignToClasses) return;

      // Pick 1-3 random classes
      const selectedClasses = faker.helpers.arrayElements(
        classes,
        faker.number.int({ min: 1, max: 3 }),
      );
      return Promise.all(
        selectedClasses.map((cls) =>
          prisma.eventClass.create({
            data: {
              eventId: event.id,
              classId: cls.id,
            },
          }),
        ),
      );
    }),
  );

  // ---------- Announcements ----------
  const announcements = await Promise.all(
    Array.from({ length: 10 }).map(async (_, idx) => {
      const type = faker.helpers.arrayElement([
        "expired",
        "active",
        "scheduled",
      ]);

      let publishDate: Date;
      let expiryDate: Date | null;

      if (type === "expired") {
        publishDate = faker.date.recent({ days: 60 }); // published in the past
        expiryDate = faker.date.recent({ days: 15 }); // already expired
      } else if (type === "active") {
        publishDate = faker.date.recent({ days: 30 }); // published recently
        expiryDate = faker.date.soon({ days: 15 }); // still valid
      } else {
        publishDate = faker.date.soon({ days: 15 }); // scheduled for the future
        expiryDate = faker.date.soon({ days: 30 }); // expires after publish
      }

      return prisma.announcement.create({
        data: {
          title: `Announcement ${idx + 1}`,
          content: faker.lorem.sentences(2),
          publishDate,
          expiryDate,
          isImportant: faker.datatype.boolean(),
        },
      });
    }),
  );

  // ---------- AnnouncementRoles ----------
  await Promise.all(
    announcements.map(async (announcement) => {
      // Assign 1-2 roles randomly
      const announcementRoles = faker.helpers.arrayElements(
        roles,
        faker.number.int({ min: 1, max: 2 }),
      );
      return Promise.all(
        announcementRoles.map((role) =>
          prisma.announcementRole.create({
            data: {
              announcementId: announcement.id,
              role,
            },
          }),
        ),
      );
    }),
  );

  // ---------- AnnouncementClasses ----------
  await Promise.all(
    announcements.map(async (announcement) => {
      const assignToClasses = faker.datatype.boolean();
      if (!assignToClasses) return;

      // Pick 1-3 random classes
      const selectedClasses = faker.helpers.arrayElements(
        classes,
        faker.number.int({ min: 1, max: 3 }),
      );
      return Promise.all(
        selectedClasses.map((cls) =>
          prisma.announcementClass.create({
            data: {
              announcementId: announcement.id,
              classId: cls.id,
            },
          }),
        ),
      );
    }),
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
