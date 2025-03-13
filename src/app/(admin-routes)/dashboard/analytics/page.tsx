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
} from '@/components/ui/card';
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
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
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
    const [ordersOverTime, setOrdersOverTime] = useState([]);
    const [productPerformance, setProductPerformance] = useState([]);
    const [conversionRate, setConversionRate] = useState(null);
    const [userSignups, setUserSignups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { access_token, refresh_token } = useRootContext();

    const COLORS = [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
        'hsl(var(--muted))',
    ];

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(`${API_BASE_URL}${url}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
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

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            const results = await Promise.all([
                fetchData('/analytics/orders-over-time', setOrdersOverTime),
                fetchData(
                    '/analytics/product-performance',
                    setProductPerformance
                ),
                fetchData('/analytics/conversion-rate', setConversionRate),
                fetchData('/analytics/user-signups', setUserSignups),
            ]);

            setLoading(false);

            if (!results.every(Boolean)) {
                setError(
                    'Some data failed to load. Please try refreshing the page.'
                );
            }
        };

        if (access_token) {
            fetchAllData();
        }
    }, [access_token, refresh_token]);

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

    // Create traffic sources mock data since it's not available from the API yet
    const trafficSources = [
        { name: 'Direct', value: 40 },
        { name: 'Organic', value: 30 },
        { name: 'Referral', value: 20 },
        { name: 'Social', value: 10 },
    ];

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading analytics data...</span>
            </div>
        );
    }

    if (error && !ordersOverTime.length && !productPerformance.length) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center">
                <p className="text-xl text-destructive mb-4">
                    Unable to load analytics data
                </p>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Detailed insights and statistics about your marketplace
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
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
                                <Tooltip />
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

                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>
                            Where your visitors are coming from
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficSources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {trafficSources.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Rate</CardTitle>
                        <CardDescription>
                            Cart to purchase conversion rate
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col justify-center items-center">
                        {conversionRate ? (
                            <>
                                <div className="text-5xl font-bold text-primary mb-4">
                                    {conversionRate.conversionRate}
                                </div>
                                <p className="text-muted-foreground text-center">
                                    of carts are converted to orders
                                </p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                No conversion data available
                            </p>
                        )}
                    </CardContent>
                </Card>

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
                                <Tooltip />
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
            </div>

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
                            <Tooltip />
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
    );
}
