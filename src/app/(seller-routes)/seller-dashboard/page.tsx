'use client';

import { ProductsTableSkeleton } from '@/components/SellerDashboard/Products/ProductsTableSkeleton';
import { SellerProductsTable } from '@/components/SellerDashboard/Products/SellerProductsTable';

export default function SellerDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Seller Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Manage your products and view sales analytics
                </p>
            </div>
        </div>
    );
}
