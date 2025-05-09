/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import useAccessToken from '@/lib/accessToken';

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
    discount?: number;
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
    discount: z.coerce
        .number()
        .min(0, { message: 'Discount cannot be negative' })
        .max(100, { message: 'Discount cannot exceed 100%' })
        .optional(),
    categoryId: z.string({ required_error: 'Please select a category' }),
    features: z.string().optional(),
    requirements: z.string().optional(),
    // We'll handle subscriptions separately
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Type for subscription options with prices
interface SubscriptionOption {
    subscriptionPlanId: string;
    price: number;
    selected: boolean;
}

const GET_PRODUCT_BY_ID = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
const CREATE_PRODUCT_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
const GET_SUBSCRIPTION_PLANS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/plans`;
const GET_CATEGORIES_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`;

interface ProductFormProps {
    id?: string;
}

export function ProductForm({ id }: ProductFormProps) {
    const router = useRouter();
    const access_token = useAccessToken();
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
    const [subscriptionOptions, setSubscriptionOptions] = useState<
        SubscriptionOption[]
    >([]);
    const [isLoadingSubscriptionPlans, setIsLoadingSubscriptionPlans] =
        useState(false);

    // Initialize form with empty values
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: '',
            description: '',
            discount: 0,
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
            const res: any = await axios.get(GET_CATEGORIES_URL, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

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
                },
            });

            if (res.status === 200 && res.data.success) {
                setSubscriptionPlans(res.data.data);

                // Initialize subscription options with default values
                const options = res.data.data.map((plan: SubscriptionPlan) => ({
                    subscriptionPlanId: plan.id,
                    price: 0,
                    selected: false,
                }));

                setSubscriptionOptions(options);
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

                // Update form values
                form.reset({
                    name: productData.name || '',
                    description: productData.description || '',
                    discount: productData.discount || 0,
                    categoryId: productData.category?.id || '',
                    features: featuresString,
                    requirements: requirementsString,
                });

                // Set image preview if available
                if (productData.filePath) {
                    setImagePreview(productData.filePath);
                }

                // Map existing subscriptions to the subscription options
                if (
                    productData.subscriptions &&
                    productData.subscriptions.length > 0
                ) {
                    // Create a mapping of plan IDs to subscription data
                    const existingSubscriptionsMap =
                        productData.subscriptions.reduce(
                            (acc: Record<string, Subscription>, sub) => {
                                acc[sub.subscriptionPlanId] = sub;
                                return acc;
                            },
                            {}
                        );

                    // Wait for subscription plans to be loaded
                    if (subscriptionPlans.length > 0) {
                        const updatedOptions = subscriptionPlans.map((plan) => {
                            const existingSub =
                                existingSubscriptionsMap[plan.id];
                            return {
                                subscriptionPlanId: plan.id,
                                price: existingSub ? existingSub.basePrice : 0,
                                selected: !!existingSub,
                            };
                        });
                        setSubscriptionOptions(updatedOptions);
                    }
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

    // Update subscription options when subscription plans are loaded after product data
    useEffect(() => {
        if (product && product.subscriptions && subscriptionPlans.length > 0) {
            // Create a mapping of plan IDs to subscription data
            const existingSubscriptionsMap = product.subscriptions.reduce(
                (acc: Record<string, Subscription>, sub) => {
                    acc[sub.subscriptionPlanId] = sub;
                    return acc;
                },
                {}
            );

            const updatedOptions = subscriptionPlans.map((plan) => {
                const existingSub = existingSubscriptionsMap[plan.id];
                return {
                    subscriptionPlanId: plan.id,
                    price: existingSub ? existingSub.basePrice : 0,
                    selected: !!existingSub,
                };
            });
            setSubscriptionOptions(updatedOptions);
        }
    }, [product, subscriptionPlans]);

    const handleSubscriptionChange = (planId: string, checked: boolean) => {
        setSubscriptionOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.subscriptionPlanId === planId
                    ? { ...option, selected: checked }
                    : option
            )
        );
    };

    const handlePriceChange = (planId: string, price: string) => {
        const numericPrice = parseFloat(price) || 0;
        setSubscriptionOptions((prevOptions) =>
            prevOptions.map((option) =>
                option.subscriptionPlanId === planId
                    ? { ...option, price: numericPrice }
                    : option
            )
        );
    };

    const onSubmit = async (data: ProductFormValues) => {
        // Check if at least one subscription plan is selected
        const selectedOptions = subscriptionOptions.filter(
            (option) => option.selected
        );

        if (selectedOptions.length === 0) {
            toast.error('Please select at least one subscription plan');
            return;
        }

        // Check if all selected options have prices
        const invalidPriceOptions = selectedOptions.filter(
            (option) => option.price <= 0
        );

        if (invalidPriceOptions.length > 0) {
            toast.error(
                'All selected subscription plans must have valid prices'
            );
            return;
        }

        if (!selectedFile && !id) {
            toast.error('Please select a product image');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert string inputs back to objects for API
            const features = stringToObject(data.features || '');
            const requirements = stringToObject(data.requirements || '');

            // Create FormData for multipart/form-data submission
            const formData = new FormData();

            // Get only the selected subscription options
            const subscriptionOptionsForAPI = subscriptionOptions
                .filter((option) => option.selected)
                .map((option) => ({
                    subscriptionPlanId: option.subscriptionPlanId,
                    price: option.price,
                }));

            // Prepare JSON data
            const jsonData = {
                name: data.name,
                description: data.description,
                features,
                requirements,
                categoryId: data.categoryId,
                subscriptionOptions: subscriptionOptionsForAPI,
                discount: data.discount,
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
            await axios({
                method,
                url,
                data: formData,
                headers: {
                    Authorization: `Bearer ${access_token}`,
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
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Discount (%)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="1"
                                                        min="0"
                                                        max="100"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Set a discount percentage
                                                    (0-100%) for all
                                                    subscription plans
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
                                                    value={field.value}
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

                                {/* Subscription Plans with Checkboxes */}
                                <div className="space-y-4">
                                    <FormLabel>Subscription Plans</FormLabel>
                                    <FormDescription>
                                        Select the subscription plans available
                                        for this product and set the base price
                                        for each
                                    </FormDescription>

                                    {isLoadingSubscriptionPlans ? (
                                        <div className="flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            <span>
                                                Loading subscription plans...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {subscriptionOptions.map(
                                                (option, index) => (
                                                    <div
                                                        key={
                                                            option.subscriptionPlanId
                                                        }
                                                        className="flex items-center space-x-4 border p-3 rounded-md"
                                                    >
                                                        <Checkbox
                                                            id={`plan-${option.subscriptionPlanId}`}
                                                            checked={
                                                                option.selected
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
                                                                handleSubscriptionChange(
                                                                    option.subscriptionPlanId,
                                                                    checked as boolean
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`plan-${option.subscriptionPlanId}`}
                                                            className="flex-1 text-sm font-medium cursor-pointer"
                                                        >
                                                            {
                                                                subscriptionPlans[
                                                                    index
                                                                ]?.name
                                                            }{' '}
                                                            (
                                                            {
                                                                subscriptionPlans[
                                                                    index
                                                                ]?.duration
                                                            }{' '}
                                                            months)
                                                        </label>
                                                        <div className="w-32">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    option.price ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handlePriceChange(
                                                                        option.subscriptionPlanId,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Price $"
                                                                disabled={
                                                                    !option.selected
                                                                }
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    {subscriptionOptions.filter(
                                        (opt) => opt.selected
                                    ).length === 0 && (
                                        <p className="text-sm text-destructive">
                                            Please select at least one
                                            subscription plan
                                        </p>
                                    )}
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
