'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types/types';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, X, Filter } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface ProductCatalogProps {
    products: Product[];
}

// Helper function to extract numeric price from price string
const extractNumericPrice = (priceString: string): number => {
    // Extract the first number from the price string
    const match = priceString.match(/\d+(\.\d+)?/);
    return match ? Number.parseFloat(match[0]) : 0;
};

export default function ProductCatalog({ products }: ProductCatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
        null
    );
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Load wishlist from localStorage on component mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    // Save wishlist to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Extract unique categories from products
    const categories = Array.from(
        new Set(products.map((product) => product.category))
    );

    // Define price ranges
    const priceRanges = [
        { id: 'under25', label: 'Under $25', min: 0, max: 25 },
        { id: '25to50', label: '$25 - $50', min: 25, max: 50 },
        { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
        { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
        {
            id: 'over200',
            label: '$200+',
            min: 200,
            max: Number.POSITIVE_INFINITY,
        },
    ];

    // Filter products based on selected category and price range
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
            return false;
        }

        // Price range filter
        if (selectedPriceRange) {
            const numericPrice = extractNumericPrice(product.price);
            const selectedRange = priceRanges.find(
                (range) => range.id === selectedPriceRange
            );

            if (
                selectedRange &&
                (numericPrice < selectedRange.min ||
                    numericPrice > selectedRange.max)
            ) {
                return false;
            }
        }

        return true;
    });

    // Get wishlist products
    const wishlistProducts = products.filter((product) =>
        wishlist.includes(product.id)
    );

    // Add to wishlist
    const addToWishlist = (id: string) => {
        setWishlist((prev) => [...prev, id]);
    };

    // Remove from wishlist
    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((itemId) => itemId !== id));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedPriceRange(null);
    };

    // Get active price range label
    const getActivePriceRangeLabel = () => {
        if (!selectedPriceRange) return null;
        const range = priceRanges.find((r) => r.id === selectedPriceRange);
        return range?.label;
    };

    // Open wishlist sheet
    const openWishlist = () => {
        const wishlistButton = document.getElementById('wishlist-trigger');
        if (wishlistButton) {
            wishlistButton.click();
        }
    };

    // Handler for price range changes in the mobile filter sheet
    const onPriceRangeChange = (rangeId: string | null) => {
        setSelectedPriceRange(rangeId);
        setIsFilterOpen(false);
    };

    return (
        <div>
            {/* Mobile filter button */}
            <div className="flex md:hidden items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <div className="flex gap-2 ">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                id="wishlist-trigger"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <Heart
                                    className={cn(
                                        'h-4 w-4',
                                        wishlist.length > 0
                                            ? 'fill-red-500 text-red-500'
                                            : ''
                                    )}
                                />
                                ({wishlist.length})
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-md"
                        >
                            <SheetHeader>
                                <SheetTitle>Your Wishlist</SheetTitle>
                                <SheetDescription>
                                    {wishlist.length === 0
                                        ? 'Your wishlist is empty.'
                                        : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist.`}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 grid gap-4 px-8">
                                {wishlistProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 border-b pb-4"
                                    >
                                        <img
                                            src={
                                                product.image ||
                                                '/placeholder.svg'
                                            }
                                            alt={product.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {product.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {product.price}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeFromWishlist(product.id)
                                            }
                                            aria-label="Remove from wishlist"
                                        >
                                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                {wishlist.length > 0 && (
                                    <SheetClose asChild>
                                        <Button className="mt-4">
                                            Continue Shopping
                                        </Button>
                                    </SheetClose>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-full sm:max-w-md"
                        >
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2">
                                        Price Range
                                    </h3>
                                    <div className="space-y-1">
                                        <Button
                                            variant={
                                                selectedPriceRange === null
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                onPriceRangeChange(null);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            All Prices
                                        </Button>
                                        {priceRanges.map((range) => (
                                            <Button
                                                key={range.id}
                                                variant={
                                                    selectedPriceRange ===
                                                    range.id
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setSelectedPriceRange(
                                                        range.id
                                                    );
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {range.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">
                                        Categories
                                    </h3>
                                    <div className="space-y-1">
                                        <Button
                                            variant={
                                                selectedCategory === null
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setSelectedCategory(null);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            All Categories
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category}
                                                variant={
                                                    selectedCategory ===
                                                    category
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setSelectedCategory(
                                                        category
                                                    );
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {(selectedCategory || selectedPriceRange) && (
                                    <Button
                                        variant="outline"
                                        className="w-full mt-6"
                                        onClick={() => {
                                            clearAllFilters();
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
                {/* Desktop filters */}
                <div className="hidden md:block">
                    <ProductFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedPriceRange={selectedPriceRange}
                        onPriceRangeChange={setSelectedPriceRange}
                        wishlistCount={wishlist.length}
                        onWishlistClick={openWishlist}
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold hidden md:block">
                                    Products
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {filteredProducts.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">
                                        {products.length}
                                    </span>{' '}
                                    products
                                </p>
                            </div>
                            {(selectedCategory || selectedPriceRange) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear filters
                                </Button>
                            )}
                        </div>

                        {/* Active filters */}
                        {(selectedCategory || selectedPriceRange) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedCategory && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        Category: {selectedCategory}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() =>
                                                setSelectedCategory(null)
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">
                                                Remove category filter
                                            </span>
                                        </Button>
                                    </Badge>
                                )}
                                {selectedPriceRange && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        Price: {getActivePriceRangeLabel()}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() =>
                                                setSelectedPriceRange(null)
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">
                                                Remove price filter
                                            </span>
                                        </Button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            'grid gap-4 sm:gap-6',
                            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        )}
                    >
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                software={product}
                                isInWishlist={wishlist.includes(product.id)}
                                onAddToWishlist={addToWishlist}
                                onRemoveFromWishlist={removeFromWishlist}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium">
                                No products found
                            </h3>
                            <p className="text-muted-foreground mt-2">
                                Try adjusting your filters to find what you are
                                looking for
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={clearAllFilters}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
