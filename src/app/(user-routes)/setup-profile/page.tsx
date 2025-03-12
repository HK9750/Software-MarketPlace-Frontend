/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
    User,
    LinkIcon,
    Store,
    UserCheck,
    Loader2,
    Mail,
    CheckCircle2,
    Home,
    Phone,
} from 'lucide-react';
import { ProfileFormValues, profileFormSchema } from '@/schemas/profile-schema';
import { useRootContext } from '@/lib/contexts/RootContext';
import axios from 'axios';

const SETUP_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/setup`;

export default function ProfileSetupPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, access_token, refresh_token } = useRootContext();
    console.log('User:', user);

    // Default values for the form
    const defaultValues: Partial<ProfileFormValues> = {
        firstname: '',
        lastname: '',
        username: user?.username || '',
        email: user?.email || '',
        address: '',
        phone: '',
        profile: '',
        role: 'customer',
        websiteLink: '',
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    const role = form.watch('role');

    async function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true);

        try {
            const payload = {
                firstName: data.firstname,
                lastName: data.lastname,
                phone: data.phone,
                address: data.address,
                websiteLink: data.websiteLink,
                role: data.role.toUpperCase(),
            };

            console.log('Payload to be sent:', payload);
            console.log(data);
            const response = await axios.put(SETUP_PROFILE_URL, payload, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'X-Refresh-Token': refresh_token,
                },
            });

            console.log('Form response:', response.data);

            // Show success message
            toast.success('Profile setup complete!', {
                description: 'You can now start using your account',
                duration: 5000,
            });

            // Redirect to dashboard or home page if needed
            // router.push('/dashboard');
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description:
                    error.response?.data?.message ||
                    error.message ||
                    'Please try again later',
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (user) {
            form.reset({
                firstname: '',
                lastname: '',
                username: user.username || '',
                email: user.email || '',
                address: '',
                phone: '',
                profile: '',
                role: 'customer',
                websiteLink: '',
            });
        }
    }, [user, form]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
            <div className="w-full max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mr-3">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Complete Your Profile
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Tell us about yourself to get started
                    </p>
                </div>

                <Card className="border-border shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-card/95">
                    <CardHeader className="bg-muted/30 py-4 px-6 flex flex-row items-center justify-between border-b">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Profile Setup
                                </CardTitle>
                                <CardDescription>
                                    Fill in your details to complete your
                                    account
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`rounded-full p-1 bg-primary/20 text-primary`}
                                >
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">
                                    Personal Info
                                </span>
                            </div>
                            <div className="h-4 w-px bg-border"></div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`rounded-full p-1 bg-muted text-muted-foreground`}
                                >
                                    <Store className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">
                                    Account Type
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left column - Personal Details */}
                                    <div className="space-y-5">
                                        <div className="mb-2 pb-2 border-b">
                                            <h3 className="font-medium text-lg">
                                                Personal Details
                                            </h3>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="firstname"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        First Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                placeholder="John"
                                                                className="pl-10 h-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastname"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        Last Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                placeholder="Doe"
                                                                className="pl-10 h-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        Username
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                placeholder="johndoe"
                                                                className="pl-10 h-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Your public display name
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        Phone Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="tel"
                                                                placeholder="(123) 456-7890"
                                                                className="pl-10 h-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Middle column - Contact & Bio */}
                                    <div className="space-y-5">
                                        <div className="mb-2 pb-2 border-b">
                                            <h3 className="font-medium text-lg">
                                                Contact & Bio
                                            </h3>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="email"
                                                                placeholder="name@example.com"
                                                                className="pl-10 h-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Your email address
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                            <Textarea
                                                                placeholder="123 Main St, City, State, ZIP"
                                                                className="resize-none min-h-[70px] pl-10 pt-2"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Right column - Account Type */}
                                    <div className="space-y-5">
                                        <div className="mb-2 pb-2 border-b">
                                            <h3 className="font-medium text-lg">
                                                Account Type
                                            </h3>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>
                                                        Select Account Type
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-3">
                                                            <div
                                                                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                                                                    field.value ===
                                                                    'customer'
                                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                                        : 'border-border hover:border-primary/50'
                                                                }`}
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        'customer'
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`rounded-full p-2 ${
                                                                            field.value ===
                                                                            'customer'
                                                                                ? 'bg-primary/20 text-primary'
                                                                                : 'bg-muted text-muted-foreground'
                                                                        }`}
                                                                    >
                                                                        <User className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium flex items-center gap-2">
                                                                            Customer
                                                                            {field.value ===
                                                                                'customer' && (
                                                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                                            )}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground mt-1">
                                                                            Browse
                                                                            and
                                                                            purchase
                                                                            software
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                                                                    field.value ===
                                                                    'seller'
                                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                                        : 'border-border hover:border-primary/50'
                                                                }`}
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        'seller'
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`rounded-full p-2 ${
                                                                            field.value ===
                                                                            'seller'
                                                                                ? 'bg-primary/20 text-primary'
                                                                                : 'bg-muted text-muted-foreground'
                                                                        }`}
                                                                    >
                                                                        <Store className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium flex items-center gap-2">
                                                                            Seller
                                                                            {field.value ===
                                                                                'seller' && (
                                                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                                                            )}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground mt-1">
                                                                            List
                                                                            and
                                                                            sell
                                                                            your
                                                                            software
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Choose whether you want
                                                        to buy or sell software
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {role === 'seller' && (
                                            <FormField
                                                control={form.control}
                                                name="websiteLink"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>
                                                            Website Link
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input
                                                                    placeholder="https://yourwebsite.com"
                                                                    className="pl-10 h-10"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription className="text-xs">
                                                            Your company or
                                                            portfolio website
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <div className="pt-6 mt-auto">
                                            <Button
                                                type="submit"
                                                className="w-full h-10 transition-all"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Setting up...
                                                    </>
                                                ) : (
                                                    'Complete Setup'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
