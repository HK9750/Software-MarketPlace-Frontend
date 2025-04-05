import { Badge } from '@/components/ui/badge';
import React from 'react';

interface Software {
    id: string;
    name: string;
    seller: {
        user: {
            username: string;
        };
    };
    status: number;
    price: number;
    createdAt: string;
    categoryId: string;
    category?: {
        name: string;
    };
}

interface RecentSoftwareProps {
    software: Software[];
}

export function RecentSoftware({ software }: RecentSoftwareProps) {
    if (software.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No recent software data available
            </p>
        );
    }

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                    >
                        Pending
                    </Badge>
                );
            case 1:
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                    >
                        Active
                    </Badge>
                );
            case 2:
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                    >
                        Inactive
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {software.map((sw) => (
                <div key={sw.id} className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {sw.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            By {sw.seller.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {sw.category?.name || 'Uncategorized'} •{' '}
                            {new Date(sw.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm font-medium">${sw.price}</p>
                        {getStatusBadge(sw.status)}
                    </div>
                </div>
            ))}
        </div>
    );
}
