/*
  Warnings:

  - You are about to drop the column `classTeacherId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `subjectTeacherId` on the `exams` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exams" DROP CONSTRAINT "exams_subjectTeacherId_fkey";

-- AlterTable
ALTER TABLE "public"."exams" DROP COLUMN "classTeacherId",
DROP COLUMN "subjectTeacherId",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."exams" ADD CONSTRAINT "exams_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
