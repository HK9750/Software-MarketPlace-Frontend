'use client';

import { Suspense } from 'react';
import { CategoryTableSkeleton } from '@/components/Dashboard/Category/CategoryTableSkeleton';
import { CategoryTable } from '@/components/Dashboard/Category/CategoryTable';

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
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
