'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormData } from '@/schemas/auth-schema';
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
import { KeyRound, LogIn, User } from 'lucide-react';

const SignInPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInFormData) => {
        // empty onSubmit function
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Welcome Back{' '}
                        <span className="inline-block animate-wave">👋</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Sign in to access your dashboard
                    </p>
                </div>

                <Card className="border-border shadow-xl rounded-xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl text-primary text-center font-bold">
                            Sign In
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="johndoe"
                                        className="bg-muted/50 pl-10 focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs text-primary hover:text-primary/90 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                    {...register('password')}
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-medium h-11 transition-all hover:shadow-[0_0_15px_rgba(var(--primary)/25)]"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In
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
                                Sign in with Auth0
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-border bg-muted/50 py-6">
                        <p className="text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                href="/sign-up"
                                className="text-primary font-semibold hover:underline transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SignInPage;
