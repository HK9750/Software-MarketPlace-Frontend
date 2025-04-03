'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRootContext } from '@/lib/contexts/RootContext';

const planFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Plan name must be at least 2 characters' }),
    duration: z.coerce
        .number()
        .int()
        .positive({ message: 'Duration must be a positive integer' }),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface SubscriptionPlanFormProps {
    subscriptionId?: string;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`;

export function SubscriptionPlanForm({
    subscriptionId,
}: SubscriptionPlanFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [plan, setPlan] = useState<PlanFormValues | null>(null);
    const router = useRouter();
    const { access_token, refresh_token } = useRootContext();

    useEffect(() => {
        if (subscriptionId) {
            axios
                .get(`${BASE_URL}/plan/${subscriptionId}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                })
                .then(({ data }) => setPlan(data))
                .catch(() => toast.error('Failed to fetch subscription plan'));
        }
    }, [subscriptionId]);

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planFormSchema),
        defaultValues: {
            name: plan?.name || '',
            duration: plan?.duration || 1,
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (plan) {
            form.reset(plan);
        }
    }, [plan, form]);

    const onSubmit = async (data: PlanFormValues) => {
        setIsSubmitting(true);
        try {
            const url = subscriptionId
                ? `${BASE_URL}/plan/${subscriptionId}`
                : `${BASE_URL}/plan/create`;
            const method = subscriptionId ? 'patch' : 'post';

            await axios({
                method,
                url,
                data,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });

            toast.success(
                subscriptionId
                    ? 'Subscription plan updated successfully'
                    : 'Subscription plan created successfully'
            );
            router.push('/dashboard/subscriptions');
            router.refresh();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    'Failed to save subscription plan'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter plan name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A descriptive name for the subscription
                                        plan
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (months)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Duration of the subscription in months
                                        (e.g., 1, 3, 6, 12)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {subscriptionId
                                        ? 'Updating...'
                                        : 'Creating...'}
                                </>
                            ) : subscriptionId ? (
                                'Update Plan'
                            ) : (
                                'Create Plan'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
