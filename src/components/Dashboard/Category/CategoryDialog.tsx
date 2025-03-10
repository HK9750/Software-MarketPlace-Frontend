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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// Category type
interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

// Form schema
const categoryFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Category name must be at least 2 characters' }),
    description: z
        .string()
        .min(5, { message: 'Description must be at least 5 characters' }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
    isOpen: boolean;
    category: Category | null;
    onClose: () => void;
    onSave: (category: Category) => void;
}

export function CategoryDialog({
    isOpen,
    category,
    onClose,
    onSave,
}: CategoryDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default values
    const defaultValues: Partial<CategoryFormValues> = {
        name: category?.name || '',
        description: category?.description || '',
    };

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    // Reset form when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            form.reset(defaultValues);
        }
    };

    const onSubmit = async (data: CategoryFormValues) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            onSave({
                id: category?.id || '',
                name: data.name,
                description: data.description,
                productCount: category?.productCount || 0,
            });

            form.reset(defaultValues);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Update the category details below'
                            : 'Fill in the details to create a new category'}
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
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter category name"
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
                                            placeholder="Enter category description"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                        {category
                                            ? 'Updating...'
                                            : 'Creating...'}
                                    </>
                                ) : category ? (
                                    'Update Category'
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
