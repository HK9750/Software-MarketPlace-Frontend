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

interface ProductsFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoryFilter: string | null;
    setCategoryFilter: (category: string | null) => void;
    statusFilter: string | null;
    setStatusFilter: (status: string | null) => void;
    categories: string[];
    hasFilters: boolean;
    resetFilters: () => void;
}

export function ProductsFilters({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    categories,
    hasFilters,
    resetFilters,
}: ProductsFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                        <Select
                            value={categoryFilter || ''}
                            onValueChange={(value) =>
                                setCategoryFilter(
                                    value === 'all' ? null : value
                                )
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter || ''}
                            onValueChange={(value) =>
                                setStatusFilter(value === 'all' ? null : value)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
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
