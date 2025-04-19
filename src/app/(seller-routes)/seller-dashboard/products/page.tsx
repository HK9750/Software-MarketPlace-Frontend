'use client';
import ProductsPage from '@/components/Dashboard/Products/Products';
import { useRootContext } from '@/lib/contexts/RootContext';

export default function SellerProductsPage() {
    const { user } = useRootContext();
    console.log('SellerId', user.id);
    return (
        <>
            <ProductsPage id={user.id} type="seller" />
        </>
    );
}
