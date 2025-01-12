import { z } from 'zod';

const UserSchema = z.object({
  studentId: z
    .string()
    .regex(/^202\d{6}$/, 'Invalid student ID. Example: 202100001'),
  username: z
    .string()
    .min(3, 'First name must be at least 3 characters long')
    .max(20, 'First name must be at most 20 characters long'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
});

export const LoginSchema = z.object({
  email: UserSchema.shape.email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Invalid password format',
    ),
});

export const RegisterSchema = z
  .object({
    studentId: UserSchema.shape.studentId,
    username: z
      .string()
      .min(3, 'First name must be at least 3 characters long')
      .max(20, 'First name must be at most 20 characters long'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const ProfileSchema = UserSchema.pick({
  username: true,
  studentId: true,
  email: true,
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});

export const OTPSchema = z.object({
  otp: z
    .string()
    .min(6, { message: 'OTP must be 6 digits' })
    .max(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d+$/, { message: 'OTP must contain only numbers' }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
