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
          password: "admin123", // In prod, hash the password
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
