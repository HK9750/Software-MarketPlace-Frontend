import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Orders | Seller Dashboard',
    description: 'Manage your orders and track sales',
};

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    Manage your orders and track sales
                </p>
            </div>

            <div className="rounded-lg border p-8 text-center">
                <h2 className="text-lg font-medium">Orders Management</h2>
                <p className="mt-2 text-muted-foreground">
                    This page is under construction. Check back soon for order
                    management features.
                </p>
            </div>
        </div>
    );
}
