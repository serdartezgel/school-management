import { Teacher, User } from "@/prisma/client";

declare global {
  type TeacherDoc = Teacher & { user: User; account: Account };
}
