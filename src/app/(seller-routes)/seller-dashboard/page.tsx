import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SellerOverview } from '@/components/SellerDashboard/SellerOverview';
import { SellerStats } from '@/components/SellerDashboard/SellerStats';
import { RecentSales } from '@/components/SellerDashboard/RecentSales';
import { ProductsTableSkeleton } from '@/components/SellerDashboard/Products/ProductsTableSkeleton';
import { SellerProductsTable } from '@/components/SellerDashboard/Products/SellerProductsTable';

export const metadata: Metadata = {
    title: 'Seller Dashboard | SoftMarket',
    description: 'Manage your products and view sales analytics',
};

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

            <SellerStats />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <SellerOverview />
                <RecentSales />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Products</h2>
                <Suspense fallback={<ProductsTableSkeleton />}>
                    <SellerProductsTable />
                </Suspense>
            </div>
        </div>
    );
}
