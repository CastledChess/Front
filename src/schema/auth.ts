import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password === confirmPassword) return;

    ctx.addIssue({
      code: 'custom',
      message: 'The passwords did not match',
      path: ['confirmPassword'],
    });
  });

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
  }),
});
