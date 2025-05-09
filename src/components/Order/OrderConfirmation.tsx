/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Loader from '../Loader';
import useAccessToken from '@/lib/accessToken';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OrderConfirmationPage({ params }) {
    const { orderId } = params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const access_token = useAccessToken();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                if (access_token && orderId) {
                    const response: any = await axios.get(
                        `${backendUrl}/orders/${orderId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    );
                    setOrder(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                toast.error(
                    'Failed to fetch order details. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [access_token, orderId, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container max-w-4xl mx-auto py-12 px-4">
                    <Card className="border shadow-md">
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="bg-primary/10 p-5 rounded-full mb-6">
                                    <FileText className="h-14 w-14 text-primary" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                    Order Not Found
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-md text-center">
                                    We couldn&apos;t find the order details
                                    you&apos;re looking for.
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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container max-w-4xl mx-auto py-12 px-4">
                <Card className="border shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-green-100 p-5 rounded-full mb-6">
                                <Check className="h-14 w-14 text-green-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
                                Order Confirmed!
                            </h2>
                            <p className="text-muted-foreground mb-2 max-w-md text-center">
                                Thank you for your purchase. Your order has been
                                successfully processed.
                            </p>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-6 mb-6">
                            <div className="flex justify-between mb-4">
                                <span className="font-medium">Order ID:</span>
                                <span className="text-primary">{order.id}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="font-medium">Date:</span>
                                <span>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="font-medium">Status:</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Payment Amount:
                                </span>
                                <span className="font-bold">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4">
                            Order Items:
                        </h3>
                        <div className="space-y-4 mb-6">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between p-4 bg-background border rounded-lg"
                                >
                                    <div>
                                        <span className="font-medium">
                                            Subscription ID:{' '}
                                            {item.subscriptionId}
                                        </span>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Status: {item.status}
                                        </p>
                                    </div>
                                    <span className="font-medium">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="flex justify-between mb-2">
                            <span className="text-lg font-medium">Total:</span>
                            <span className="text-xl font-bold text-primary">
                                ${order.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.push('/marketplace')}
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => router.push('/dashboard/licenses')}
                        >
                            View My Licenses{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
