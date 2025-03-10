'use client';

import type React from 'react';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    bio: z
        .string()
        .max(500, { message: 'Bio must not exceed 500 characters' })
        .optional(),
    website: z
        .string()
        .url({ message: 'Please enter a valid URL' })
        .optional()
        .or(z.literal('')),
    companyName: z
        .string()
        .min(2, { message: 'Company name must be at least 2 characters' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function SellerProfileSettings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const defaultValues: Partial<ProfileFormValues> = {
        username: 'designpro',
        email: 'info@designpro.com',
        bio: 'Professional software company specializing in design and development tools.',
        website: 'https://designpro.com',
        companyName: 'Design Studio Inc.',
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Form data:', data);

            toast.success('Profile updated successfully', {
                description: 'Your profile information has been updated',
            });
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your seller profile information
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={
                                        avatarPreview ||
                                        '/placeholder.svg?height=96&width=96'
                                    }
                                    alt="Profile"
                                />
                                <AvatarFallback>DS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <FormLabel>Profile Picture</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="cursor-pointer mt-2"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Upload a profile picture. Recommended size:
                                    300x300px.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter email"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your contact email address
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your business or company name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your company or personal website
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about your company"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Brief description about your company or
                                        yourself
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
