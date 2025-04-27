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
                    'h-full overflow-hidden rounded-xl border shadow-sm',
                    className
                )}
            >
                <div className="h-48 bg-muted rounded-t-xl animate-pulse" />
                <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 w-4 bg-muted rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                    </div>
                </CardContent>
                <CardFooter className="border-t p-5 flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                    <div className="h-9 bg-muted rounded w-1/3 animate-pulse" />
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
        popular: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        trending: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
        bestseller: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    };

    const badgeLabels = {
        popular: 'Popular',
        trending: 'Trending',
        bestseller: 'Best Seller',
    };

    return (
        <Card
            className={cn(
                'group flex flex-col h-full rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
                className
            )}
        >
            <div className="relative">
                {/* Image container with fixed aspect ratio */}
                <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                        src={
                            software.filePath ||
                            '/placeholder.svg?height=300&width=400'
                        }
                        alt={software.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Badge positioned for better visibility */}
                <Badge
                    className={cn(
                        'absolute top-3 right-3 font-medium px-2.5 py-1 text-xs rounded-md shadow-sm',
                        badgeVariants[software.type]
                    )}
                >
                    {badgeLabels[software.type]}
                </Badge>

                {/* Discount badge if applicable */}
                {discount && discount > 0 && (
                    <Badge className="absolute top-3 left-3 font-medium px-2.5 py-1 text-xs rounded-md bg-green-100 text-green-800 shadow-sm">
                        {discount}% OFF
                    </Badge>
                )}
            </div>

            <CardContent className="flex-1 p-5 space-y-3">
                <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {software.name}
                </CardTitle>

                {/* Rating stars with improved styling */}
                <div className="flex items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
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
                    <span className="text-sm font-medium text-muted-foreground ml-2">
                        {displayRating.toFixed(1)}
                    </span>
                </div>

                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    {software.description}
                </CardDescription>
            </CardContent>

            <CardFooter className="p-5 pt-3 border-t flex items-center justify-between">
                {price != null ? (
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">
                            ${Number(price).toFixed(2)}
                        </span>
                        {oldPrice && oldPrice > price && (
                            <span className="text-sm text-muted-foreground line-through">
                                ${oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                        Free
                    </span>
                )}

                <Link href={`/products/${software.id}`} className="inline-flex">
                    <Button
                        size="sm"
                        className="gap-1.5 rounded-md font-medium transition-all group-hover:bg-primary/90"
                    >
                        Details
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default SoftwareCard;
