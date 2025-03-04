import { z } from 'zod';

const baseSignUpSchema = z
    .object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z
            .string()
            .min(6, 'Confirm Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const signUpSchema = baseSignUpSchema;

export const registerSchema = baseSignUpSchema.transform(
    ({ confirmPassword, ...rest }) => rest
);

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
