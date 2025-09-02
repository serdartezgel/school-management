import { PrismaClient, Role, Gender } from "../prisma/client";

const prisma = new PrismaClient();

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
