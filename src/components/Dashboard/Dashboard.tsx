'use client';

import { DollarSign, Users, CreditCard, Package } from 'lucide-react';

import { MetricCard } from '@/components/Dashboard/MetricCard';
import { OverviewChart } from '@/components/Dashboard/OverviewChart';
import { RecentSales } from '@/components/Dashboard/RecentSales';

export default function Dashboard() {
    const metricCards = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            percentageChange: '+20.1% from last month',
            icon: DollarSign,
            data: [
                { name: 'Jan', value: 1200 },
                { name: 'Feb', value: 2900 },
                { name: 'Mar', value: 3300 },
                { name: 'Apr', value: 4500 },
                { name: 'May', value: 4200 },
                { name: 'Jun', value: 5000 },
            ],
        },
        {
            title: 'Subscriptions',
            value: '+2350',
            percentageChange: '+180.1% from last month',
            icon: Users,
            data: [
                { name: 'Jan', value: 500 },
                { name: 'Feb', value: 900 },
                { name: 'Mar', value: 1300 },
                { name: 'Apr', value: 1700 },
                { name: 'May', value: 2100 },
                { name: 'Jun', value: 2350 },
            ],
        },
        {
            title: 'Sales',
            value: '+12,234',
            percentageChange: '+19% from last month',
            icon: CreditCard,
            data: [
                { name: 'Jan', value: 2000 },
                { name: 'Feb', value: 4000 },
                { name: 'Mar', value: 6000 },
                { name: 'Apr', value: 8000 },
                { name: 'May', value: 10000 },
                { name: 'Jun', value: 12234 },
            ],
        },
        {
            title: 'Active Products',
            value: '+573',
            percentageChange: '+201 since last hour',
            icon: Package,
            data: [
                { name: 'Jan', value: 100 },
                { name: 'Feb', value: 200 },
                { name: 'Mar', value: 300 },
                { name: 'Apr', value: 400 },
                { name: 'May', value: 500 },
                { name: 'Jun', value: 573 },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your marketplace.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metricCards.map((card, index) => (
                    <MetricCard key={index} {...card} />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart />
                <RecentSales />
            </div>
        </div>
    );
}
