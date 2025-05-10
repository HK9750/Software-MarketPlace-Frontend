import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Card,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface Software {
    id: string;
    name: string;
    description: string;
    filePath?: string;
    type: 'popular' | 'trending' | 'bestseller';
    rating: number;
    latestPrice?: number | null;
    priceHistory?: { newPrice: number; oldPrice?: number }[];
}

interface SoftwareCardProps {
    software: Software;
    loading?: boolean;
    className?: string;
    onAddToCart?: (softwareId: string) => void;
}

const SoftwareCard: FC<SoftwareCardProps> = ({
    software,
    loading = false,
    className,
    onAddToCart,
}) => {
    if (loading) {
        return (
            <Card
                className={cn(
                    'overflow-hidden rounded-lg border shadow-sm',
                    className
                )}
            >
                <div className="aspect-[16/9] relative">
                    <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-3 w-3 rounded-full"
                            />
                        ))}
                    </div>
                    <Skeleton className="h-3 w-full" />
                </CardContent>
                <CardFooter className="border-t p-3 flex justify-between items-center">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-7 w-1/3" />
                </CardFooter>
            </Card>
        );
    }

    // Price calculation
    const price = software.latestPrice ?? software.priceHistory?.[0]?.newPrice;
    const oldPrice = software.priceHistory?.[0]?.oldPrice;
    const displayRating = software.rating ?? 0;
    const discount =
        oldPrice && price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null;

    // Badge configurations
    const badgeVariants = {
        popular: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        trending: 'bg-rose-100 text-rose-800 hover:bg-rose-100',
        bestseller: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    };

    const badgeLabels = {
        popular: 'Popular',
        trending: 'Trending',
        bestseller: 'Best Seller',
    };

    // Handle click on add to cart button
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(software.id);
        }
    };

    return (
        <Card
            className={cn(
                'group flex flex-col rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
                className
            )}
        >
            <div className="relative">
                {/* Image container */}
                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    <Image
                        src={software.filePath || '/api/placeholder/400/225'}
                        alt={software.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={false}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Type badge */}
                <Badge
                    className={cn(
                        'absolute top-2 right-2 font-medium px-2 py-0.5 text-xs rounded-md shadow-sm',
                        badgeVariants[software.type]
                    )}
                >
                    {badgeLabels[software.type]}
                </Badge>

                {/* Discount badge if applicable */}
                {discount && discount > 0 && (
                    <Badge className="absolute top-2 left-2 font-medium px-2 py-0.5 text-xs rounded-md bg-green-100 text-green-800 shadow-sm">
                        {discount}% OFF
                    </Badge>
                )}
            </div>

            <CardContent className="p-3 space-y-2 flex-grow">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                {software.name}
                            </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{software.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Rating stars */}
                <div className="flex items-center">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={cn(
                                    'fill-current',
                                    i < Math.floor(displayRating)
                                        ? 'text-amber-400'
                                        : i < Math.ceil(displayRating) &&
                                            displayRating % 1 !== 0
                                          ? 'text-amber-400/50'
                                          : 'text-gray-200'
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500 ml-1.5">
                        {displayRating.toFixed(1)}
                    </span>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardDescription className="text-xs text-gray-600 line-clamp-2">
                                {software.description}
                            </CardDescription>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{software.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>

            <CardFooter className="p-3 border-t flex items-center justify-between">
                {/* Price display - Never show "Free" */}
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-primary">
                        ${price ? Number(price).toFixed(2) : '0.00'}
                    </span>
                    {oldPrice && oldPrice > (price || 0) && (
                        <span className="text-xs text-gray-500 line-through">
                            ${oldPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Add to cart button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-md"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>

                    {/* Details button */}
                    <Link href={`/products/${software.id}`}>
                        <Button
                            size="sm"
                            className="gap-1 rounded-md h-7 px-2.5 font-medium text-xs transition-all"
                        >
                            Details
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default SoftwareCard;
