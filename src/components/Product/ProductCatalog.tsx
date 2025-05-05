/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import type { ProductDetail } from '@/types/types';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, X, Filter } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import Link from 'next/link';
import { useRootContext } from '@/lib/contexts/RootContext';

interface ProductCatalogProps {
    products: ProductDetail[];
    query: string;
    setQuery: (query: string) => void;
}

interface WishlistItem {
    id: string;
    userId: string;
    softwareId: string;
    createdAt: string;
    software: ProductDetail;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function ProductCatalog({
    products,
    query,
    setQuery,
}: ProductCatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { access_token, refresh_token, loading } = useRootContext();

    const fetchWishlist = async () => {
        if (!loading && access_token) {
            try {
                const response: any = await axios.get(
                    `${backendUrl}/wishlist`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                setWishlist(response.data.data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [access_token, refresh_token, loading]);

    const categories = Array.from(
        new Set(products.map((p) => p.category.name))
    );
    const priceRanges = [
        { id: 'under25', label: 'Under $25', min: 0, max: 25 },
        { id: '25to50', label: '$25 - $50', min: 25, max: 50 },
        { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
        { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
        { id: 'over200', label: '$200+', min: 200, max: Infinity },
    ];

    const filteredProducts = products.filter((p) => {
        if (selectedCategory && p.category.name !== selectedCategory)
            return false;
        if (selectedPrice) {
            const min = p.subscriptions[0].price;
            const max = p.subscriptions[p.subscriptions.length - 1].price;

            const range = priceRanges.find((r) => r.id === selectedPrice);
            if (
                range &&
                ((min < range.min && max < range.min) ||
                    (min > range.max && max > range.max))
            )
                return false;
        }
        return true;
    });

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedPrice(null);
        setQuery('');
    };
    const getPriceLabel = () =>
        (selectedPrice &&
            priceRanges.find((r) => r.id === selectedPrice)?.label) ||
        null;
    const openWishlist = () =>
        document.getElementById('wishlist-trigger')?.click();

    return (
        <div>
            {/* Mobile Filters & Wishlist */}
            <div className="flex md:hidden items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <div className="flex gap-2">
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
                                        wishlist.length > 0 &&
                                            'fill-red-500 text-red-500'
                                    )}
                                />{' '}
                                ({wishlist.length})
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-md"
                        >
                            <SheetHeader>
                                <SheetTitle>Your Wishlist</SheetTitle>
                            </SheetHeader>
                            <p className="mx-8">
                                Add Your favourite Softwares to wishlist and not
                                miss exciting price drop notifications!
                            </p>
                            <div className="mt-6 grid gap-4 px-8">
                                {wishlist.length === 0
                                    ? 'Your wishlist is empty.'
                                    : wishlist.map((i) => (
                                          <Link
                                              href={`/products/${i.software.id}`}
                                              key={i.software.id}
                                              className="flex items-center gap-4 border-b pb-4"
                                          >
                                              <img
                                                  src={
                                                      i.software.filePath ||
                                                      '/placeholder.svg'
                                                  }
                                                  alt={i.software.name}
                                                  className="w-16 h-16 object-cover rounded"
                                              />
                                              <div className="flex-1">
                                                  <h4 className="font-medium">
                                                      {i.software.name}
                                                  </h4>
                                                  <p className="text-sm text-muted-foreground">
                                                      From $
                                                      {
                                                          i.software
                                                              .subscriptions[0]
                                                              .price
                                                      }
                                                  </p>
                                              </div>
                                          </Link>
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
                                <Filter className="h-4 w-4" /> Filters
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
                                                selectedPrice === null
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                setSelectedPrice(null);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            All Prices
                                        </Button>
                                        {priceRanges.map((r) => (
                                            <Button
                                                key={r.id}
                                                variant={
                                                    selectedPrice === r.id
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setSelectedPrice(r.id);
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {r.label}
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
                                        {categories.map((cat) => (
                                            <Button
                                                key={cat}
                                                variant={
                                                    selectedCategory === cat
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                {cat}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                {(selectedCategory || selectedPrice) && (
                                    <Button
                                        variant="outline"
                                        className="w-full mt-6"
                                        onClick={() => {
                                            clearFilters();
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
                {/* Desktop Filters */}
                <div className="hidden md:block">
                    <ProductFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedPriceRange={selectedPrice}
                        onPriceRangeChange={setSelectedPrice}
                        wishlistCount={wishlist.length}
                        onWishlistClick={openWishlist}
                    />
                </div>

                <div className="space-y-6">
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
                        {(selectedCategory || selectedPrice || query) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" /> Clear filters
                            </Button>
                        )}
                    </div>

                    {(selectedCategory || selectedPrice) && (
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
                                    </Button>
                                </Badge>
                            )}
                            {selectedPrice && (
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    Price: {getPriceLabel()}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 ml-1 p-0"
                                        onClick={() => setSelectedPrice(null)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                        </div>
                    )}

                    <div
                        className={cn(
                            'grid gap-4 sm:gap-6',
                            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        )}
                    >
                        {filteredProducts.map((p) => (
                            <Link key={p.id} href={`/products/${p.id}`}>
                                <ProductCard
                                    software={p}
                                    onWishlistToggle={fetchWishlist}
                                />
                            </Link>
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
                                onClick={clearFilters}
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
