/**
 * Centralized type definitions for ChemManager (Frontend-Only Mock)
 */

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface StudentStats {
  id: string;
  userId: string;
  points: number;
  streak: number;
  rank: number | null;
}

export interface StudentProfile extends User {
  studentStats: StudentStats | null;
}

export interface Resource {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "INTERACTIVE" | "SIMULATION";
  url: string;
  access: "FREE" | "PREMIUM";
  tags: string[];
}

// Session types for NextAuth
export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
}

export interface CustomSession {
  user: SessionUser;
  expires: string;
}

// Chemistry Lab types
export interface Chemical {
  id: string;
  name: string;
  hexColor: string;
  state: "solid" | "liquid" | "gas";
  formula: string;
}

export interface ReactionResult {
  productName: string;
  resultHex: string;
  temperature: number;
  phValue: number;
  dangerLevel: "safe" | "warning" | "dangerous";
}
