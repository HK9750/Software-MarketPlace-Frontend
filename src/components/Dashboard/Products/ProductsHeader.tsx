/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';

export function ProductsHeader() {
    const user = useSelector((state: any) => state.auth.userData);
    const isSeller = user && user.role === 'SELLER';

    return (
        <div className="space-y-4 pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Products
                        </h1>
                        <Badge
                            variant="outline"
                            className="ml-2 hidden sm:inline-flex"
                        >
                            {isSeller ? 'Seller View' : 'Admin View'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                        Manage your product catalog, inventory, and listings in
                        one centralized dashboard.
                    </p>
                </div>

                {isSeller && (
                    <div className="flex justify-start sm:justify-end">
                        <Button
                            size="default"
                            className="font-medium shadow-sm"
                        >
                            <Link
                                href="/seller-dashboard/products/new"
                                className="flex items-center"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Product
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
            <Separator />
        </div>
    );
}
