import { z } from 'zod';

export const profileFormSchema = z
    .object({
        firstname: z
            .string()
            .min(1, { message: 'First name is required' })
            .max(50, {
                message: 'First name must not be longer than 50 characters',
            }),
        lastname: z
            .string()
            .min(1, { message: 'Last name is required' })
            .max(50, {
                message: 'Last name must not be longer than 50 characters',
            }),
        address: z
            .string()
            .min(5, { message: 'Please enter a valid address' })
            .max(200, {
                message: 'Address must not be longer than 200 characters',
            }),
        phone: z
            .string()
            .min(10, { message: 'Please enter a valid phone number' })
            .max(20, {
                message: 'Phone number must not be longer than 20 characters',
            })
            .regex(/^[0-9()\-\s+.]+$/, {
                message: 'Please enter a valid phone number format',
            }),

        // Avatar field that accepts File object or null/undefined
        avatar: z.instanceof(File).nullable().optional(),

        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters' })
            .max(30, {
                message: 'Username must not be longer than 30 characters',
            })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message:
                    'Username can only contain letters, numbers, underscores, and hyphens',
            }),
        email: z
            .string()
            .email({ message: 'Please enter a valid email address' }),
        profile: z
            .string()
            .max(500, { message: 'Bio must not be longer than 500 characters' })
            .optional(),
        role: z.enum(['customer', 'seller'], {
            required_error: 'Please select a role',
        }),
        websiteLink: z.union([
            z.string().url({ message: 'Please enter a valid URL' }),
            z.literal(''),
            z.undefined(),
        ]),
    })
    .superRefine((data, ctx) => {
        if (
            data.role.toLocaleLowerCase() === 'seller' &&
            (!data.websiteLink || data.websiteLink.trim() === '')
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Website link is required for sellers',
                path: ['websiteLink'],
            });
        }
    });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
