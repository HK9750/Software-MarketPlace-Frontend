import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SubscriptionPlansTableSkeleton } from '@/components/Dashboard/Subscription/SubscriptionPlansTableSkeleton';
import { SubscriptionPlansTable } from '@/components/Dashboard/Subscription/SubscriptionPlansTable';

export const metadata: Metadata = {
    title: 'Subscription Plans | SoftMarket',
    description: 'Manage subscription plans',
};

export default function SubscriptionPlansPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Subscription Plans
                    </h1>
                    <p className="text-muted-foreground">
                        Create and manage subscription plans for sellers
                    </p>
                </div>
                <Link href="/dashboard/subscriptions/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Plan
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<SubscriptionPlansTableSkeleton />}>
                <SubscriptionPlansTable />
            </Suspense>
        </div>
    );
}
