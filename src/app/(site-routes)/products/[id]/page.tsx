'use client';

import { useGetCookies } from '@/hooks/useGetCookies';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '@/types/types';
import ProductDetails from '@/components/Product/ProductDetails';
import Loader from '@/components/Loader';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const { access_token, refresh_token, loading, error } = useGetCookies();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { id } = await params; // Await the params Promise
                if (!loading && access_token && !error) {
                    setProductLoading(true);
                    const response = await axios.get<{ data: Product }>(
                        `${backendUrl}/products/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setProduct(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setProductLoading(false);
            }
        };

        fetchProduct();
    }, [params, loading, access_token, refresh_token, error]);

    return (
        <div className="container mx-auto py-8 px-4">
            {productLoading ? <Loader /> : <ProductDetails product={product} />}
        </div>
    );
};

export default Page;
