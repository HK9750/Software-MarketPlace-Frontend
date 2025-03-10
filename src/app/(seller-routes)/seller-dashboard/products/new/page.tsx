import type { Metadata } from 'next';
import { ProductForm } from '@/components/SellerDashboard/Products/ProductForm';

export const metadata: Metadata = {
    title: 'Add New Product | Seller Dashboard',
    description: 'Add a new product to your store',
};

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Add New Product
                </h1>
                <p className="text-muted-foreground">
                    Create a new product to sell in the marketplace
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
