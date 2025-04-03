'use client';

import { SubscriptionPlanForm } from '@/components/Dashboard/Subscription/SubscriptionPlanForm';
import { notFound, useParams } from 'next/navigation';

export default function EditSubscriptionPlanPage() {
    const params = useParams();
    const subscriptionId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!subscriptionId) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Subscription Plan
                </h1>
                <p className="text-muted-foreground">
                    Update the details for the subscription plan.
                </p>
            </div>

            <SubscriptionPlanForm subscriptionId={subscriptionId} />
        </div>
    );
}
