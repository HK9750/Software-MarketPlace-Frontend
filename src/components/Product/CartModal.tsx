'use client';
import { useEffect, useState } from 'react';
import type React from 'react';

import Image from 'next/image';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGetCookies } from '@/hooks/useGetCookies';
import axios from 'axios';
import Loader from '../Loader';
import { useRootContext } from '@/lib/contexts/RootContext';

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

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [fetch, setFetch] = useState<boolean>(false);
    const { access_token, refresh_token, loading, error } = useGetCookies();
    const { refetchUserProfile } = useRootContext();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!isOpen) return;
            try {
                setCartItems([]);
                setCartLoading(true);
                if (!loading && access_token && !error) {
                    const response = await axios.get<{ data: CartItem[] }>(
                        `${backendUrl}/cart`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    console.log(response.data);
                    setCartItems(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
            } finally {
                setCartLoading(false);
            }
        };

        fetchProduct();
    }, [loading, access_token, refresh_token, error, fetch, isOpen]);

    const removeItem = async (itemId: string) => {
        try {
            setCartLoading(true);
            if (!loading && access_token && !error) {
                const response = await axios.delete<{ data: CartItem[] }>(
                    `${backendUrl}/cart/${itemId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                console.log(response.data);
                setFetch((prev) => !prev);
            }
            await refetchUserProfile();
        } catch (err) {
            console.error('Error fetching product:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setCartLoading(true);
            if (!loading && access_token && !error) {
                const response = await axios.delete<{ data: CartItem[] }>(
                    `${backendUrl}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                console.log(response.data);
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Your Cart
                    </DialogTitle>
                    <DialogDescription>
                        {cartItems.length} item(s) in your cart
                    </DialogDescription>
                </DialogHeader>
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold">
                            Your cart is empty
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Add some awesome software to get started!
                        </p>
                    </div>
                ) : cartLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[300px] pr-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start py-4 border-b"
                                >
                                    <div className="h-20 w-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                        <Image
                                            src={
                                                item.subscription.software
                                                    .filePath ||
                                                '/placeholder.svg'
                                            }
                                            alt={
                                                item.subscription.software
                                                    .name || 'Product Image'
                                            }
                                            width={80}
                                            height={80}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-lg">
                                            {item.subscription.software.name}
                                        </h4>
                                        <Badge
                                            variant="secondary"
                                            className="mt-1"
                                        >
                                            {item.subscription.subscriptionPlan.name}
                                        </Badge>
                                        <div className="flex items-center mt-2">
                                            <span className="text-lg font-bold text-primary">
                                                ${item.subscription.price}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeItem(item.subscription.id)
                                        }
                                        className="flex-shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </div>
                            ))}
                        </ScrollArea>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg">
                                Total:
                            </span>
                            <span className="font-bold text-2xl text-primary">
                                ${calculateTotal().toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={clearCart}
                                className="flex-1"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Cart
                            </Button>
                            <Button className="flex-1">Checkout</Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CartModal;
