/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RecentSales } from './RecentSales';
import { RecentSoftware } from './RecentSoftware';
import { SalesOverview } from './SalesOverview';
import { StatCard } from './StatCard';
import { UserActivity } from './UserActivity';
import { TopSellers } from './TopSellers';
import { SubscriptionOverview } from './SubscriptionOverview';
import { DashboardSkeleton } from './DashboardSkeleton';
import {
    AlertCircle,
    Users,
    Package,
    DollarSign,
    CreditCard,
} from 'lucide-react';
import useAccessToken from '@/lib/accessToken';

interface DashboardStats {
    totalUsers: number;
    totalSoftware: number;
    totalRevenue: number;
    pendingOrders: number;
    recentSales: any[];
    recentSoftware: any[];
    topSellers: any[];
    usersByRole: {
        CUSTOMER: number;
        SELLER: number;
        ADMIN: number;
    };
    monthlySales: {
        month: string;
        sales: number;
    }[];
    subscriptionStats: {
        ACTIVE: number;
        CANCELED: number;
        EXPIRED: number;
        PAUSED: number;
    };
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const access_token = useAccessToken();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response: any = await axios.get(
                    `${BASE_URL}/dashboard/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setStats(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(
                    'Failed to load dashboard data. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [access_token]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mx-auto max-w-2xl mt-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div></div>
                <span className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleString()}
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    description="Total registered users"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Software Products"
                    value={stats?.totalSoftware || 0}
                    description="Total active products"
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
                    description="Lifetime sales"
                    icon={
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    }
                />
                <StatCard
                    title="Pending Orders"
                    value={stats?.pendingOrders || 0}
                    description="Orders awaiting processing"
                    icon={
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    }
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
                    <TabsTrigger value="users">Users & Sellers</TabsTrigger>
                    <TabsTrigger value="products">
                        Software Products
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Sales Overview</CardTitle>
                                <CardDescription>
                                    Monthly sales performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                <SalesOverview
                                    data={stats?.monthlySales || []}
                                />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>
                                    Latest completed transactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSales sales={stats?.recentSales || []} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="sales">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Subscription Overview</CardTitle>
                                <CardDescription>
                                    Status of all subscriptions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                <SubscriptionOverview
                                    data={stats?.subscriptionStats}
                                />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Selling Software</CardTitle>
                                <CardDescription>
                                    Best performing products
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TopSellers sellers={stats?.topSellers || []} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>User Distribution</CardTitle>
                                <CardDescription>Users by role</CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                <UserActivity data={stats?.usersByRole} />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent User Activity</CardTitle>
                                <CardDescription>
                                    Latest user actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* This would require additional API endpoint for user activity */}
                                <p>User activity tracking coming soon</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="products">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Software Status</CardTitle>
                                <CardDescription>
                                    Products by status (active, pending,
                                    inactive)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                {/* Placeholder for future software status chart */}
                                <p>Software status visualization coming soon</p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Software</CardTitle>
                                <CardDescription>
                                    Recently added products
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSoftware
                                    software={stats?.recentSoftware || []}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;
