/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductsPage from '@/components/Dashboard/Products/Products';
import { useSelector } from 'react-redux';

export default function SellerProductsPage() {
    const user = useSelector((state: any) => state.auth.userData);

    console.log('SellerId', user.id);
    return (
        <>
            <ProductsPage id={user.id} type="seller" />
        </>
    );
}
