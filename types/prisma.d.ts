import { Teacher, User, Account } from "@/prisma/client";

declare global {
  type TeacherDoc = Teacher & { user: User };
  type TeacherAccount = Teacher & { user: User & { account: Account } };
}
