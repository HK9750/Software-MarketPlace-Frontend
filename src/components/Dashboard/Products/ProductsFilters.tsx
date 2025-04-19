'use client';

import { useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
    isLoading?: boolean;
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
    isLoading = false,
}: ProductsFiltersProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Helper function to handle selection changes with null values
    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value === 'all' ? null : value);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value === 'all' ? null : value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search input */}
                <div className="relative flex-grow w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        ref={searchInputRef}
                        type="text"
                        className="pl-9 pr-9"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery('');
                                if (searchInputRef.current) {
                                    searchInputRef.current.focus();
                                }
                            }}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Category filter */}
                {isLoading ? (
                    <Skeleton className="h-10 w-full md:w-48" />
                ) : (
                    <Select
                        value={categoryFilter || 'all'}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-categories" disabled>
                                    No categories available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                )}

                {/* Status filter */}
                <Select
                    value={statusFilter || 'all'}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset filters button */}
                {hasFilters && (
                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="h-10"
                    >
                        Reset Filters
                    </Button>
                )}
            </div>
        </div>
    );
}
