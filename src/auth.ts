import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

// Mock users for frontend-only authentication
const MOCK_USERS = [
  {
    id: "1",
    email: "student@test.com",
    password: "password",
    name: "John Student",
    role: "STUDENT" as const,
  },
  {
    id: "2",
    email: "admin@test.com",
    password: "password",
    name: "Admin User",
    role: "ADMIN" as const,
  },
  {
    id: "3",
    email: "teacher@test.com",
    password: "password",
    name: "Dr. Chemistry",
    role: "TEACHER" as const,
  },
  {
    id: "4",
    email: "parent@test.com",
    password: "password",
    name: "Parent Guardian",
    role: "PARENT" as const,
  },
];

function getUser(email: string) {
  return MOCK_USERS.find((user) => user.email === email);
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = getUser(email);

          // Simple password comparison (mock auth)
          if (user && user.password === password) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
});
