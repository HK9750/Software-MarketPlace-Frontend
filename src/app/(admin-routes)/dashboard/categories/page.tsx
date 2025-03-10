import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CategoryTableSkeleton } from '@/components/Dashboard/Category/CategoryTableSkeleton';
import { CategoryTable } from '@/components/Dashboard/Category/CategoryTable';

export const metadata: Metadata = {
    title: 'Category Management | SoftMarket',
    description: 'Manage product categories',
};

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Category Management
                </h1>
                <p className="text-muted-foreground">
                    Create and manage product categories
                </p>
            </div>

            <Suspense fallback={<CategoryTableSkeleton />}>
                <CategoryTable />
            </Suspense>
        </div>
    );
}
