'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, X } from 'lucide-react';

// Subscription plan type
interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isPopular: boolean;
    isActive: boolean;
    subscriberCount: number;
}

// Form schema
const planFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Plan name must be at least 2 characters' }),
    description: z
        .string()
        .min(5, { message: 'Description must be at least 5 characters' }),
    price: z.coerce
        .number()
        .positive({ message: 'Price must be a positive number' }),
    billingCycle: z.enum(['monthly', 'yearly'], {
        required_error: 'Please select a billing cycle',
    }),
    isPopular: z.boolean().default(false),
    isActive: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface SubscriptionPlanDialogProps {
    isOpen: boolean;
    plan: SubscriptionPlan | null;
    onClose: () => void;
    onSave: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlanDialog({
    isOpen,
    plan,
    onClose,
    onSave,
}: SubscriptionPlanDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [features, setFeatures] = useState<string[]>(plan?.features || []);
    const [newFeature, setNewFeature] = useState('');

    // Default values
    const defaultValues: Partial<PlanFormValues> = {
        name: plan?.name || '',
        description: plan?.description || '',
        price: plan?.price || 0,
        billingCycle: plan?.billingCycle || 'monthly',
        isPopular: plan?.isPopular || false,
        isActive: plan?.isActive || true,
    };

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    // Reset form when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            form.reset(defaultValues);
            setFeatures(plan?.features || []);
            setNewFeature('');
        }
    };

    const onSubmit = async (data: PlanFormValues) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            onSave({
                id: plan?.id || '',
                name: data.name,
                description: data.description,
                price: data.price,
                billingCycle: data.billingCycle,
                features,
                isPopular: data.isPopular,
                isActive: data.isActive,
                subscriberCount: plan?.subscriberCount || 0,
            });

            form.reset(defaultValues);
            setFeatures([]);
            setNewFeature('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addFeature = () => {
        if (newFeature.trim() !== '') {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {plan
                            ? 'Edit Subscription Plan'
                            : 'Add Subscription Plan'}
                    </DialogTitle>
                    <DialogDescription>
                        {plan
                            ? 'Update the subscription plan details below'
                            : 'Fill in the details to create a new subscription plan'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter plan description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="billingCycle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billing Cycle</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select billing cycle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly">
                                                    Monthly
                                                </SelectItem>
                                                <SelectItem value="yearly">
                                                    Yearly
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Features</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a feature"
                                    value={newFeature}
                                    onChange={(e) =>
                                        setNewFeature(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addFeature();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={addFeature}
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-md border px-3 py-2"
                                    >
                                        <span className="text-sm">
                                            {feature}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => removeFeature(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {features.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No features added yet
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="isPopular"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Mark as Popular
                                            </FormLabel>
                                            <FormDescription>
                                                Highlight this plan as a popular
                                                choice
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Active
                                            </FormLabel>
                                            <FormDescription>
                                                Make this plan available for
                                                purchase
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {plan ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : plan ? (
                                    'Update Plan'
                                ) : (
                                    'Create Plan'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
