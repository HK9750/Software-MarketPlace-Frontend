/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, ExternalLink, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import useAccessToken from '@/lib/accessToken';

const GET_PRODUCT_BY_ID = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

interface Subscription {
    id: string;
    basePrice: number;
    price: number;
    name: string;
    duration: number;
}

interface Category {
    id: string;
    name: string;
}

interface ProductData {
    id: string;
    name: string;
    description: string;
    features: Record<string, string>;
    requirements: Record<string, string>;
    filePath: string;
    category: Category;
    subscriptions: Subscription[];
    averageRating: number;
    isWishlisted: boolean;
    isInCart: boolean;
    sales?: number;
    status?: string;
    dateAdded?: string;
}

export default function ProductDetailsPage() {
    const paramsId = useParams<{ id: string }>().id;
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const access_token = useAccessToken();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res: any = await axios.get(
                    `${GET_PRODUCT_BY_ID}/${paramsId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                if (res.status === 200 && res.data.success) {
                    // Add some default values for admin dashboard metrics
                    // that may not be in the API response
                    setProduct({
                        ...res.data.data,
                        sales: res.data.data.sales || 0,
                        status: res.data.data.status || 'active',
                        dateAdded:
                            res.data.data.dateAdded || new Date().toISOString(),
                    });
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [paramsId, access_token]);

    // Helper function to convert object to array of features
    const getFeaturesList = (
        features: Record<string, string> | null | undefined
    ) => {
        if (!features) return [];
        return Object.entries(features).map(
            ([key, value]) => `${key}: ${value}`
        );
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Product not found</h1>
                    <p className="text-muted-foreground">
                        The product you are looking for does not exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div>
                        {loading ? (
                            <>
                                <Skeleton className="h-8 w-48 mb-1" />
                                <Skeleton className="h-4 w-64" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {product?.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    Product details and performance
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button asChild>
                        <Link
                            href={`/seller-dashboard/products/${product?.id}/edit`}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>
                            Basic details about your product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex items-center justify-center">
                                {loading ? (
                                    <Skeleton className="rounded-lg border w-[200px] h-[200px]" />
                                ) : (
                                    <img
                                        src={
                                            product?.filePath ||
                                            '/placeholder.svg'
                                        }
                                        alt={product?.name}
                                        className="rounded-lg border object-contain max-w-[200px] max-h-[200px]"
                                    />
                                )}
                            </div>
                            <div className="space-y-4 flex-1">
                                {loading ? (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-6 w-40 mb-2" />
                                            </div>
                                            <Skeleton className="h-4 w-full mb-1" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Skeleton className="h-4 w-16 mb-2" />
                                                <Skeleton className="h-6 w-24" />
                                            </div>
                                            <div>
                                                <Skeleton className="h-4 w-20 mb-2" />
                                                <Skeleton className="h-6 w-28" />
                                            </div>
                                            <div>
                                                <Skeleton className="h-4 w-16 mb-2" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                            <div>
                                                <Skeleton className="h-4 w-16 mb-2" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                        <div className="pt-2">
                                            <Skeleton className="h-9 w-40" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-semibold">
                                                    {product?.name}
                                                </h3>
                                                {product?.status && (
                                                    <Badge
                                                        className={
                                                            product.status ===
                                                            'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }
                                                    >
                                                        {product.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            product.status.slice(
                                                                1
                                                            )}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {product?.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Base Price
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    $
                                                    {product?.subscriptions?.[0]?.price.toFixed(
                                                        2
                                                    ) || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Category
                                                </p>
                                                <p>{product?.category?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Subscription Plans
                                                </p>
                                                <p>
                                                    {product?.subscriptions
                                                        ?.length || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Rating
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    <span>
                                                        {product?.averageRating.toFixed(
                                                            1
                                                        )}
                                                        /5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Added On
                                            </p>
                                            <p>
                                                {product?.dateAdded
                                                    ? new Date(
                                                          product.dateAdded
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/products/${product?.id}`}
                                                    target="_blank"
                                                >
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View in Marketplace
                                                </Link>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>
                            Sales and performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            {loading ? (
                                <>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-10 w-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-10 w-28" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-10 w-16" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-10 w-20" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Sales
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {product?.sales || 0}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Revenue
                                        </p>
                                        <p className="text-3xl font-bold">
                                            $
                                            {(
                                                (product?.sales || 0) *
                                                (product?.subscriptions?.[0]
                                                    ?.price || 0)
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Conversion Rate
                                        </p>
                                        <p className="text-3xl font-bold">
                                            3.2%
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Page Views
                                        </p>
                                        <p className="text-3xl font-bold">
                                            38.9K
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="subscriptions">
                        Subscriptions
                    </TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {loading ? (
                                <>
                                    <div>
                                        <Skeleton className="h-6 w-32 mb-3" />
                                        <div className="pl-5 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-5/6" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-6 w-48 mb-3" />
                                        <div className="pl-5 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-5/6" />
                                            <Skeleton className="h-4 w-4/5" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Features
                                        </h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {getFeaturesList(
                                                product?.features
                                            ).map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            System Requirements
                                        </h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {getFeaturesList(
                                                product?.requirements
                                            ).map((requirement, index) => (
                                                <li key={index}>
                                                    {requirement}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="subscriptions" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </div>
                            ) : product?.subscriptions &&
                              product.subscriptions.length > 0 ? (
                                <div className="space-y-4">
                                    {product.subscriptions.map(
                                        (subscription) => (
                                            <div
                                                key={subscription.id}
                                                className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50"
                                            >
                                                <div>
                                                    <h3 className="font-medium">
                                                        {subscription.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Duration:{' '}
                                                        {subscription.duration}{' '}
                                                        {subscription.duration ===
                                                        1
                                                            ? 'month'
                                                            : 'months'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">
                                                        $
                                                        {subscription.price.toFixed(
                                                            2
                                                        )}
                                                    </p>
                                                    {subscription.basePrice !==
                                                        subscription.price && (
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            $
                                                            {subscription.basePrice.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No subscription plans available for this
                                        product.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No reviews yet. Reviews will appear here
                                        as customers provide feedback.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
