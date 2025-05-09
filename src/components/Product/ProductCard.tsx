'use client';

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
import { ProductDetail } from '@/types/types';
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
        <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg border border-gray-200">
            <div className="relative h-48">
                <img
                    src={filePath || '/placeholder.svg'}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-30"></div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 shadow-sm hover:bg-white rounded-full h-8 w-8"
                    onClick={toggleWishlist}
                    aria-label={
                        isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                >
                    <Heart
                        className={cn(
                            'h-4 w-4 transition-colors',
                            isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground'
                        )}
                    />
                </Button>
            </div>
            <CardHeader className="flex-grow pb-0">
                <CardTitle className="text-lg font-bold line-clamp-1 mb-2">
                    {name}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 text-gray-600">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center pt-2 pb-4">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">
                        {averageRating || '0.0'}
                    </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-semibold text-gray-500">
                        From
                    </div>
                    <div className="text-lg font-bold text-primary">
                        ${subscriptions[0].price}
                    </div>
                </div>
                <Button size="sm" className="h-9 ml-2 px-4 font-medium">
                    <MoveRight className="h-4 w-4 mr-2" />
                    View
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
