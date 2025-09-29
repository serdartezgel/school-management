/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentStudentId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `examId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `examStudentId` on the `grades` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."grades" DROP CONSTRAINT "grades_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grades" DROP CONSTRAINT "grades_examId_fkey";

-- AlterTable
ALTER TABLE "public"."grades" DROP COLUMN "assignmentId",
DROP COLUMN "assignmentStudentId",
DROP COLUMN "examId",
DROP COLUMN "examStudentId";
