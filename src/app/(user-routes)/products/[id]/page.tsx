'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductDetail } from '@/types/types';
import ProductDetails from '@/components/Product/ProductDetails';
import Loader from '@/components/Loader';
import useAccessToken from '@/lib/accessToken';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const access_token = useAccessToken();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { id } = await params; // Await the params Promise
                setProductLoading(true);
                const response = await axios.get<{ data: ProductDetail }>(
                    `${backendUrl}/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                setProduct(response.data.data);
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setProductLoading(false);
            }
        };

        fetchProduct();
    }, [params, access_token]);

    return (
        <div className="container mx-auto py-8 px-4">
            {productLoading ? <Loader /> : <ProductDetails product={product} />}
        </div>
    );
};

export default Page;
