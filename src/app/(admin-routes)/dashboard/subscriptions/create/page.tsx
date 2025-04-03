import { Metadata } from 'next';
import { SubscriptionPlanForm } from '@/components/Dashboard/Subscription/SubscriptionPlanForm';

export const metadata: Metadata = {
    title: 'Create Subscription Plan | SoftMarket',
    description: 'Create a new subscription plan',
};

export default function CreateSubscriptionPlanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create Subscription Plan
                </h1>
                <p className="text-muted-foreground">
                    Add a new subscription plan for software products
                </p>
            </div>

            <SubscriptionPlanForm />
        </div>
    );
}
