"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

interface AuthorizedProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component wrapper that enforces role-based access control
 * Hides content from unauthorized users
 */
export function RoleGate({
  children,
  allowedRoles,
  fallback,
}: AuthorizedProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4">Loading...</div>
    );
  }

  if (!session?.user) {
    return (fallback as ReactNode) || null;
  }

  const userRole = (session.user.role || "STUDENT") as UserRole;

  if (!allowedRoles.includes(userRole)) {
    return (fallback as ReactNode) || null;
  }

  return children;
}

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Component that requires authentication
 * Redirects to login if not authenticated
 */
export function RequireAuth({
  children,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!session?.user) {
    router.push(redirectTo);
    return null;
  }

  return <>{children}</>;
}

interface AdminOnlyProps {
  children: ReactNode;
}

/**
 * Component that only renders for admin users
 */
export function AdminOnly({ children }: AdminOnlyProps) {
  return (
    <RoleGate
      allowedRoles={["ADMIN"]}
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Admin access only.</p>
        </div>
      }>
      {children}
    </RoleGate>
  );
}

interface TeacherOnlyProps {
  children: ReactNode;
}

/**
 * Component that only renders for teacher users
 */
export function TeacherOnly({ children }: TeacherOnlyProps) {
  return (
    <RoleGate
      allowedRoles={["TEACHER", "ADMIN"]}
      fallback={
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Teacher access only.</p>
        </div>
      }>
      {children}
    </RoleGate>
  );
}

interface StudentOnlyProps {
  children: ReactNode;
}

/**
 * Component that only renders for student users
 */
export function StudentOnly({ children }: StudentOnlyProps) {
  return (
    <RoleGate
      allowedRoles={["STUDENT"]}
      fallback={
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">Student access only.</p>
        </div>
      }>
      {children}
    </RoleGate>
  );
}
