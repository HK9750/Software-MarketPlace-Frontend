'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface ProductFiltersProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    selectedPriceRange: string | null;
    onPriceRangeChange: (range: string | null) => void;
    wishlistCount: number;
    onWishlistClick: () => void;
}

export default function ProductFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    selectedPriceRange,
    onPriceRangeChange,
    wishlistCount,
    onWishlistClick,
}: ProductFiltersProps) {
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

    return (
        <Card className="h-fit sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-between mb-4"
                    onClick={onWishlistClick}
                >
                    <span>Wishlist</span>
                    <div className="flex items-center gap-1">
                        <Heart
                            className={cn(
                                'h-4 w-4',
                                wishlistCount > 0
                                    ? 'fill-red-500 text-red-500'
                                    : ''
                            )}
                        />
                        <span>({wishlistCount})</span>
                    </div>
                </Button>

                <Accordion
                    type="multiple"
                    defaultValue={['price', 'category']}
                    className="space-y-2"
                >
                    <AccordionItem value="price" className="border-b-0">
                        <AccordionTrigger className="py-2 hover:no-underline">
                            <span className="text-sm font-medium">
                                Price Range
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            <div className="space-y-1">
                                <Button
                                    variant={
                                        selectedPriceRange === null
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    className="w-full justify-start h-8 text-xs"
                                    onClick={() => onPriceRangeChange(null)}
                                >
                                    All Prices
                                </Button>
                                {priceRanges.map((range) => (
                                    <Button
                                        key={range.id}
                                        variant={
                                            selectedPriceRange === range.id
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={cn(
                                            'w-full justify-start h-8 text-xs',
                                            selectedPriceRange === range.id &&
                                                'font-medium'
                                        )}
                                        onClick={() =>
                                            onPriceRangeChange(range.id)
                                        }
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="category" className="border-b-0">
                        <AccordionTrigger className="py-2 hover:no-underline">
                            <span className="text-sm font-medium">
                                Categories
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-3">
                            <div className="space-y-1">
                                <Button
                                    variant={
                                        selectedCategory === null
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    className="w-full justify-start h-8 text-xs"
                                    onClick={() => onCategoryChange(null)}
                                >
                                    All Categories
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={
                                            selectedCategory === category
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={cn(
                                            'w-full justify-start h-8 text-xs',
                                            selectedCategory === category &&
                                                'font-medium'
                                        )}
                                        onClick={() =>
                                            onCategoryChange(category)
                                        }
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
