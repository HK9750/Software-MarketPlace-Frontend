'use client';

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
import { Category } from '@/types/types';
import { useEffect } from 'react';

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
    isSubmitting: boolean;
    onClose: () => void;
    onSave: (
        category: Omit<Category, 'id' | 'productCount'> & { id?: string }
    ) => void;
}

export function CategoryDialog({
    isOpen,
    category,
    isSubmitting,
    onClose,
    onSave,
}: CategoryDialogProps) {
    // Default values
    console.log('category', category);

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
        onSave({
            id: category?.id,
            name: data.name,
            description: data.description,
        });
    };

    useEffect(() => {
        form.reset({
            name: category?.name || '',
            description: category?.description || '',
        });
    }, [category, form.reset]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
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
                        className="space-y-6"
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
