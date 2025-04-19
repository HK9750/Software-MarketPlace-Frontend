'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
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
    subscriptionPlanId: string;
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

interface SubscriptionPlan {
    id: string;
    name: string;
    duration: number;
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
    subscriptionPlanId: z.string().optional(),
    features: z.string().optional(),
    requirements: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const GET_PRODUCT_BY_ID = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
const CREATE_PRODUCT_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
const GET_SUBSCRIPTION_PLANS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/plans`;

interface ProductFormProps {
    id?: string;
}

export function ProductForm({ id }: ProductFormProps) {
    const router = useRouter();
    const { access_token, refresh_token } = useRootContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<
        { id: string; name: string }[]
    >([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<
        SubscriptionPlan[]
    >([]);
    const [isLoadingSubscriptionPlans, setIsLoadingSubscriptionPlans] =
        useState(false);

    // Initialize form with empty values
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            categoryId: '',
            subscriptionPlanId: '',
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
        fetchCategories();
        fetchSubscriptionPlans();
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

    const fetchCategories = async () => {
        try {
            const res: any = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                }
            );

            if (res.status === 200 && res.data.success) {
                setCategories(res.data.data);
            } else {
                toast.error('Failed to load categories');
            }
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            toast.error('Error loading categories', {
                description: error.message || 'Please try again later',
            });
        }
    };

    const fetchSubscriptionPlans = async () => {
        setIsLoadingSubscriptionPlans(true);
        try {
            const res: any = await axios.get(GET_SUBSCRIPTION_PLANS_URL, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });

            if (res.status === 200 && res.data.success) {
                setSubscriptionPlans(res.data.data);

                // Set the first subscription plan as default if available
                if (
                    res.data.data.length > 0 &&
                    !form.getValues('subscriptionPlanId')
                ) {
                    form.setValue('subscriptionPlanId', res.data.data[0].id);
                }
            } else {
                toast.error('Failed to load subscription plans');
            }
        } catch (error: any) {
            console.error('Error fetching subscription plans:', error);
            toast.error('Error loading subscription plans', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsLoadingSubscriptionPlans(false);
        }
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

                // Get subscription plan ID if available
                const subscriptionPlanId =
                    productData.subscriptions &&
                    productData.subscriptions.length > 0
                        ? productData.subscriptions[0].subscriptionPlanId
                        : '';

                // Update form values
                form.reset({
                    name: productData.name || '',
                    description: productData.description || '',
                    price: basePrice,
                    categoryId: productData.category?.id || '',
                    subscriptionPlanId: subscriptionPlanId,
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
        if (!selectedFile && !id) {
            toast.error('Please select a product image');
            return;
        }

        // Make sure we have subscription plans loaded
        if (subscriptionPlans.length === 0) {
            toast.error(
                'No subscription plans available. Please try again later.'
            );
            return;
        }

        // Make sure we have a selected subscription plan
        const subscriptionPlanId =
            data.subscriptionPlanId || subscriptionPlans[0].id;
        if (!subscriptionPlanId) {
            toast.error('Please select a subscription plan');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert string inputs back to objects for API
            const features = stringToObject(data.features || '');
            const requirements = stringToObject(data.requirements || '');

            // Create FormData for multipart/form-data submission
            const formData = new FormData();

            // Use the selected subscription plan
            const subscriptionOptions = [
                {
                    subscriptionPlanId: subscriptionPlanId,
                    price: data.price,
                },
            ];

            // Prepare JSON data
            const jsonData = {
                name: data.name,
                description: data.description,
                features,
                requirements,
                categoryId: data.categoryId,
                subscriptionOptions,
            };

            // Add JSON data as a string
            formData.append('data', JSON.stringify(jsonData));

            // Add image file if available
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            let url = CREATE_PRODUCT_URL;
            let method = 'post';

            // If editing, use PUT method and include ID in URL
            if (id !== undefined) {
                url = `${url}/${id}`;
                method = 'put';
            }

            // Make API request
            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                    'Content-Type': 'multipart/form-data',
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
            router.push('/seller-dashboard/products');
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong', {
                description:
                    error.response?.data?.message ||
                    error.message ||
                    'Please try again later',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
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
                        encType="multipart/form-data"
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
                                                    product's subscription
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
                                                        {categories.length >
                                                        0 ? (
                                                            categories.map(
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
                                                            )
                                                        ) : (
                                                            <SelectItem
                                                                value="loading"
                                                                disabled
                                                            >
                                                                Loading
                                                                categories...
                                                            </SelectItem>
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

                                <FormField
                                    control={form.control}
                                    name="subscriptionPlanId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Subscription Plan
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a subscription plan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoadingSubscriptionPlans ? (
                                                        <SelectItem
                                                            value="loading"
                                                            disabled
                                                        >
                                                            Loading plans...
                                                        </SelectItem>
                                                    ) : subscriptionPlans.length >
                                                      0 ? (
                                                        subscriptionPlans.map(
                                                            (plan) => (
                                                                <SelectItem
                                                                    key={
                                                                        plan.id
                                                                    }
                                                                    value={
                                                                        plan.id
                                                                    }
                                                                >
                                                                    {plan.name}{' '}
                                                                    (
                                                                    {
                                                                        plan.duration
                                                                    }{' '}
                                                                    months)
                                                                </SelectItem>
                                                            )
                                                        )
                                                    ) : (
                                                        <SelectItem
                                                            value="none"
                                                            disabled
                                                        >
                                                            No plans available
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose the subscription plan for
                                                your product
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Upload a product image.
                                                Recommended size: 800x600px.
                                            </p>
                                            {!selectedFile && !id && (
                                                <p className="text-sm text-destructive mt-1">
                                                    *Required for new products
                                                </p>
                                            )}
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
