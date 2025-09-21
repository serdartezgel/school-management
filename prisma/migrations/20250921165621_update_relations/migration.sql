/*
  Warnings:

  - You are about to drop the column `teacherId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subjectTeacherId,dayOfWeek,startTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classTeacherId,dayOfWeek,startTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classTeacherId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectTeacherId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classTeacherId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classTeacherId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectTeacherId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectTeacherId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classTeacherId` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectTeacherId` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendances" DROP CONSTRAINT "attendances_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grades" DROP CONSTRAINT "grades_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."schedules_teacherId_dayOfWeek_startTime_key";

-- AlterTable
ALTER TABLE "public"."assignments" DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT NOT NULL,
ADD COLUMN     "subjectTeacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."attendances" DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."exams" DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT NOT NULL,
ADD COLUMN     "subjectTeacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."grades" DROP COLUMN "teacherId",
ADD COLUMN     "subjectTeacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."schedules" DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT NOT NULL,
ADD COLUMN     "subjectTeacherId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schedules_subjectTeacherId_dayOfWeek_startTime_key" ON "public"."schedules"("subjectTeacherId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_classTeacherId_dayOfWeek_startTime_key" ON "public"."schedules"("classTeacherId", "dayOfWeek", "startTime");

-- AddForeignKey
ALTER TABLE "public"."attendances" ADD CONSTRAINT "attendances_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "public"."class_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."grades" ADD CONSTRAINT "grades_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."subject_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."subject_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "public"."class_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."subject_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "public"."class_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."subject_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "public"."class_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
