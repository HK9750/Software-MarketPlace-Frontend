'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from '@/components/ui/chart';

export default function AnalyticsPage() {
    const COLORS = [
        'hsl(var(--primary))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))',
        'hsl(var(--muted))',
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed insights and statistics about your marketplace.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Traffic Overview</CardTitle>
                        <CardDescription>
                            Website traffic over the past 30 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    {
                                        date: '2023-01-01',
                                        visitors: 1000,
                                        pageviews: 2200,
                                    },
                                    {
                                        date: '2023-01-05',
                                        visitors: 1200,
                                        pageviews: 2800,
                                    },
                                    {
                                        date: '2023-01-10',
                                        visitors: 1500,
                                        pageviews: 3300,
                                    },
                                    {
                                        date: '2023-01-15',
                                        visitors: 1300,
                                        pageviews: 2900,
                                    },
                                    {
                                        date: '2023-01-20',
                                        visitors: 1800,
                                        pageviews: 4100,
                                    },
                                    {
                                        date: '2023-01-25',
                                        visitors: 2000,
                                        pageviews: 4500,
                                    },
                                    {
                                        date: '2023-01-30',
                                        visitors: 2200,
                                        pageviews: 5000,
                                    },
                                ]}
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
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="pageviews"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary)/0.2)"
                                    name="Page Views"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="hsl(var(--secondary))"
                                    fill="hsl(var(--secondary)/0.2)"
                                    name="Visitors"
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
                                    data={[
                                        { name: 'Direct', value: 400 },
                                        { name: 'Social', value: 300 },
                                        { name: 'Organic', value: 300 },
                                        { name: 'Referral', value: 200 },
                                    ]}
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
                                    {[
                                        { name: 'Direct', value: 400 },
                                        { name: 'Social', value: 300 },
                                        { name: 'Organic', value: 300 },
                                        { name: 'Referral', value: 200 },
                                    ].map((entry, index) => (
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
                            Visitor to customer conversion rate
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { month: 'Jan', rate: 2.4 },
                                    { month: 'Feb', rate: 2.8 },
                                    { month: 'Mar', rate: 3.2 },
                                    { month: 'Apr', rate: 3.6 },
                                    { month: 'May', rate: 4.0 },
                                    { month: 'Jun', rate: 4.5 },
                                    { month: 'Jul', rate: 4.3 },
                                    { month: 'Aug', rate: 4.6 },
                                    { month: 'Sep', rate: 4.8 },
                                    { month: 'Oct', rate: 5.0 },
                                    { month: 'Nov', rate: 5.2 },
                                    { month: 'Dec', rate: 5.5 },
                                ]}
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
                                <YAxis tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    formatter={(value) => [
                                        `${value}%`,
                                        'Conversion Rate',
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="hsl(var(--primary))"
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
                        <CardTitle>User Engagement</CardTitle>
                        <CardDescription>
                            Average time spent on site and pages per session
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    {
                                        month: 'Jan',
                                        timeSpent: 2.5,
                                        pagesPerSession: 3.2,
                                    },
                                    {
                                        month: 'Feb',
                                        timeSpent: 2.8,
                                        pagesPerSession: 3.5,
                                    },
                                    {
                                        month: 'Mar',
                                        timeSpent: 3.1,
                                        pagesPerSession: 3.8,
                                    },
                                    {
                                        month: 'Apr',
                                        timeSpent: 3.4,
                                        pagesPerSession: 4.0,
                                    },
                                    {
                                        month: 'May',
                                        timeSpent: 3.6,
                                        pagesPerSession: 4.2,
                                    },
                                    {
                                        month: 'Jun',
                                        timeSpent: 3.9,
                                        pagesPerSession: 4.5,
                                    },
                                ]}
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
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="timeSpent"
                                    stroke="hsl(var(--primary))"
                                    name="Avg. Time (min)"
                                    strokeWidth={2}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="pagesPerSession"
                                    stroke="hsl(var(--secondary))"
                                    name="Pages/Session"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
