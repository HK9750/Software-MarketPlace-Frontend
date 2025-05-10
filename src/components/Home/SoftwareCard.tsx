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
import { Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

const SoftwareCard: FC<SoftwareCardProps> = ({
    software,
    loading = false,
    className,
}) => {
    if (loading) {
        return (
            <Card
                className={cn(
                    'overflow-hidden rounded-lg border border-gray-200 shadow-sm',
                    className
                )}
            >
                <div className="aspect-[16/9] bg-muted rounded-t-lg animate-pulse" />
                <CardContent className="p-3 space-y-2">
                    <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse" />
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-3 w-3 bg-muted rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="h-3 bg-muted rounded-md w-full animate-pulse" />
                </CardContent>
                <CardFooter className="border-t border-gray-100 p-3 flex justify-between items-center">
                    <div className="h-5 bg-muted rounded-md w-1/4 animate-pulse" />
                    <div className="h-7 bg-muted rounded-md w-1/3 animate-pulse" />
                </CardFooter>
            </Card>
        );
    }

    const price = software.latestPrice ?? software.priceHistory?.[0]?.newPrice;
    const oldPrice = software.priceHistory?.[0]?.oldPrice;
    const displayRating = software.rating ?? 0;
    const discount =
        oldPrice && price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null;

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

    return (
        <Card
            className={cn(
                'group flex flex-col rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
                className
            )}
        >
            <div className="relative">
                {/* Image container with wider aspect ratio */}
                <div className="aspect-[16/9] relative overflow-hidden bg-gray-50">
                    <Image
                        src={
                            software.filePath ||
                            '/placeholder.svg?height=300&width=400' ||
                            '/placeholder.svg'
                        }
                        alt={software.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={false}
                    />

                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Badge positioned for better visibility */}
                <Badge
                    className={cn(
                        'absolute top-2 right-2 font-medium px-2 py-0.5 text-xs rounded-md shadow-sm',
                        badgeVariants[software.type]
                    )}
                    variant="outline"
                >
                    {badgeLabels[software.type]}
                </Badge>

                {/* Discount badge if applicable */}
                {discount && discount > 0 && (
                    <Badge
                        className="absolute top-2 left-2 font-medium px-2 py-0.5 text-xs rounded-md bg-green-100 text-green-800 shadow-sm"
                        variant="outline"
                    >
                        {discount}% OFF
                    </Badge>
                )}
            </div>

            <CardContent className="p-3 space-y-2">
                <CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {software.name}
                </CardTitle>

                {/* Rating stars with improved styling */}
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

                <CardDescription className="text-xs text-gray-600 line-clamp-1">
                    {software.description}
                </CardDescription>
            </CardContent>

            <CardFooter className="p-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                {price != null ? (
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-primary">
                            ${Number(price).toFixed(2)}
                        </span>
                        {oldPrice && oldPrice > price && (
                            <span className="text-xs text-gray-500 line-through">
                                ${oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs font-medium text-primary">
                        Free
                    </span>
                )}

                <Link href={`/products/${software.id}`} className="inline-flex">
                    <Button
                        size="sm"
                        className="gap-1 rounded-md h-7 px-2.5 font-medium text-xs transition-all group-hover:translate-x-0.5"
                    >
                        Details
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default SoftwareCard;
