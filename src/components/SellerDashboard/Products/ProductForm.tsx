'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
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
import { useRootContext } from '@/lib/contexts/RootContext';

// Define types based on the API response
interface ProductFeatures {
    [key: string]: string;
}

interface ProductRequirements {
    [key: string]: string;
}

interface Subscription {
    id: string;
    basePrice: number;
    price: number;
    name: string;
    duration: number;
}

interface ProductResponse {
    id: string;
    name: string;
    description: string;
    features: ProductFeatures;
    requirements: ProductRequirements;
    filePath: string;
    category: {
        id: string;
        name: string;
    };
    subscriptions: Subscription[];
    seller: any;
    reviews: any[];
    averageRating: number;
    isWishlisted: boolean;
    isInCart: boolean;
}

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
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Mock categories - replace with your actual category data or API call
const categories = [
    { id: 'cat1', name: 'Design' },
    { id: 'cat2', name: 'Development' },
    { id: 'cat3', name: 'Business' },
    { id: 'cat4', name: 'Security' },
    { id: 'cat5', name: 'Utilities' },
    { id: 'cat6', name: 'Productivity' },
];

const GET_PRODUCT_BY_ID = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

interface ProductFormProps {
    id?: string;
}

export function ProductForm({ id }: ProductFormProps) {
    const router = useRouter();
    const { access_token, refresh_token } = useRootContext();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Initialize form with empty values
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            categoryId: '',
            features: '',
            requirements: '',
        },
        mode: 'onChange',
    });

    // Fetch product if id is provided
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Helper to convert object to string representation
    const objectToString = (obj: Record<string, string>): string => {
        return Object.entries(obj)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
    };

    // Helper to convert string representation back to object
    const stringToObject = (str: string): Record<string, string> => {
        const result: Record<string, string> = {};

        str.split('\n').forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                const colonIndex = trimmedLine.indexOf(':');
                if (colonIndex !== -1) {
                    const key = trimmedLine.slice(0, colonIndex).trim();
                    const value = trimmedLine.slice(colonIndex + 1).trim();
                    if (key) result[key] = value;
                }
            }
        });

        return result;
    };

    const fetchProduct = async () => {
        if (!id) return;

        setIsLoading(true);
        try {
            const res: any = await axios.get(`${GET_PRODUCT_BY_ID}/${id}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });

            if (res.status === 200 && res.data.success) {
                const productData: ProductResponse = res.data.data;
                setProduct(productData);

                // Convert features and requirements objects to strings for form
                const featuresString = objectToString(productData.features);
                const requirementsString = objectToString(
                    productData.requirements
                );

                // Get base price from first subscription or use 0
                const basePrice =
                    productData.subscriptions &&
                    productData.subscriptions.length > 0
                        ? productData.subscriptions[0].price
                        : 0;

                // Update form values
                form.reset({
                    name: productData.name || '',
                    description: productData.description || '',
                    price: basePrice,
                    categoryId: productData.category?.id || '',
                    features: featuresString,
                    requirements: requirementsString,
                });

                // Set image preview if available
                if (productData.filePath) {
                    setImagePreview(productData.filePath);
                }
            } else {
                toast.error('Failed to load product data');
            }
        } catch (error: any) {
            console.error('Error fetching product:', error);
            toast.error('Error loading product data', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);

        try {
            // Convert string inputs back to objects for API
            const features = stringToObject(data.features || '');
            const requirements = stringToObject(data.requirements || '');

            // Prepare data for API (format may need adjusting based on API requirements)
            const apiData = {
                name: data.name,
                description: data.description,
                features,
                requirements,
                categoryId: data.categoryId,
                // Handle any subscription data as needed
                subscriptions: [
                    {
                        price: data.price,
                        basePrice: data.price,
                        // Keep other subscription data if editing
                        ...(product?.subscriptions &&
                        product.subscriptions.length > 0
                            ? {
                                  name: product.subscriptions[0].name,
                                  duration: product.subscriptions[0].duration,
                              }
                            : {
                                  name: 'Basic Plan',
                                  duration: 1,
                              }),
                    },
                ],
            };

            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
            let method = 'post';

            // If editing, use PUT method and include ID in URL
            if (id) {
                url = `${url}/${id}`;
                method = 'put';
            }

            // Make API request
            const response = await axios({
                method,
                url,
                data: apiData,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });

            // Show success message
            toast.success(
                id
                    ? 'Product updated successfully'
                    : 'Product created successfully',
                {
                    description: id
                        ? 'Your product has been updated'
                        : 'Your product has been added to the marketplace',
                }
            );

            // Redirect to products list
            router.push('/dashboard/seller/products');
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

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading product data...</span>
                </CardContent>
            </Card>
        );
    }

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
                                                <FormLabel>
                                                    Base Price ($)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Set the base price for your
                                                    product's basic subscription
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
                                                    placeholder="List features in key: value format (one per line)
Example:
feature1: value1
feature2: value2"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter features in key: value
                                                format, one per line
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
                                                    placeholder="List requirements in key: value format (one per line)
Example:
os: Windows
ram: 4GB"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter requirements in key: value
                                                format, one per line
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
                                                    src={imagePreview}
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
                                                {id
                                                    ? 'Updating...'
                                                    : 'Creating...'}
                                            </>
                                        ) : id ? (
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
