"use server";

import { AcademicYear } from "@/prisma/client";

import handleError from "../handlers/error";
import dbConnect from "../prisma";

export async function getCurrentAcademicYear(): Promise<
  ActionResponse<AcademicYear | null>
> {
  const prisma = await dbConnect();

  try {
    const academicYear = await prisma.academicYear.findFirst({
      where: { isActive: true },
      orderBy: { startDate: "desc" }, // fallback if multiple marked active
    });

    return { success: true, data: academicYear };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
