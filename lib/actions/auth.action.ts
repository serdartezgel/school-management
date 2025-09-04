"use server";

import bcrypt from "bcryptjs";

import { signIn } from "@/auth";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import dbConnect from "../prisma";
import { SignInSchema } from "../validations";

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "username" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { username, password } = validationResult.params!;
  const prisma = await dbConnect();

  try {
    const existingAccount = await prisma.account.findUnique({
      where: { username },
    });

    if (!existingAccount) throw new NotFoundError("Account");

    const existingUser = await prisma.user.findUnique({
      where: { id: existingAccount.userId },
    });

    if (!existingUser) throw new NotFoundError("User");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );

    if (!passwordMatch) throw new Error("Password does not match");

    await signIn("credentials", { username, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
