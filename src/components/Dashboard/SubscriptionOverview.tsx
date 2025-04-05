import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface SubscriptionStats {
    ACTIVE: number;
    CANCELED: number;
    EXPIRED: number;
    PAUSED: number;
}

interface SubscriptionOverviewProps {
    data: SubscriptionStats | undefined;
}

export function SubscriptionOverview({ data }: SubscriptionOverviewProps) {
    if (!data) {
        return (
            <p className="text-sm text-muted-foreground">
                No subscription data available
            </p>
        );
    }

    const chartData = [
        { name: 'Active', value: data.ACTIVE, color: '#10b981' },
        { name: 'Canceled', value: data.CANCELED, color: '#f43f5e' },
        { name: 'Expired', value: data.EXPIRED, color: '#d1d5db' },
        { name: 'Paused', value: data.PAUSED, color: '#f59e0b' },
    ];

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => [`${value} subscriptions`, '']}
                        labelFormatter={(label) => `Status: ${label}`}
                    />
                    <Bar dataKey="value">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
