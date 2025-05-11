/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Star,
    Check,
    ExternalLink,
    ShoppingCart,
    Heart,
    MessageCircle,
    Send,
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
    CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ProductDetail } from '@/types/types';
import axios from 'axios';
import Loader from '../Loader';
import useAccessToken from '@/lib/accessToken';
import { fetchUserProfile } from '@/hooks/useFetchProfile';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux-store/authSlice';
import { toast } from 'sonner';

export default function ProductDetails({
    product,
}: {
    product: ProductDetail;
}) {
    const [isInCart, setIsInCart] = useState(product?.isInCart);
    const [isInWishlist, setIsInWishlist] = useState(product?.isWishlisted);
    const [isInCartLoading, setIsInCartLoading] = useState(false);
    const [reviews, setReviews] = useState(product?.reviews || []);
    const [averageRating, setAverageRating] = useState(
        product?.averageRating || 0
    );

    // Review state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [activeTab, setActiveTab] = useState('features');

    const user = useSelector((state: any) => state.auth.userData);

    const access_token = useAccessToken();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const subscriptionOptions = product?.subscriptions || [];
    const [selectedsubscription, setselectedsubscription] = useState<string>(
        subscriptionOptions[0]?.id || ''
    );

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const option = subscriptionOptions.find(
            (option) => option.id === selectedsubscription
        );
        setSelectedOption(option);
        setSelectedPrice(option ? option.price : 0);
    }, [selectedsubscription]);

    useEffect(() => {
        // Check if the current user has already reviewed this product
        if (user && reviews.length > 0) {
            const hasReviewed = reviews.some(
                (review) => review.user.id === user.id
            );
            setUserHasReviewed(hasReviewed);
        }
    }, [user, reviews]);

    const websiteUrl = product?.seller.websiteLink.startsWith('http')
        ? product?.seller.websiteLink
        : `https://${product?.seller.websiteLink}`;

    const handleAddToCart = async () => {
        try {
            setIsInCartLoading(true);
            const response = await axios.post<{ success: boolean }>(
                `${backendUrl}/cart`,
                {
                    subscriptionId: selectedsubscription,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setIsInCart(response.data.success);
            fetchUserProfile(access_token).then((res: any) => {
                console.log(res);
                dispatch(login(res.user));
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsInCartLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        setReviewError('');
        setReviewSuccess('');

        if (!rating || !comment.trim()) {
            setReviewError('Please provide both rating and comment');
            return;
        }

        try {
            setIsSubmittingReview(true);
            const response: any = await axios.post(
                `${backendUrl}/reviews`,
                {
                    rating,
                    comment,
                    softwareId: product.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            if (response.data.status !== 201) {
                toast.error(response.data.message);
                setComment('');
                return;
            }

            // Add the new review to the reviews array
            const newReview = response.data.data;
            setReviews((prev) => [...prev, newReview]);

            // Update average rating
            setAverageRating(
                response.data.data.software?.averageRating || averageRating
            );

            setComment('');
            setRating(5);
            setReviewSuccess('Review added successfully!');
            setUserHasReviewed(true);

            // Switch to reviews tab to show the new review
            setActiveTab('reviews');
        } catch (error: any) {
            console.error('Error adding review:', error);
            setReviewError(
                error.response?.data?.message || 'Failed to submit review'
            );
        } finally {
            setIsSubmittingReview(false);
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
                },
            }
        );
        setIsInWishlist(response.data.toggled);
    };

    const renderStarRating = (value: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                            star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
        );
    };

    if (!product) {
        return <Loader />;
    }

    // Dynamically extract features and requirements as key-value pairs
    const featuresEntries = product.features
        ? Object.entries(product.features).filter(([_, value]) => value)
        : [];

    const requirementsEntries = product.requirements
        ? Object.entries(product.requirements).filter(([_, value]) => value)
        : [];

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
                                    value={selectedsubscription}
                                    onValueChange={setselectedsubscription}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {subscriptionOptions.map((option) => (
                                        <div key={option.id}>
                                            <RadioGroupItem
                                                value={option.id}
                                                id={option.id}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.id}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <span className="mb-3">
                                                    {option.name}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {option.duration} months
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
                                                i < Math.round(averageRating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({reviews.length} reviews)
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
                                {isInCartLoading
                                    ? 'Adding to Cart...'
                                    : isInCart
                                      ? 'Added to Cart'
                                      : 'Add to Cart'}
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

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mt-12"
                >
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
                                {featuresEntries.length > 0 ? (
                                    <ul className="grid grid-cols-1  gap-4">
                                        {featuresEntries.map(
                                            ([key, value], index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start justify-start"
                                                >
                                                    <Check className="h-8 w-8 text-green-500 mr-2 mt-0.5" />
                                                    <span>
                                                        <span className="font-semibold capitalize">
                                                            {key}:
                                                        </span>{' '}
                                                        {Array.isArray(value)
                                                            ? value.join(', ')
                                                            : String(value)}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No features listed.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="requirements">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {requirementsEntries.length > 0 ? (
                                    <ul className="space-y-2">
                                        {requirementsEntries.map(
                                            ([key, value], index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                                                    <span>
                                                        <span className="font-semibold capitalize">
                                                            {key}:
                                                        </span>{' '}
                                                        {Array.isArray(value)
                                                            ? value.join(', ')
                                                            : String(value)}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">
                                        No requirements listed.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                                <CardDescription>
                                    Average Rating: {averageRating.toFixed(1)}{' '}
                                    out of 5
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="mb-6 last:mb-0"
                                        >
                                            <div className="flex items-center mb-2">
                                                <Avatar className="h-10 w-10 mr-3">
                                                    <AvatarFallback>
                                                        {
                                                            review.user
                                                                .username[0]
                                                        }
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
                                            <Separator className="mt-4" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        No reviews yet. Be the first to leave a
                                        review!
                                    </p>
                                )}
                            </CardContent>

                            {/* Add Review Form Section */}
                            <CardFooter className="flex flex-col items-start pt-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Add Your Review
                                </h3>

                                {userHasReviewed ? (
                                    <Alert>
                                        <AlertDescription>
                                            You have already reviewed this
                                            product.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        {reviewError && (
                                            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                                                <AlertDescription>
                                                    {reviewError}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {reviewSuccess && (
                                            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                                                <AlertDescription>
                                                    {reviewSuccess}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="w-full space-y-4">
                                            <div>
                                                <Label
                                                    htmlFor="rating"
                                                    className="block mb-2"
                                                >
                                                    Rating
                                                </Label>
                                                {renderStarRating(rating)}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="comment"
                                                    className="block mb-2"
                                                >
                                                    Your Review
                                                </Label>
                                                <Textarea
                                                    id="comment"
                                                    placeholder="Share your experience with this product..."
                                                    value={comment}
                                                    onChange={(e) =>
                                                        setComment(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="min-h-32"
                                                />
                                            </div>

                                            <Button
                                                onClick={handleSubmitReview}
                                                disabled={isSubmittingReview}
                                                className="w-full md:w-auto"
                                            >
                                                {isSubmittingReview
                                                    ? 'Submitting...'
                                                    : 'Submit Review'}
                                                <Send className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </TooltipProvider>
    );
}
