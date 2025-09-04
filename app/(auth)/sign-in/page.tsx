"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";

const SignInPage = () => {
  return (
    <AuthForm
      schema={SignInSchema}
      defaultValues={{ username: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignInPage;
