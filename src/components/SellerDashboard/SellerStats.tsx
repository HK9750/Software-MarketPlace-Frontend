'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer } from '@/components/ui/chart';
import { CreditCard, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export function SellerStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,543.89</div>
                    <p className="text-xs text-muted-foreground">
                        +15.2% from last month
                    </p>
                    <div className="h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { name: 'Jan', value: 500 },
                                    { name: 'Feb', value: 1200 },
                                    { name: 'Mar', value: 900 },
                                    { name: 'Apr', value: 1600 },
                                    { name: 'May', value: 1800 },
                                    { name: 'Jun', value: 2500 },
                                ]}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Sales
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                        +8.1% from last month
                    </p>
                    <div className="h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { name: 'Jan', value: 40 },
                                    { name: 'Feb', value: 65 },
                                    { name: 'Mar', value: 90 },
                                    { name: 'Apr', value: 120 },
                                    { name: 'May', value: 180 },
                                    { name: 'Jun', value: 220 },
                                ]}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                        +2 new this month
                    </p>
                    <div className="h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { name: 'Jan', value: 4 },
                                    { name: 'Feb', value: 6 },
                                    { name: 'Mar', value: 8 },
                                    { name: 'Apr', value: 9 },
                                    { name: 'May', value: 10 },
                                    { name: 'Jun', value: 12 },
                                ]}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Conversion Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">
                        +0.5% from last month
                    </p>
                    <div className="h-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={[
                                    { name: 'Jan', value: 1.8 },
                                    { name: 'Feb', value: 2.2 },
                                    { name: 'Mar', value: 2.5 },
                                    { name: 'Apr', value: 2.7 },
                                    { name: 'May', value: 2.9 },
                                    { name: 'Jun', value: 3.2 },
                                ]}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
