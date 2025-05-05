'use client';

import ProductCatalog from '@/components/Product';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDetail } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useRootContext } from '@/lib/contexts/RootContext';

// ProductCardSkeleton component for loading state
const ProductCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-5 w-16" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </CardFooter>
        </Card>
    );
};

// ProductCatalogSkeleton component
const ProductCatalogSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            {/* Skeleton for filters */}
            <div className="hidden md:block space-y-6">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
            </div>

            {/* Skeletons for product cards */}
            <div className="space-y-6">
                <div className="flex justify-between mb-4">
                    <div>
                        <Skeleton className="h-6 w-24 hidden md:block" />
                        <Skeleton className="h-4 w-48 mt-1" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [productLoading, setProductLoading] = useState<boolean>(true);
    const [query, setQuery] = useState('');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { access_token, refresh_token, loading } = useRootContext();

    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        if (!loading && access_token) {
            (async () => {
                setProductLoading(true);
                try {
                    const response = await axios.get<{ data: ProductDetail[] }>(
                        `${backendUrl}/products?name=${query ? query : ''}`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setProducts(response.data.data);
                } catch (err) {
                    console.error('Error fetching products:', err);
                } finally {
                    setProductLoading(false);
                }
            })();
        }
    }, [loading, access_token, refresh_token, backendUrl, query]);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2">Software Products</h1>
            <p className="text-muted-foreground mb-8">
                Browse our collection of high-quality software products and
                services
            </p>

            {productLoading ? (
                <ProductCatalogSkeleton />
            ) : (
                <ProductCatalog
                    products={products}
                    query={query}
                    setQuery={setQuery}
                />
            )}
        </div>
    );
}
