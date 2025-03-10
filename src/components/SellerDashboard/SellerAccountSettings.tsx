'use client';

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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const passwordFormSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

const paymentFormSchema = z.object({
    paymentMethod: z.enum(['bank', 'paypal', 'stripe'], {
        required_error: 'Please select a payment method',
    }),
    accountName: z.string().min(2, { message: 'Account name is required' }),
    accountNumber: z.string().min(5, { message: 'Account number is required' }),
    routingNumber: z.string().optional(),
    paypalEmail: z
        .string()
        .email({ message: 'Please enter a valid email' })
        .optional(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function SellerAccountSettings() {
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const paymentForm = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            paymentMethod: 'bank',
            accountName: 'Design Studio Inc.',
            accountNumber: 'XXXX-XXXX-XXXX-1234',
            routingNumber: '123456789',
            paypalEmail: '',
        },
        mode: 'onChange',
    });

    const onSubmitPassword = async (data: PasswordFormValues) => {
        setIsSubmittingPassword(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Password data:', data);

            toast.success('Password updated successfully', {
                description: 'Your password has been changed',
            });

            passwordForm.reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const onSubmitPayment = async (data: PaymentFormValues) => {
        setIsSubmittingPayment(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Payment data:', data);

            toast.success('Payment information updated', {
                description: 'Your payment details have been saved',
            });
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    const paymentMethod = paymentForm.watch('paymentMethod');

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                    <form
                        onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    >
                        <CardContent className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter current password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Password must be at least 8
                                            characters long
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Confirm New Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirm new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={isSubmittingPassword}
                            >
                                {isSubmittingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                        Manage your payout method and account details
                    </CardDescription>
                </CardHeader>
                <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={paymentForm.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="bank">
                                                    Bank Account
                                                </SelectItem>
                                                <SelectItem value="paypal">
                                                    PayPal
                                                </SelectItem>
                                                <SelectItem value="stripe">
                                                    Stripe
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select how you want to receive
                                            payments
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {paymentMethod === 'bank' && (
                                <>
                                    <FormField
                                        control={paymentForm.control}
                                        name="accountName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Account Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter account name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={paymentForm.control}
                                        name="accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Account Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter account number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={paymentForm.control}
                                        name="routingNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Routing Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter routing number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {paymentMethod === 'paypal' && (
                                <FormField
                                    control={paymentForm.control}
                                    name="paypalEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PayPal Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter PayPal email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {paymentMethod === 'stripe' && (
                                <div className="rounded-md bg-muted p-4">
                                    <p className="text-sm">
                                        To connect your Stripe account, we'll
                                        redirect you to Stripe's website to
                                        complete the setup process.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={isSubmittingPayment}
                            >
                                {isSubmittingPayment ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Payment Information'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible account actions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md border border-destructive/20 p-4">
                        <h3 className="text-lg font-medium text-destructive">
                            Delete Account
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Permanently delete your seller account and all
                            associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" className="mt-4">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
