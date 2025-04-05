import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

interface UserRoleData {
    CUSTOMER: number;
    SELLER: number;
    ADMIN: number;
}

interface UserActivityProps {
    data: UserRoleData | undefined;
}

export function UserActivity({ data }: UserActivityProps) {
    if (!data) {
        return (
            <p className="text-sm text-muted-foreground">
                No user data available
            </p>
        );
    }

    const chartData = [
        { name: 'Customers', value: data.CUSTOMER, color: '#3b82f6' },
        { name: 'Sellers', value: data.SELLER, color: '#10b981' },
        { name: 'Admins', value: data.ADMIN, color: '#f59e0b' },
    ];

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, '']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
