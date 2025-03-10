'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Star,
    Check,
    ExternalLink,
    ShoppingCart,
    Heart,
    MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Product } from '@/types/types';
import { useGetCookies } from '@/hooks/useGetCookies';
import axios from 'axios';

interface LicenseOption {
    duration: string;
    price: number;
}

// Hardcoded license options
const hardcodedLicenseOptions: LicenseOption[] = [
    { duration: '1 Month', price: 9.99 },
    { duration: '6 Months', price: 49.99 },
    { duration: '1 Year', price: 89.99 },
];

export default function ProductDetails({ product }: { product: Product }) {
    const [isInCart, setIsInCart] = useState(product?.isInCart);
    const [isInWishlist, setIsInWishlist] = useState(product?.isWishlisted);

    const { access_token, refresh_token } = useGetCookies();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [selectedLicense, setSelectedLicense] = useState<string>(
        hardcodedLicenseOptions[0].duration
    );
    const websiteUrl = product?.seller.websiteLink.startsWith('http')
        ? product?.seller.websiteLink
        : `https://${product?.seller.websiteLink}`;

    const handleAddToCart = async () => {
        try {
            const response = await axios.post<{ success: boolean }>(
                `${backendUrl}/cart`,
                {
                    softwareId: product.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'X-Refresh-Token': refresh_token || '',
                    },
                }
            );
            setIsInCart(response.data.success);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleToggleWishlist = async () => {
        setIsInWishlist((prev) => !prev);
        const response = await axios.post<{ toggled: boolean }>(
            `${backendUrl}/wishlist/toggle/${product.id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'X-Refresh-Token': refresh_token || '',
                },
            }
        );
        setIsInWishlist(response.data.toggled);
    };

    const selectedPrice =
        hardcodedLicenseOptions.find(
            (option) => option.duration === selectedLicense
        )?.price || product.price;

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                            <Image
                                src={product.filePath || '/placeholder.svg'}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                                className="transition-all duration-300 hover:scale-105"
                            />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>License Options</CardTitle>
                                <CardDescription>
                                    Choose the licensing period that suits your
                                    needs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedLicense}
                                    onValueChange={setSelectedLicense}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {hardcodedLicenseOptions.map((option) => (
                                        <div key={option.duration}>
                                            <RadioGroupItem
                                                value={option.duration}
                                                id={option.duration}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.duration}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="mb-3">
                                                    {option.duration}
                                                </span>
                                                <span className="text-sm font-bold">
                                                    ${option.price.toFixed(2)}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i <
                                                Math.round(
                                                    product.averageRating
                                                )
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({product.reviews.length} reviews)
                                </span>
                                <Badge variant="secondary">
                                    {product.category.name}
                                </Badge>
                            </div>
                            <p className="text-3xl font-semibold mb-4">
                                ${selectedPrice.toFixed(2)}
                            </p>
                        </div>
                        <p className="text-gray-600">{product.description}</p>
                        <div className="flex items-center space-x-4">
                            <Button
                                className="flex-1"
                                onClick={handleAddToCart}
                                disabled={isInCart}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {isInCart ? 'In Cart' : 'Add to Cart'}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleToggleWishlist}
                                className={isInWishlist ? 'bg-red-100' : ''}
                            >
                                <Heart
                                    className={`h-4 w-4 ${
                                        isInWishlist
                                            ? 'fill-red-500 text-red-500'
                                            : ''
                                    }`}
                                />
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                    {product.seller.user.profile.firstName[0]}
                                    {product.seller.user.profile.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">
                                    {product.seller.user.username}
                                </p>
                                <div className="flex items-center space-x-2">
                                    {product.seller.verified && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-800"
                                        >
                                            <Check className="mr-1 h-3 w-3" />{' '}
                                            Verified
                                        </Badge>
                                    )}
                                    {product.seller.websiteLink && (
                                        <a
                                            href={websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center"
                                        >
                                            Visit Website{' '}
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                window.open(
                                    `https://wa.me/${product.seller.user.profile.phone}`,
                                    '_blank'
                                )
                            }
                        >
                            <MessageCircle className="mr-2 h-4 w-4" /> Contact
                            Seller
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="features" className="mt-12">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="requirements">
                            Requirements
                        </TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="features">
                        <Card>
                            <CardHeader>
                                <CardTitle>Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/*
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="requirements">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/*
                <ul className="space-y-2">
                  {product.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                                <CardDescription>
                                    Average Rating:{' '}
                                    {product.averageRating.toFixed(1)} out of 5
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {product.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="mb-6 last:mb-0"
                                    >
                                        <div className="flex items-center mb-2">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarFallback>
                                                    {review.user.username[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">
                                                    {review.user.username}
                                                </p>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i <
                                                                    review.rating
                                                                        ? 'text-yellow-400 fill-current'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 ml-13">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </TooltipProvider>
    );
}
