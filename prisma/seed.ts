import { PrismaClient, Role, Gender } from "../prisma/client";

const prisma = new PrismaClient();

const firstNames = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eva",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
];
const lastNames = [
  "Johnson",
  "Smith",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Moore",
  "Taylor",
];
const departments = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
];

const subjects = [
  {
    name: "Mathematics",
    code: "MATH101",
    credits: 4,
    description: "Basic and advanced mathematics concepts",
  },
  {
    name: "English Language",
    code: "ENG101",
    credits: 3,
    description: "Grammar, writing, and comprehension",
  },
  {
    name: "Physics",
    code: "PHY101",
    credits: 4,
    description: "Mechanics, thermodynamics, and waves",
  },
  {
    name: "Chemistry",
    code: "CHEM101",
    credits: 4,
    description: "Organic and inorganic chemistry",
  },
  {
    name: "Biology",
    code: "BIO101",
    credits: 4,
    description: "Cell biology, genetics, and ecology",
  },
  {
    name: "History",
    code: "HIS101",
    credits: 3,
    description: "World history and civilizations",
  },
  {
    name: "Geography",
    code: "GEO101",
    credits: 3,
    description: "Physical and human geography",
  },
  {
    name: "Computer Science",
    code: "CS101",
    credits: 4,
    description: "Programming and computer systems",
  },
  {
    name: "Art",
    code: "ART101",
    credits: 2,
    description: "Drawing, painting, and creative design",
  },
  {
    name: "Physical Education",
    code: "PE101",
    credits: 2,
    description: "Sports, fitness, and health",
  },
];

const streets = ["Maple St", "Oak Ave", "Pine Rd", "Cedar Ln", "Birch Dr"];
const genders: Gender[] = [Gender.MALE, Gender.FEMALE];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      gender: Gender.MALE,
      role: Role.ADMIN,
      account: {
        create: {
          username: "admin",
          password:
            "$2a$12$TrRdGc0N/u6Y7R.McXwhMOpJNemii1U5GY2vAEGKYiDzIq.YEngVa", // bcrypt("password")
        },
      },
    },
  });

  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  // 2. Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { year: "2025-2026" },
    update: {},
    create: {
      year: "2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // 3. One Class (compound unique: grade + section + academicYearId)
  const class1 = await prisma.class.upsert({
    where: {
      grade_section_academicYearId: {
        grade: "5",
        section: "A",
        academicYearId: academicYear.id,
      },
    },
    update: {},
    create: {
      name: "Class 5A",
      grade: "5",
      section: "A",
      academicYearId: academicYear.id,
      capacity: 24,
    },
  });

  // 4. Teachers
  for (let i = 1; i <= 20; i++) {
    const firstName = getRandom(firstNames);
    const lastName = getRandom(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@school.com`;
    const phone = `555-${1000 + i}`;
    const address = `${getRandomNumber(1, 99)} ${getRandom(streets)}`;
    const gender = getRandom(genders);
    const dob = new Date(
      1980 + getRandomNumber(0, 20),
      getRandomNumber(0, 11),
      getRandomNumber(1, 28),
    );
    const hireDate = new Date(
      2010 + getRandomNumber(0, 10),
      getRandomNumber(0, 11),
      getRandomNumber(1, 28),
    );
    const employeeId = `EMP${1000 + i}`;
    const image = `https://randomuser.me/api/portraits/${gender === Gender.MALE ? "men" : "women"}/${i}.jpg`;

    const teacherUser = await prisma.user.create({
      data: {
        email,
        name: fullName,
        role: Role.TEACHER,
        phone,
        address,
        image,
        gender,
        dateOfBirth: dob,
      },
    });

    await prisma.teacher.create({
      data: {
        userId: teacherUser.id,
        employeeId,
        department: getRandom(departments),
        experience: getRandomNumber(1, 20),
        hireDate,
      },
    });
  }

  // 5. Parents
  const parents = [];
  for (let i = 1; i <= 2; i++) {
    const parentUser = await prisma.user.create({
      data: {
        name: `Parent ${i}`,
        email: `parent${i}@school.com`,
        role: Role.PARENT,
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
      },
    });

    const parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
        occupation: i % 2 === 0 ? "Teacher" : "Engineer",
        relationship: i % 2 === 0 ? "Mother" : "Father",
      },
    });

    parents.push(parent);
  }

  // 6. Students
  for (let i = 1; i <= 20; i++) {
    const gender = i % 2 === 0 ? Gender.FEMALE : Gender.MALE;
    const studentUser = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        email: `student${i}@school.com`,
        role: Role.STUDENT,
        gender,
      },
    });

    await prisma.student.create({
      data: {
        userId: studentUser.id,
        studentId: (1000 + i).toString(),
        classId: class1.id,
        parentId: parents[i % 2].id,
        admissionDate: new Date("2025-09-01"),
        bloodGroup: i % 4 === 0 ? "A+" : "B+",
        emergencyContact: "1234567890",
      },
    });
  }

  // 7. Subjects
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: {
        ...subject,
        academicYearId: academicYear.id,
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
