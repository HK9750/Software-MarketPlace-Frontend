'use client';

import React, { useState } from 'react';
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
import { KeyRound, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/types';

const SIGNIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

type SignInResponse = {
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
};

const SignInPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);
        try {
            const response = await axios.post<SignInResponse>(
                SIGNIN_URL,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.accessToken && response.data.refreshToken) {
                Cookies.set('access_token', response.data.accessToken, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });
                Cookies.set('refresh_token', response.data.refreshToken, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });

                toast.success('Signed in successfully!');
                router.push('/profile');
            } else {
                toast.error('Invalid response from server.');
            }
        } catch (error: any) {
            if (error.response) {
                toast.error('Sign-in failed', {
                    description:
                        error.response.data.message || 'Please try again.',
                });
                if (error.response.status === 401) {
                    setError('email', {
                        type: 'manual',
                        message: 'Invalid email or password',
                    });
                    setError('password', {
                        type: 'manual',
                        message: 'Invalid email or password',
                    });
                }
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">
                                        {errors.email.message}
                                    </p>
                                )}
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
                                {errors.password && (
                                    <p className="text-red-500 text-xs">
                                        {errors.password.message}
                                    </p>
                                )}
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
                                disabled={loading}
                            >
                                {loading ? (
                                    'Signing in...'
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </>
                                )}
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
                                onClick={() => router.push('/Auth0')}
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
