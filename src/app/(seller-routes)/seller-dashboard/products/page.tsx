import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ProductsTableSkeleton } from '@/components/SellerDashboard/Products/ProductsTableSkeleton';
import { SellerProductsTable } from '@/components/SellerDashboard/Products/SellerProductsTable';

export const metadata: Metadata = {
    title: 'Products | Seller Dashboard',
    description: 'Manage your products in the marketplace',
};

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Products
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your products in the marketplace
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/seller/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Product
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<ProductsTableSkeleton />}>
                <SellerProductsTable />
            </Suspense>
        </div>
    );
}
