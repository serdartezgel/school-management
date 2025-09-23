/*
  Warnings:

  - You are about to drop the column `classTeacherId` on the `attendances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classId,subjectId,teacherId]` on the table `class_subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `class_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."AttendanceStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "public"."attendances" DROP CONSTRAINT "attendances_classTeacherId_fkey";

-- DropIndex
DROP INDEX "public"."class_subjects_classId_subjectId_key";

-- AlterTable
ALTER TABLE "public"."attendances" DROP COLUMN "classTeacherId";

-- AlterTable
ALTER TABLE "public"."class_subjects" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "class_subjects_classId_subjectId_teacherId_key" ON "public"."class_subjects"("classId", "subjectId", "teacherId");

-- AddForeignKey
ALTER TABLE "public"."class_subjects" ADD CONSTRAINT "class_subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
