/**
 * Validation schemas for API requests using Zod
 */
import { z } from 'zod';

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = LoginSchema.extend({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'PARENT']).default('STUDENT'),
});

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

// Course schemas
export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  description: z.string().optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

// Assignment schemas
export const CreateAssignmentSchema = z.object({
  title: z.string().min(3, 'Assignment title must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  courseId: z.string().min(1, 'Invalid course ID'),
});

export const UpdateAssignmentSchema = CreateAssignmentSchema.partial();

// Submission schemas
export const CreateSubmissionSchema = z.object({
  assignmentId: z.string().min(1, 'Invalid assignment ID'),
  content: z.string().min(1, 'Submission content cannot be empty'),
});

export const GradeSubmissionSchema = z.object({
  score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
  feedback: z.string().optional(),
});

// Resource schemas
export const CreateResourceSchema = z.object({
  title: z.string().min(3, 'Resource title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'DOCUMENT', 'INTERACTIVE', 'SIMULATION']),
  url: z.string().url('Invalid URL'),
  access: z.enum(['FREE', 'PREMIUM']).default('FREE'),
  courseId: z.string().min(1).optional(),
  tags: z.array(z.string()).default([]),
});

export const UpdateResourceSchema = CreateResourceSchema.partial();

// Pagination schema
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>;
export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
