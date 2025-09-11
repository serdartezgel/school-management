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
const streets = ["Maple St", "Oak Ave", "Pine Rd", "Cedar Ln", "Birch Dr"];
const genders: Gender[] = [Gender.MALE, Gender.FEMALE];

function getRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding database...");

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      gender: Gender.MALE,
      role: Role.ADMIN,
      account: {
        create: {
          username: "admin",
          password:
            "$2a$12$TrRdGc0N/u6Y7R.McXwhMOpJNemii1U5GY2vAEGKYiDzIq.YEngVa", // In prod, hash the password
        },
      },
    },
  });

  await prisma.admin.create({
    data: {
      userId: admin.id,
    },
  });

  for (let i = 1; i <= 20; i++) {
    const firstName = getRandom(firstNames);
    const lastName = getRandom(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
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

    // Create user
    const user = await prisma.user.create({
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

    // Create related teacher profile
    await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId,
        department: getRandom(departments),
        experience: getRandomNumber(1, 20),
        hireDate,
      },
    });
  }

  // Create an academic year
  const academicYear = await prisma.academicYear.create({
    data: {
      year: "2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // Create a class
  const class1 = await prisma.class.create({
    data: {
      name: "Class A",
      grade: "5",
      section: "A",
      academicYearId: academicYear.id,
      capacity: 24,
    },
  });

  // Create 2 parents
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

  // Create 20 students
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
        parentId: parents[i % 2].id, // assign parent alternately
        admissionDate: new Date("2025-09-01"),
        bloodGroup: i % 4 === 0 ? "A+" : "B+",
        emergencyContact: "1234567890",
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
