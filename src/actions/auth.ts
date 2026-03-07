"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials. Try: student@test.com / password";
        default:
          return "Something went wrong.";
      }
    }
    throw error; // Re-throw redirect
  }
}

export async function register(
  _prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || password.length < 6) {
    return "Invalid input";
  }

  // For demo purposes, we'll just attempt login with provided credentials
  // In the mock auth system, only predefined users can log in
  try {
    await signIn("credentials", { email, password });
    return "Success";
  } catch (error) {
    if (error instanceof AuthError) {
      return "This account does not exist. Please use a test account: student@test.com, admin@test.com, teacher@test.com, or parent@test.com (password: password)";
    }
    throw error;
  }
}
