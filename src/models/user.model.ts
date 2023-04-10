import { ZodSchema, z } from 'zod';

// Define schema for User model
export const UserSchema: ZodSchema<User> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
});

// Define interface for User model
export interface User {
  id?: string;
  name: string;
  email: string;
}
