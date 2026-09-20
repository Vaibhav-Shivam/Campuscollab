import { z } from 'zod';

/**
 * CampusCollab Strict API Request Schemas
 * Used across API endpoints to ensure input validation, data sanitization, and type safety.
 */

export const CreateProjectSchema = z.object({
  id: z.string().optional(),
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  tagline: z
    .string()
    .trim()
    .max(200, 'Tagline cannot exceed 200 characters')
    .optional(),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  type: z.enum(['Hackathon', 'Academic', 'Personal', 'Startup', 'Open Source'], {
    errorMap: () => ({ message: 'Invalid project type. Must be Hackathon, Academic, Personal, Startup, or Open Source.' })
  }).default('Hackathon'),
  requiredSkills: z
    .array(z.string().trim().min(1).max(50))
    .min(1, 'At least 1 required skill is necessary')
    .max(20, 'Maximum 20 required skills allowed'),
  currentMembers: z.number().int().min(1).default(1),
  maxMembers: z.number().int().min(2, 'Project must accommodate at least 2 members').max(20, 'Max members cannot exceed 20').default(4),
  isOpen: z.boolean().default(true),
  tags: z.array(z.string().trim().max(40)).max(10).default([]),
  rolesNeeded: z.array(z.string().trim().max(60)).max(10).optional(),
  ownerAvatar: z.string().url().or(z.string()).optional()
});

export const CreateCommentSchema = z.object({
  content: z
    .string({ required_error: 'Comment content is required' })
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(1500, 'Comment cannot exceed 1500 characters'),
  offeringSkills: z.array(z.string().trim().max(50)).max(10).optional()
});

export const CollaborationRequestSchema = z.object({
  projectId: z.string({ required_error: 'Project ID is required' }).trim().min(1, 'Project ID is required'),
  receiverId: z.string({ required_error: 'Receiver ID is required' }).trim().min(1, 'Receiver ID is required'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(3, 'Message must be at least 3 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
  projectTitle: z.string().trim().max(150).optional(),
  receiverName: z.string().trim().max(100).optional(),
  requestedRole: z.string().trim().max(80).optional(),
  contactEmail: z.string().email('Invalid contact email format').optional()
});

export const RespondRequestSchema = z.object({
  requestId: z.string({ required_error: 'Request ID is required' }).trim().min(1, 'Request ID is required'),
  status: z.enum(['accepted', 'declined'], {
    errorMap: () => ({ message: 'Status must be either "accepted" or "declined"' })
  })
});

export const UpdateProfileSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').optional(),
  bio: z.string().trim().max(600, 'Bio cannot exceed 600 characters').optional(),
  college: z.string().trim().max(150, 'College cannot exceed 150 characters').optional(),
  year: z.string().trim().max(50).optional(),
  major: z.string().trim().max(100).optional(),
  primaryRole: z.string().trim().max(80).optional(),
  status: z.enum(['available', 'looking']).optional(),
  lookingForRole: z.string().trim().max(80).optional(),
  skills: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        level: z.number().min(1).max(5).default(4),
        category: z.string().optional()
      })
    )
    .max(30)
    .optional(),
  interests: z.array(z.string().trim().max(50)).max(15).optional(),
  portfolioUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  figmaUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  avatar: z.string().trim().optional(),
  proofs: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        description: z.string().trim().max(500),
        role: z.string().trim().max(60),
        technologies: z.array(z.string().trim()),
        githubUrl: z.string().url().or(z.literal('')).optional(),
        liveDemoUrl: z.string().url().or(z.literal('')).optional(),
        figmaUrl: z.string().url().or(z.literal('')).optional(),
        image: z.string().optional()
      })
    )
    .max(10)
    .optional()
});

export const CreateEventSchema = z.object({
  title: z
    .string({ required_error: 'Event title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(3000, 'Description cannot exceed 3000 characters'),
  category: z.enum(['Hackathon', 'Workshop', 'Competition', 'Club Meetup', 'Showcase'], {
    errorMap: () => ({ message: 'Category must be Hackathon, Workshop, Competition, Club Meetup, or Showcase' })
  }).default('Workshop'),
  date: z.string().trim().min(2, 'Date is required').max(100),
  location: z.string().trim().min(2, 'Location is required').max(200),
  isOnline: z.boolean().default(false),
  organizer: z.string().trim().max(100).optional(),
  skillsFocus: z.array(z.string().trim().max(50)).max(15).default([]),
  image: z.string().url().or(z.string()).optional()
});

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
});

export const SignupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  college: z
    .string({ required_error: 'College is required' })
    .trim()
    .min(2, 'College is required')
    .max(150),
  major: z.string().trim().max(100).optional(),
  year: z.string().trim().max(50).optional(),
  primaryRole: z.string().trim().max(80).optional(),
  bio: z.string().trim().max(600).optional(),
  avatar: z.string().trim().optional(),
  skills: z.any().optional()
});

export const AdminLoginSchema = z.object({
  email: z
    .string({ required_error: 'Admin email is required' })
    .trim()
    .email('Valid administrator email address required'),
  passkey: z
    .string({ required_error: 'Admin passkey is required' })
    .min(6, 'Passkey must be at least 6 characters')
});

export const ResetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(6, 'New password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters')
});

export const ReportSchema = z.object({
  targetType: z.enum(['student', 'project', 'comment'], {
    errorMap: () => ({ message: 'Target type must be student, project, or comment' })
  }),
  targetId: z.string().trim().min(1, 'Target ID is required'),
  reason: z.string().trim().min(3, 'Reason must be at least 3 characters').max(300),
  details: z.string().trim().max(1000).optional()
});

/**
 * Validates request body using a Zod schema
 */
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string; issues: z.ZodIssue[] } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMsg = result.error.issues.map((i) => `${i.path.join('.') || 'field'}: ${i.message}`).join(', ');
    return {
      success: false,
      error: errorMsg,
      issues: result.error.issues
    };
  }
  return {
    success: true,
    data: result.data
  };
}
