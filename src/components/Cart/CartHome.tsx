'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Image from 'next/image';
import { X, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import axios from 'axios';
import Loader from '../Loader';
import { useRootContext } from '@/lib/contexts/RootContext';
import { useRouter } from 'next/navigation';

interface CartItem {
    id: string;
    subscription: {
        id: string;
        price: number;
        subscriptionPlan: {
            name: string;
        };
        software: {
            name: string;
            description: string;
            filePath: string;
        };
    };
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [fetch, setFetch] = useState<boolean>(false);
    const { refetchUserProfile, access_token, refresh_token, loading } =
        useRootContext();
    const router = useRouter();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setCartItems([]);
                setCartLoading(true);
                if (!loading && access_token) {
                    const response = await axios.get<{ data: CartItem[] }>(
                        `${backendUrl}/cart`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setCartItems(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
            } finally {
                setCartLoading(false);
            }
        };

        fetchCart();
    }, [loading, access_token, refresh_token, fetch]);

    const removeItem = async (itemId: string) => {
        try {
            setCartLoading(true);
            if (!loading && access_token) {
                await axios.delete<{ data: CartItem[] }>(
                    `${backendUrl}/cart/${itemId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                setFetch((prev) => !prev);
            }
            await refetchUserProfile();
        } catch (err) {
            console.error('Error removing item:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setCartLoading(true);
            if (!loading && access_token) {
                await axios.delete<{ data: CartItem[] }>(`${backendUrl}/cart`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'X-Refresh-Token': refresh_token || '',
                    },
                });
                setFetch((prev) => !prev);
            }
            await refetchUserProfile();
        } catch (err) {
            console.error('Error clearing cart:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.subscription.price,
            0
        );
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header with back button */}
            <div className="container max-w-6xl mx-auto py-4 px-4 md:px-6">
                <div className="flex items-center relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-background hover:bg-accent absolute left-0"
                        onClick={() => router.back()}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold w-full text-center relative">
                        <span className="relative inline-block">
                            Your Cart
                            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/70 rounded-full transform"></span>
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main content */}
            <div className="container max-w-6xl mx-auto py-4 px-4 md:px-6">
                {cartLoading ? (
                    <div className="flex items-center justify-center h-96 bg-background rounded-lg shadow-sm">
                        <Loader />
                    </div>
                ) : cartItems.length === 0 ? (
                    <Card className="border shadow-md">
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="bg-primary/10 p-5 rounded-full mb-6">
                                    <ShoppingCart className="h-14 w-14 text-primary" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                    Your cart is empty
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-md text-center">
                                    Looks like you haven't added any software
                                    subscriptions to your cart yet.
                                </p>
                                <Button
                                    size="lg"
                                    className="px-8"
                                    onClick={() => router.push('/marketplace')}
                                >
                                    Browse Marketplace
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="mb-6 border shadow-md">
                                <CardHeader className="pb-0">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold">
                                            Items ({cartItems.length})
                                        </h2>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearCart}
                                            className="text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear Cart
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <ScrollArea className="h-full max-h-[calc(100vh-350px)]">
                                        <div className="space-y-6">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start p-5 rounded-xl border bg-background hover:bg-accent/5 transition-colors"
                                                >
                                                    <div className="h-28 w-28 rounded-md overflow-hidden mr-6 flex-shrink-0 border bg-muted shadow-sm">
                                                        <Image
                                                            src={
                                                                item
                                                                    .subscription
                                                                    .software
                                                                    .filePath ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={
                                                                item
                                                                    .subscription
                                                                    .software
                                                                    .name ||
                                                                'Product Image'
                                                            }
                                                            width={112}
                                                            height={112}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-lg mb-2">
                                                                    {
                                                                        item
                                                                            .subscription
                                                                            .software
                                                                            .name
                                                                    }
                                                                </h3>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="mb-3 px-3 py-1 text-xs font-medium"
                                                                >
                                                                    {
                                                                        item
                                                                            .subscription
                                                                            .subscriptionPlan
                                                                            .name
                                                                    }
                                                                </Badge>
                                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 max-w-lg">
                                                                    {
                                                                        item
                                                                            .subscription
                                                                            .software
                                                                            .description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col items-end ml-4">
                                                                <span className="text-lg font-bold text-primary">
                                                                    $
                                                                    {item.subscription.price.toFixed(
                                                                        2
                                                                    )}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeItem(
                                                                            item
                                                                                .subscription
                                                                                .id
                                                                        )
                                                                    }
                                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-3"
                                                                >
                                                                    <X className="h-4 w-4 mr-1" />
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 border shadow-md">
                                <CardHeader className="pb-0">
                                    <h2 className="text-xl font-semibold">
                                        Order Summary
                                    </h2>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Subtotal ({cartItems.length}{' '}
                                                items)
                                            </span>
                                            <span>
                                                ${calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Tax
                                            </span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Estimated Shipping
                                            </span>
                                            <span className="text-green-600 font-medium">
                                                Free
                                            </span>
                                        </div>
                                    </div>
                                    <Separator className="my-6" />
                                    <div className="flex justify-between font-medium mb-2">
                                        <span className="text-lg">Total</span>
                                        <span className="text-xl font-bold text-primary">
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Taxes and shipping calculated at
                                        checkout
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button
                                        size="lg"
                                        className="w-full h-12 text-base font-medium"
                                        onClick={() => router.push('/checkout')}
                                    >
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Proceed to Checkout
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
