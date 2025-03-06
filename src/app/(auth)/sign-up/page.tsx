'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    signUpSchema,
    SignUpFormData,
    RegisterData,
    registerSchema,
} from '@/schemas/auth-schema';
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
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import ActivationSignUpDialog from '@/components/ActivationDialog/ActivationSignUpDialog';
import axios from 'axios';

type RegisterResponse = {
    activationToken: string;
};

type ActivateResponse = {
    access_token: string;
    refresh_token: string;
    user: any;
};

const SIGNUP_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
const ACTIVATE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/activate`;

const SignUpPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activationToken, setActivationToken] = useState<string | null>(null);
    const [showActivationDialog, setShowActivationDialog] = useState(false);
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: 'default' },
    });

    const onSubmit = async (data: SignUpFormData) => {
        setLoading(true);
        try {
            const registerData: RegisterData = registerSchema.parse(data);
            const response = await axios.post<RegisterResponse>(
                SIGNUP_URL,
                registerData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data.activationToken) {
                setActivationToken(response.data.activationToken);
                setShowActivationDialog(true);
                toast.success('Activation code sent to your email.');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error: any) {
            toast.error('Registration failed', {
                description: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOtp = async () => {
        if (!activationToken) {
            toast.error('Activation token is missing.');
            return;
        }
        const activationCode = otp.join('');
        if (activationCode.length !== 4) {
            toast.error('Please enter a valid 4-digit code.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post<ActivateResponse>(
                ACTIVATE_URL,
                {
                    activationToken,
                    activationCode,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response);
            console.log(
                response.data.access_token && response.data.refresh_token
            );
            if (response.data.access_token && response.data.refresh_token) {
                Cookies.set('access_token', response.data.access_token, {
                    secure: true,
                    sameSite: 'Strict',
                });
                Cookies.set('refresh_token', response.data.refresh_token, {
                    secure: true,
                    sameSite: 'Strict',
                });
                toast.success('Account activated successfully!');
                setShowActivationDialog(false);
                router.push('/dashboard');
            } else {
                toast.error('Activation failed. Invalid response from server.');
            }
        } catch (error: any) {
            toast.error('Activation failed', {
                description: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
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
                            <input type="hidden" {...register('username')} />
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    className="bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-xs">
                                        {errors.username.message}
                                    </p>
                                )}
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
                                {errors.email && (
                                    <p className="text-red-500 text-xs">
                                        {errors.email.message}
                                    </p>
                                )}
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
                                {errors.password && (
                                    <p className="text-red-500 text-xs">
                                        {errors.password.message}
                                    </p>
                                )}
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
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-medium h-11 transition-all hover:shadow-[0_0_15px_rgba(var(--primary)/25)]"
                                disabled={loading}
                            >
                                {loading ? (
                                    'Signing up...'
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create Account
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
            {showActivationDialog && (
                <ActivationSignUpDialog
                    otp={otp}
                    setOtp={setOtp}
                    handleSubmitOtp={handleSubmitOtp}
                    setShowActivationSignUpDialog={setShowActivationDialog}
                />
            )}
        </div>
    );
};

export default SignUpPage;
