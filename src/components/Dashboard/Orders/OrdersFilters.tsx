'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/types/types';

interface OrdersFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: OrderStatus | 'ALL';
    setStatusFilter: (status: OrderStatus | 'ALL') => void;
    hasFilters: boolean;
    resetFilters: () => void;
}

export function OrdersFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hasFilters,
    resetFilters,
}: OrdersFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search orders..."
                            className="w-full pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as OrderStatus | 'ALL')
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value={OrderStatus.PENDING}>
                                    Pending
                                </SelectItem>
                                <SelectItem value={OrderStatus.COMPLETED}>
                                    Completed
                                </SelectItem>
                                <SelectItem value={OrderStatus.CANCELLED}>
                                    Cancelled
                                </SelectItem>
                                <SelectItem value={OrderStatus.REFUNDED}>
                                    Refunded
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {hasFilters && (
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="w-full sm:w-auto"
                            >
                                Reset Filters
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
