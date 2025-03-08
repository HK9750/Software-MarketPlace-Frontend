'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from '@/components/ui/chart';

export function OverviewChart() {
    const data = [
        { name: 'Jan', total: 1500 },
        { name: 'Feb', total: 3500 },
        { name: 'Mar', total: 2500 },
        { name: 'Apr', total: 4500 },
        { name: 'May', total: 3500 },
        { name: 'Jun', total: 4500 },
        { name: 'Jul', total: 5500 },
        { name: 'Aug', total: 6500 },
        { name: 'Sep', total: 5500 },
        { name: 'Oct', total: 7500 },
        { name: 'Nov', total: 8500 },
        { name: 'Dec', total: 9500 },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Month
                            </span>
                            <span className="font-bold text-muted-foreground">
                                {payload[0].payload.name}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Revenue
                            </span>
                            <span className="font-bold">
                                ${payload[0].value}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 25,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={CustomTooltip} />
                            <Bar
                                dataKey="total"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
