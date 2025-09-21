/*
  Warnings:

  - You are about to drop the column `classId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,classSubjectId,date]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,classSubjectId,academicYearId]` on the table `exams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,classSubjectId,title,academicYearId]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classSubjectId,dayOfWeek,startTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classSubjectId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."attendances" DROP CONSTRAINT "attendances_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grades" DROP CONSTRAINT "grades_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."schedules" DROP CONSTRAINT "schedules_subjectId_fkey";

-- DropIndex
DROP INDEX "public"."attendances_classId_date_idx";

-- DropIndex
DROP INDEX "public"."attendances_studentId_classId_date_key";

-- DropIndex
DROP INDEX "public"."exams_title_subjectId_classId_academicYearId_key";

-- DropIndex
DROP INDEX "public"."grades_studentId_subjectId_title_academicYearId_key";

-- DropIndex
DROP INDEX "public"."grades_subjectId_idx";

-- DropIndex
DROP INDEX "public"."schedules_classId_dayOfWeek_startTime_key";

-- DropIndex
DROP INDEX "public"."subject_teachers_subjectId_teacherId_key";

-- AlterTable
ALTER TABLE "public"."assignments" DROP COLUMN "classId",
DROP COLUMN "subjectId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."attendances" DROP COLUMN "classId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."exams" DROP COLUMN "classId",
DROP COLUMN "subjectId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."grades" DROP COLUMN "subjectId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."schedules" DROP COLUMN "classId",
DROP COLUMN "subjectId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "attendances_classSubjectId_date_idx" ON "public"."attendances"("classSubjectId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_studentId_classSubjectId_date_key" ON "public"."attendances"("studentId", "classSubjectId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "exams_title_classSubjectId_academicYearId_key" ON "public"."exams"("title", "classSubjectId", "academicYearId");

-- CreateIndex
CREATE INDEX "grades_classSubjectId_idx" ON "public"."grades"("classSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "grades_studentId_classSubjectId_title_academicYearId_key" ON "public"."grades"("studentId", "classSubjectId", "title", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_classSubjectId_dayOfWeek_startTime_key" ON "public"."schedules"("classSubjectId", "dayOfWeek", "startTime");

-- AddForeignKey
ALTER TABLE "public"."attendances" ADD CONSTRAINT "attendances_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "public"."class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."grades" ADD CONSTRAINT "grades_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "public"."class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "public"."class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "public"."class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "public"."class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
