'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRootContext } from '@/lib/contexts/RootContext';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
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
    Star,
    ArrowUpRight,
    Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import SellerAnalyticsPageSkeleton from './SellerAnalyticsPageSkeleton';

export default function SellerAnalyticsPage() {
    const [products, setProducts] = useState([]);
    const [revenueOverTime, setRevenueOverTime] = useState([]);
    const [salesOverTime, setSalesOverTime] = useState([]);
    const [conversionRates, setConversionRates] = useState([]);
    const [topPerforming, setTopPerforming] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { access_token, refresh_token, user } = useRootContext();
    console.log(user);
    const COLORS = [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
        'hsl(var(--muted))',
        'hsl(var(--destructive))',
        'hsl(var(--success))',
    ];

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/analytics${url}?sellerId=${user.sellerProfile.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                }
            );
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
                `${API_BASE_URL}/analytics/seller/invalidate-cache?sellerId=${user.sellerProfile.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
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
            fetchData('/seller/products', setProducts),
            fetchData('/seller/revenue', setRevenueOverTime),
            fetchData('/seller/sales', setSalesOverTime),
            fetchData('/seller/conversions', setConversionRates),
            fetchData('/seller/top-performing', setTopPerforming),
            fetchData('/seller/dashboard-summary', setDashboardSummary),
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

    if (loading) {
        return <SellerAnalyticsPageSkeleton />;
    }

    // Format data for charts
    const formattedRevenueData = revenueOverTime.map((item) => ({
        ...item,
        formattedRevenue: formatCurrency(item.revenue),
    }));

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Seller Dashboard & Analytics
                </h1>
                <Button
                    onClick={refreshData}
                    disabled={refreshing}
                    variant="outline"
                >
                    {refreshing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Data
                        </>
                    )}
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/15 border border-destructive text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Dashboard Summary Cards */}
            {dashboardSummary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {dashboardSummary.totalProducts}
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {dashboardSummary.totalSales}
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {formatCurrency(
                                        dashboardSummary.totalRevenue
                                    )}
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {dashboardSummary.totalReviews}
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Star className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Monthly Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Over Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                        <CardDescription>
                            Monthly revenue breakdown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={formattedRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={(label) =>
                                        `Month: ${label}`
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary)/0.2)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="text-sm text-muted-foreground">
                            {dashboardSummary?.monthlyRevenue && (
                                <span>
                                    Current month:{' '}
                                    {formatCurrency(
                                        dashboardSummary.monthlyRevenue
                                    )}
                                </span>
                            )}
                        </div>
                    </CardFooter>
                </Card>

                {/* Sales Over Time */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                        <CardDescription>
                            Monthly sales by product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                {/* Dynamically create lines for each product */}
                                {salesOverTime.length > 0 &&
                                    Object.keys(salesOverTime[0])
                                        .filter((key) => key !== 'month')
                                        .slice(0, 5) // Limit to top 5 products for clarity
                                        .map((key, index) => (
                                            <Line
                                                key={key}
                                                type="monotone"
                                                dataKey={key}
                                                stroke={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                                activeDot={{ r: 8 }}
                                            />
                                        ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="text-sm text-muted-foreground">
                            {dashboardSummary?.monthlySales && (
                                <span>
                                    Current month:{' '}
                                    {dashboardSummary.monthlySales} sales
                                </span>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Conversion Rates and Top Performing Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversion Rates */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Conversion Rates</CardTitle>
                        <CardDescription>
                            Cart to purchase conversion rates by product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {conversionRates.map((item, index) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.purchaseCount} purchases /{' '}
                                            {item.cartCount} carts
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Badge className="bg-primary">
                                            {item.conversionRate}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Products */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Top Performing Products</CardTitle>
                        <CardDescription>Ranked by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topPerforming.slice(0, 3).map((product) => (
                                <div key={product.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i <
                                                            Math.round(
                                                                product.averageRating
                                                            )
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                )
                                            )}
                                            <span className="ml-2 text-sm">
                                                {product.averageRating.toFixed(
                                                    1
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">
                                                {product.salesCount} sales
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">
                                                {formatCurrency(
                                                    product.revenue
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {product.recentReviews.length > 0 && (
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Recent review:
                                            </p>
                                            <div className="bg-muted p-2 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {
                                                            product
                                                                .recentReviews[0]
                                                                .username
                                                        }
                                                    </span>
                                                    <div className="flex">
                                                        {Array.from({
                                                            length: 5,
                                                        }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${
                                                                    i <
                                                                    product
                                                                        .recentReviews[0]
                                                                        .rating
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm mt-1">
                                                    {
                                                        product.recentReviews[0]
                                                            .comment
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* All Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>
                        Performance metrics for all your products
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">
                                        Product Name
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        Rating
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        Sales
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        Revenue
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        Launch Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b">
                                        <td className="py-3 px-4">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge
                                                className={
                                                    product.status === 'Active'
                                                        ? 'bg-green-500'
                                                        : product.status ===
                                                            'Pending'
                                                          ? 'bg-yellow-500'
                                                          : 'bg-red-500'
                                                }
                                            >
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                                                <span>
                                                    {product.averageRating.toFixed(
                                                        1
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    ({product.reviewCount})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {product.salesCount}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatCurrency(
                                                product.totalRevenue
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(
                                                product.launchDate
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
