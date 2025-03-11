'use client';
import ProductCatalog from '@/components/Product';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetCookies } from '@/hooks/useGetCookies';
import { Product } from '@/types/types';
import Loader from '@/components/Loader';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { access_token, refresh_token, loading, error } = useGetCookies();

    useEffect(() => {
        if (!loading && access_token && !error) {
            (async () => {
                setProductLoading(true);
                try {
                    const response = await axios.get<{ data: Product[] }>(
                        `${backendUrl}/products`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setProducts(response.data.data);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                } finally {
                    setProductLoading(false);
                }
            })();
        }
    }, [loading, access_token, refresh_token, error, backendUrl]);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2">Software Products</h1>
            <p className="text-muted-foreground mb-8">
                Browse our collection of high-quality software products and
                services
            </p>
            {productLoading ? (
                <Loader />
            ) : (
                <ProductCatalog products={products} />
            )}
        </div>
    );
}
