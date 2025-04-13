'use client';

import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/SellerDashboard/Products/ProductForm';

export default function EditProductPage() {
    const params = useParams<{ id: string }>();
    const paramsId = params.id;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Product
                </h1>
                <p className="text-muted-foreground">
                    Update your product details
                </p>
            </div>

            <ProductForm id={paramsId} />
        </div>
    );
}
