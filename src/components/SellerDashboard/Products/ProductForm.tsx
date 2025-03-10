'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload } from 'lucide-react';
import type { Product } from '@/types/types';
import { toast } from 'sonner';

// Form schema
const productFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Product name must be at least 3 characters' }),
    description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters' }),
    price: z.coerce
        .number()
        .positive({ message: 'Price must be a positive number' }),
    categoryId: z.string({ required_error: 'Please select a category' }),
    features: z.string().optional(),
    requirements: z.string().optional(),
    status: z.enum(['active', 'inactive', 'pending'], {
        required_error: 'Please select a status',
    }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Mock categories
const categories = [
    { id: 'cat1', name: 'Design' },
    { id: 'cat2', name: 'Development' },
    { id: 'cat3', name: 'Business' },
    { id: 'cat4', name: 'Security' },
    { id: 'cat5', name: 'Utilities' },
    { id: 'cat6', name: 'Productivity' },
];

interface ProductFormProps {
    product?: any;
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.filePath || null
    );

    // Default values
    const defaultValues: Partial<ProductFormValues> = {
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        categoryId: product?.category.id || '',
        features: product?.features || '',
        requirements: product?.requirements || '',
        status:
            (product?.status as 'active' | 'inactive' | 'pending') || 'pending',
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues,
        mode: 'onChange',
    });

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Form data:', data);

            // Show success message
            toast.success(
                product
                    ? 'Product updated successfully'
                    : 'Product created successfully',
                {
                    description: product
                        ? 'Your product has been updated'
                        : 'Your product has been added to the marketplace',
                }
            );

            // Redirect to products list
            router.push('/dashboard/seller');
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Tabs
                            defaultValue="basic"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">
                                    Basic Information
                                </TabsTrigger>
                                <TabsTrigger value="details">
                                    Product Details
                                </TabsTrigger>
                                <TabsTrigger value="media">
                                    Media & Status
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="basic"
                                className="space-y-6 pt-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter product name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is how your product will
                                                appear in the marketplace
                                            </FormDescription>
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
                                                    placeholder="Describe your product"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Provide a detailed description
                                                of your product
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price ($)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Set the price for your
                                                    product
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose the category that
                                                    best fits your product
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab('details')}
                                    >
                                        Next Step
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="details"
                                className="space-y-6 pt-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="features"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Features</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="List the key features of your product"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Separate features with commas or
                                                new lines
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="requirements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                System Requirements
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="List the system requirements for your product"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Specify any hardware or software
                                                requirements
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setActiveTab('basic')}
                                    >
                                        Previous Step
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab('media')}
                                    >
                                        Next Step
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="media"
                                className="space-y-6 pt-4"
                            >
                                <div className="space-y-4">
                                    <FormLabel>Product Image</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <div className="border rounded-md p-2 w-32 h-32 flex items-center justify-center overflow-hidden">
                                            {imagePreview ? (
                                                <img
                                                    src={
                                                        imagePreview ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt="Product preview"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-muted-foreground text-center">
                                                    <Upload className="h-8 w-8 mx-auto mb-2" />
                                                    <span className="text-xs">
                                                        No image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Upload a product image.
                                                Recommended size: 800x600px.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Product Status
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                    <SelectItem value="pending">
                                                        Pending
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Set the visibility status of
                                                your product
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setActiveTab('details')}
                                    >
                                        Previous Step
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {product
                                                    ? 'Updating...'
                                                    : 'Creating...'}
                                            </>
                                        ) : product ? (
                                            'Update Product'
                                        ) : (
                                            'Create Product'
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
