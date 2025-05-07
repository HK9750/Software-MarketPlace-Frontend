'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Check, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import { useRootContext } from '@/lib/contexts/RootContext';

export default function SuccessPage() {
    const params = useSearchParams();
    const orderId = params.get('orderId');
    const transactionId = params.get('transactionId');
    const userId = params.get('userId');
    const amount = params.get('amount');
    const router = useRouter();
    const { access_token, refresh_token } = useRootContext();
    const [loading, setLoading] = useState(true);

    // useRef guard to prevent double‐execution
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (!orderId) {
            toast.error('Missing order information');
            router.push('/checkout');
            return;
        }
        if (hasProcessed.current) {
            return;
        }
        hasProcessed.current = true; // mark as “done”

        (async () => {
            try {
                // 1) Record payment once
                const paymentResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create`,
                    { orderId, transactionId, userId, amount },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                if (paymentResponse.status !== 201) {
                    throw new Error(
                        'Payment endpoint returned ' + paymentResponse.status
                    );
                }

                // 2) Clear cart once
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );

                toast.success('Payment successful!');
            } catch (err) {
                console.error('Finalize error:', err);
                toast.error('Could not finalize order.');
            } finally {
                setLoading(false);
            }
        })();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-16">
            <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                <Card className="border shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-primary text-primary-foreground p-8 text-center">
                            <div className="mx-auto bg-white text-primary rounded-full h-20 w-20 flex items-center justify-center mb-6">
                                <Check className="h-10 w-10" strokeWidth={3} />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">
                                Payment Successful!
                            </h1>
                            <p className="text-lg opacity-90">
                                Thank you for your purchase. Your licenses are
                                now active.
                            </p>
                            <p className="text-sm mt-3 bg-primary-foreground/20 inline-block py-1 px-3 rounded-full">
                                Order ID: {orderId}
                            </p>
                        </div>

                        <div className="p-8 bg-muted/50 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto"
                                onClick={() =>
                                    router.push('/dashboard/licenses')
                                }
                            >
                                View My Licenses
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                                onClick={() => router.push('/marketplace')}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Need help with your purchase?{' '}
                        <Button
                            variant="link"
                            className="px-1.5"
                            onClick={() => router.push('/support')}
                        >
                            Contact support
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
}
