import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
});