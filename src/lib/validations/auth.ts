import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('invalidEmail').nonempty('required'),
  password: z.string().nonempty('required').min(6, { message: 'minLength' }),
});

export const registerSchema = z.object({
  fullName: z.string().nonempty('required').min(3, { message: 'minLength' }),
  email: z.string().email('invalidEmail').nonempty('required'),
  password: z.string().nonempty('required').min(6, { message: 'minLength' }),
  avatar: z.any().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
