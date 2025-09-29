/*
  Warnings:

  - You are about to drop the column `classTeacherId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `subjectTeacherId` on the `assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gradeId]` on the table `AssignmentStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_subjectTeacherId_fkey";

-- AlterTable
ALTER TABLE "public"."AssignmentStudent" ADD COLUMN     "gradeId" TEXT;

-- AlterTable
ALTER TABLE "public"."assignments" DROP COLUMN "classTeacherId",
DROP COLUMN "subjectTeacherId",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."grades" ADD COLUMN     "assignmentStudentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentStudent_gradeId_key" ON "public"."AssignmentStudent"("gradeId");

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentStudent" ADD CONSTRAINT "AssignmentStudent_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
