'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/types';
import { useGetCookies } from '@/hooks/useGetCookies';
import axios from 'axios';

interface ProductCardProps {
    software: Product;
    onWishlistToggle: () => void;
}

const ProductCard = ({ software, onWishlistToggle }: ProductCardProps) => {
    const {
        id,
        name,
        description,
        price,
        filePath,
        averageRating,
        isWishlisted: initialWishlist,
    } = software;
    const { access_token, refresh_token } = useGetCookies();
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
                        'X-Refresh-Token': refresh_token || '',
                    },
                }
            );
            setIsWishlisted(response.data.toggled);
            onWishlistToggle();
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative">
                <img
                    src={filePath || '/placeholder.svg'}
                    alt={name}
                    className="w-full aspect-[4/3] object-cover"
                />
                {/* {badge && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        {badge}
                    </Badge>
                )} */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        toggleWishlist(e)
                    }
                    aria-label={
                        isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                >
                    <Heart
                        className={cn(
                            'h-5 w-5 transition-colors',
                            isWishlisted
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground'
                        )}
                    />
                </Button>
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{averageRating}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold">From {price}</span>
                    <Button size="sm">
                        <MoveRight className="h-4 w-4 mr-2" />
                        View
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
