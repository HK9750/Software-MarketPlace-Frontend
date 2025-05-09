'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
   
    LineChart,
    Line,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import {
    Loader2,
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AnalyticsPageSkeleton from './AnalyticsPageSkeleton';
import useAccessToken from '@/lib/accessToken';

export default function AnalyticsPage() {
    const [ordersOverTime, setOrdersOverTime] = useState([]);
    const [productPerformance, setProductPerformance] = useState([]);
    const [conversionRate, setConversionRate] = useState(null);
    const [userSignups, setUserSignups] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const access_token = useAccessToken();

    // const COLORS = [
    //     'hsl(var(--primary))',
    //     'hsl(var(--secondary))',
    //     'hsl(var(--accent))',
    //     'hsl(var(--muted))',
    // ];

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(`${API_BASE_URL}${url}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            setter(response.data);
            return true;
        } catch (err) {
            console.error(`Error fetching data from ${url}:`, err);
            setError(`Failed to load data from ${url}`);
            return false;
        }
    };

    const refreshData = async () => {
        setRefreshing(true);

        try {
            await axios.post(
                `${API_BASE_URL}/analytics/invalidate-cache`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            await fetchAllData();
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Failed to refresh data. Please try again.');
        } finally {
            setRefreshing(false);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        const results = await Promise.all([
            fetchData('/analytics/orders-over-time', setOrdersOverTime),
            fetchData('/analytics/product-performance', setProductPerformance),
            fetchData('/analytics/conversion-rate', setConversionRate),
            fetchData('/analytics/user-signups', setUserSignups),
            fetchData('/analytics/dashboard-summary', setDashboardSummary),
        ]);

        setLoading(false);

        if (!results.every(Boolean)) {
            setError(
                'Some data failed to load. Please try refreshing the page.'
            );
        }
    };

    useEffect(() => {
        if (access_token) {
            fetchAllData();
        }
    }, [access_token]);

    // Transform product performance data for bar chart
    const transformedProductData = productPerformance
        .slice(0, 5)
        .map((product) => ({
            name:
                product.name.length > 12
                    ? `${product.name.substring(0, 12)}...`
                    : product.name,
            orders: product.orderCount,
            rating: product.averageRating,
        }));

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background p-2 border rounded shadow-sm">
                    <p className="font-medium">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}:{' '}
                            {entry.name === 'Revenue'
                                ? formatCurrency(entry.value)
                                : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <AnalyticsPageSkeleton />;
    }

    if (error && !ordersOverTime.length && !productPerformance.length) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center">
                <p className="text-xl text-destructive mb-4">
                    Unable to load analytics data
                </p>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={fetchAllData}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Detailed insights and statistics about your marketplace
                    </p>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={refreshData}
                                disabled={refreshing}
                                className="flex items-center gap-2"
                            >
                                {refreshing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                Refresh Data
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Refresh all analytics data</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {dashboardSummary && (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                            <p className="text-muted-foreground text-sm">
                                Total Orders
                            </p>
                            <h3 className="text-2xl font-bold">
                                {dashboardSummary.totalOrders}
                            </h3>
                            <Badge variant="outline" className="mt-2">
                                {dashboardSummary.monthlyOrders} this month
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <DollarSign className="h-8 w-8 text-primary mb-2" />
                            <p className="text-muted-foreground text-sm">
                                Total Revenue
                            </p>
                            <h3 className="text-2xl font-bold">
                                {formatCurrency(dashboardSummary.totalRevenue)}
                            </h3>
                            <Badge variant="outline" className="mt-2">
                                {formatCurrency(
                                    dashboardSummary.monthlyRevenue
                                )}{' '}
                                this month
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <Users className="h-8 w-8 text-primary mb-2" />
                            <p className="text-muted-foreground text-sm">
                                Total Users
                            </p>
                            <h3 className="text-2xl font-bold">
                                {dashboardSummary.totalUsers}
                            </h3>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <TrendingUp className="h-8 w-8 text-primary mb-2" />
                            <p className="text-muted-foreground text-sm">
                                Conversion Rate
                            </p>
                            <h3 className="text-2xl font-bold">
                                {conversionRate?.conversionRate || '0%'}
                            </h3>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="w-full flex justify-center items-center">
                <Card className="md:w-2/3">
                    <CardHeader>
                        <CardTitle>Orders & Revenue Over Time</CardTitle>
                        <CardDescription>
                            Monthly order volume and revenue trends
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={ordersOverTime}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <RechartsTooltip
                                    content={
                                        <CustomTooltip
                                            active={undefined}
                                            payload={undefined}
                                            label={undefined}
                                        />
                                    }
                                />
                                <Legend />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="orderCount"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary)/0.2)"
                                    name="Orders"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--secondary))"
                                    fill="hsl(var(--secondary)/0.2)"
                                    name="Revenue"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Signups</CardTitle>
                        <CardDescription>
                            New user registrations by month
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={userSignups}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip
                                    content={
                                        <CustomTooltip
                                            active={undefined}
                                            payload={undefined}
                                            label={undefined}
                                        />
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="signups"
                                    stroke="hsl(var(--primary))"
                                    name="New Users"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Products</CardTitle>
                        <CardDescription>
                            Products with highest order counts and ratings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={transformedProductData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    domain={[0, 5]}
                                />
                                <RechartsTooltip
                                    content={
                                        <CustomTooltip
                                            active={undefined}
                                            payload={undefined}
                                            label={undefined}
                                        />
                                    }
                                />
                                <Legend />
                                <Bar
                                    yAxisId="left"
                                    dataKey="orders"
                                    fill="hsl(var(--primary))"
                                    name="Orders"
                                />
                                <Bar
                                    yAxisId="right"
                                    dataKey="rating"
                                    fill="hsl(var(--secondary))"
                                    name="Rating (0-5)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
