import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import React from 'react';

interface Sale {
    id: string;
    user: {
        name: string;
        email: string;
    };
    amount: number;
    status: string;
    date: string;
    softwareName: string;
}

interface RecentSalesProps {
    sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
    if (sales.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No recent sales data available
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {sales.map((sale) => (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {sale.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {sale.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {sale.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {sale.softwareName}
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm font-medium">${sale.amount}</p>
                        <div
                            className={`text-xs ${
                                sale.status === 'COMPLETED'
                                    ? 'text-green-500'
                                    : sale.status === 'PENDING'
                                      ? 'text-yellow-500'
                                      : 'text-red-500'
                            }`}
                        >
                            {sale.status.toLowerCase()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date(sale.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
