'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '@/schemas/auth-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { KeyRound, UserPlus } from 'lucide-react';

const SignUpPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: 'default', // providing a default value to satisfy the schema
        },
    });

    const onSubmit = (data: SignUpFormData) => {
        // empty onSubmit function
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Join Us Today{' '}
                        <span className="inline-block animate-bounce">✨</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Create an account to get started
                    </p>
                </div>

                <Card className="border-border shadow-xl rounded-xl overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl text-primary text-center font-bold">
                            Sign Up
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {/* Hidden input for username to satisfy signUpSchema */}
                            <input type="hidden" {...register('username')} />

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                    {...register('email')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                    {...register('password')}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-medium h-11 transition-all hover:shadow-[0_0_15px_rgba(var(--primary)/25)]"
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create Account
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <Separator />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-card px-3 text-muted-foreground text-xs uppercase tracking-wider">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="w-full hover:bg-accent hover:text-accent-foreground transition-all h-11"
                            >
                                <KeyRound className="mr-2 h-5 w-5 text-[#EB5424]" />
                                Sign up with Auth0
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-border bg-muted/50 py-6">
                        <p className="text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                className="text-primary font-semibold hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignUpPage;
