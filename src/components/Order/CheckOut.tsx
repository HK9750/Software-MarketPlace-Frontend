'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CreditCard,
    Check,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRootContext } from '@/lib/contexts/RootContext';
import Loader from '../Loader';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
        cellNumber: '',
    });
    const [orderId, setOrderId] = useState(null);

    const router = useRouter();
    const {
        access_token,
        refresh_token,
        loading: contextLoading,
        user,
    } = useRootContext();

    // Fetch cart items
    const fetchCart = async () => {
        try {
            setLoading(true);
            if (!contextLoading && access_token) {
                const response = await axios.get<{ data: any[] }>(
                    `${backendUrl}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'X-Refresh-Token': refresh_token || '',
                        },
                    }
                );
                setCartItems(response.data.data);
                console.log('Cart items:', response.data.data);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            toast.error('Failed to fetch cart items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCart();
    }, [contextLoading, access_token, refresh_token]);

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.subscription.price,
            0
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Basic validation
        const requiredBilling = [
            'firstName',
            'lastName',
            'email',
            'address',
            'city',
            'state',
            'zipCode',
        ];
        for (const field of requiredBilling) {
            if (!billingInfo[field]) {
                toast.error('Please fill in all required billing fields');
                return false;
            }
        }

        return true;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        try {
            setOrderLoading(true);

            // Prepare order items from cart
            const orderItems = cartItems.map((item) => ({
                subscriptionId: item.subscription.id,
                amount: item.subscription.price,
                itemName: item.subscription.software.name,
            }));

            // Submit order
            const response: any = await axios.post(
                `${backendUrl}/orders/create`,
                { orderItems },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'X-Refresh-Token': refresh_token || '',
                    },
                }
            );

            // Handle successful order creation
            const newOrderId = response.data.order.id;
            setOrderId(newOrderId);

            const stripeRes: any = await axios.post('/api/stripe', {
                orderId: newOrderId,
                orderItems,
                userId: user.id,
            });

            // Redirect to Stripe Checkout
            window.location.href = stripeRes.data.url;
        } catch (err) {
            console.error('Error creating order:', err);
            toast.error('Failed to place order. Please try again later.');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-muted/30 py-16">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                    <Card className="border shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center justify-center py-20 px-6">
                                <div className="bg-primary/10 p-6 rounded-full mb-8">
                                    <CreditCard className="h-16 w-16 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-center">
                                    Your cart is empty
                                </h2>
                                <p className="text-muted-foreground mb-10 max-w-md text-center text-lg">
                                    There are no items in your cart to checkout.
                                </p>
                                <Button
                                    size="lg"
                                    className="px-10 py-6 text-lg font-medium"
                                    onClick={() => router.push('/products')}
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
        <div className="min-h-screen bg-muted/30 py-8">
            {/* Header with back button */}
            <div className="container max-w-6xl mx-auto pb-8 px-4 sm:px-6">
                <div className="flex items-center relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-background hover:bg-accent absolute left-0"
                        onClick={() => router.push('/cart')}
                        aria-label="Go back to cart"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold w-full text-center relative">
                        <span className="relative inline-block">
                            Checkout
                            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/70 rounded-full"></span>
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main content */}
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/50 px-6 py-5">
                                <CardTitle className="text-xl flex items-center">
                                    <span className="bg-primary/10 p-2 rounded-full mr-3">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </span>
                                    Billing Information
                                </CardTitle>
                                <CardDescription>
                                    Fill in your billing details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label
                                            htmlFor="firstName"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={billingInfo.firstName}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="lastName"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={billingInfo.lastName}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={billingInfo.email}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label
                                            htmlFor="cellNumber"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Cell/Mobile Number
                                        </Label>
                                        <Input
                                            id="cellNumber"
                                            name="cellNumber"
                                            type="tel"
                                            value={billingInfo.cellNumber}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            placeholder="e.g. 0821234567"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label
                                            htmlFor="address"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Address
                                        </Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={billingInfo.address}
                                            onChange={handleInputChange}
                                            className="min-h-24 resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="city"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            City
                                        </Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={billingInfo.city}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="state"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            State/Province
                                        </Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={billingInfo.state}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="zipCode"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Zip/Postal Code
                                        </Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            value={billingInfo.zipCode}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="country"
                                            className="text-sm font-medium mb-1.5 block"
                                        >
                                            Country
                                        </Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={billingInfo.country}
                                            onChange={handleInputChange}
                                            className="h-11"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/50 px-6 py-5">
                                <CardTitle className="text-xl flex items-center">
                                    <span className="bg-primary/10 p-2 rounded-full mr-3">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </span>
                                    Payment Method
                                </CardTitle>
                                <CardDescription>
                                    Secure payment via Stripe
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="flex items-start">
                                        <ShieldCheck className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-sm text-blue-700 font-medium block mb-1">
                                                Secure Checkout with Stripe
                                            </span>
                                            <p className="text-sm text-blue-700">
                                                You will be redirected to
                                                Stripe's secure payment page to
                                                complete your transaction.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border shadow-md overflow-hidden">
                            <CardHeader className="bg-muted/50 px-6 py-5">
                                <CardTitle className="text-xl">
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-6">
                                <ScrollArea className="h-64 pr-4">
                                    <div className="space-y-5">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between"
                                            >
                                                <div className="pr-4">
                                                    <p className="font-medium text-base">
                                                        {
                                                            item.subscription
                                                                .software.name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {
                                                            item.subscription
                                                                .subscriptionPlan
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                                <span className="font-medium text-base whitespace-nowrap">
                                                    $
                                                    {item.subscription.price.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <Separator className="my-6" />

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal ({cartItems.length} items)
                                        </span>
                                        <span>
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Tax
                                        </span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>
                                        <span className="text-green-600 font-medium">
                                            Free
                                        </span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="flex justify-between mb-2">
                                    <span className="text-lg font-medium">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-primary">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    By completing this purchase, you agree to
                                    our Terms of Service.
                                </p>
                            </CardContent>
                            <CardFooter className="px-6 py-6 pt-0">
                                <Button
                                    size="lg"
                                    className="w-full h-12 text-base font-medium"
                                    onClick={handleSubmitOrder}
                                    disabled={orderLoading}
                                >
                                    {orderLoading ? (
                                        <span className="flex items-center">
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            Proceed to Checkout
                                        </span>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
