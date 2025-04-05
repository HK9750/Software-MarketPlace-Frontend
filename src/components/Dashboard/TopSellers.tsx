import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import React from 'react';

interface Seller {
    id: string;
    name: string;
    username: string;
    totalSales: number;
    salesPercentage: number;
}

interface TopSellersProps {
    sellers: Seller[];
}

export function TopSellers({ sellers }: TopSellersProps) {
    if (sellers.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No seller data available
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {sellers.map((seller) => (
                <div key={seller.id} className="space-y-2">
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {seller.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {seller.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                @{seller.username}
                            </p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm font-medium">
                                ${seller.totalSales}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {seller.salesPercentage}% of total
                            </p>
                        </div>
                    </div>
                    <Progress
                        value={seller.salesPercentage}
                        className="h-1.5"
                    />
                </div>
            ))}
        </div>
    );
}
