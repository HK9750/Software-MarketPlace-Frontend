'use client';

import type React from 'react';
import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductDetail } from '@/types/types';
import axios from 'axios';
import useAccessToken from '@/lib/accessToken';

interface ProductCardProps {
    software: ProductDetail;
    onWishlistToggle?: () => void;
}

const ProductCard = ({ software, onWishlistToggle }: ProductCardProps) => {
    const {
        id,
        name,
        description,
        subscriptions,
        filePath,
        averageRating,
        isWishlisted: initialWishlist,
    } = software;
    const access_token = useAccessToken();
    const [isWishlisted, setIsWishlisted] = useState(initialWishlist);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const toggleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            setIsWishlisted((prev) => !prev);
            const response = await axios.post<{ toggled: boolean }>(
                `${backendUrl}/wishlist/toggle/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setIsWishlisted(response.data.toggled);
            if (onWishlistToggle) onWishlistToggle();
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 rounded-xl">
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full pt-[56.25%]">
                {' '}
                {/* 16:9 aspect ratio */}
                <img
                    src={filePath || '/placeholder.svg'}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8 shadow-sm"
                    onClick={toggleWishlist}
                    aria-label={
                        isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                >
                    <Heart
                        className={cn(
                            'h-4 w-4',
                            isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                        )}
                    />
                </Button>
            </div>

            {/* Content area with consistent padding */}
            <div className="flex flex-col flex-grow">
                <CardHeader className="px-4 py-3 sm:px-5">
                    <CardTitle className="text-base sm:text-lg font-semibold line-clamp-1 text-gray-800">
                        {name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-2 text-gray-600">
                        {description}
                    </CardDescription>
                </CardHeader>

                {/* Footer with improved layout */}
                <CardFooter className="px-4 sm:px-5 py-3 mt-auto border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-700">
                            {averageRating || '0.0'}
                        </span>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">From</span>
                            <span className="text-sm font-bold text-primary">
                                ${subscriptions[0].price}
                            </span>
                        </div>

                        <Button
                            size="sm"
                            className="h-8 px-3 text-xs font-medium"
                        >
                            <MoveRight className="h-3.5 w-3.5 mr-1.5" />
                            View
                        </Button>
                    </div>
                </CardFooter>
            </div>
        </Card>
    );
};

export default ProductCard;
