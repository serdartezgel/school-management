/*
  Warnings:

  - You are about to drop the column `subjectTeacherId` on the `grades` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gradeId]` on the table `ExamStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `grades` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."grades" DROP CONSTRAINT "grades_subjectTeacherId_fkey";

-- AlterTable
ALTER TABLE "public"."ExamStudent" ADD COLUMN     "gradeId" TEXT;

-- AlterTable
ALTER TABLE "public"."grades" DROP COLUMN "subjectTeacherId",
ADD COLUMN     "examStudentId" TEXT,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExamStudent_gradeId_key" ON "public"."ExamStudent"("gradeId");

-- AddForeignKey
ALTER TABLE "public"."grades" ADD CONSTRAINT "grades_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamStudent" ADD CONSTRAINT "ExamStudent_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
