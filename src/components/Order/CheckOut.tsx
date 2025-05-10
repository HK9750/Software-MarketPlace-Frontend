/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Loader from '../Loader';
import useAccessToken from '@/lib/accessToken';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating transaction IDs
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe');
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
    const access_token = useAccessToken();
    const user = useSelector((state: any) => state.auth.userData);

    // Fetch cart items
    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{ data: any[] }>(
                `${backendUrl}/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setCartItems(response.data.data);
            console.log('Cart items:', response.data.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
            toast.error('Failed to fetch cart items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [access_token]);

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

    const redirectToPayfast = async (orderId) => {
        try {
            // Construct item details
            const itemNames = cartItems.map(
                (item) => item.subscription.software.name
            );
            const itemName = itemNames.join(', ');
            const itemDescription = `Software license${itemNames.length > 1 ? 's' : ''} - ${itemName}`;
            const totalAmount = calculateTotal().toFixed(2);
            const transactionId = uuidv4();
            const userId = user.id;

            // Construct the PayFast URL with all required parameters
            const payfastUrl = `${process.env.NEXT_PUBLIC_PAYFAST_TESTING_URL}?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&merchant_key=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY}&amount=${totalAmount}&item_name=${encodeURIComponent(itemName)}&item_description=${encodeURIComponent(itemDescription)}&email_confirmation=1&confirmation_address=${encodeURIComponent(billingInfo.email)}&payment_method=cc&return_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?orderId=${orderId}&transactionId=${transactionId}&userId=${userId}&amount=${totalAmount}`)}&cancel_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/cart`)}&notify_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/payfast-callback`)}`;

            // Redirect to PayFast
            window.location.href = payfastUrl;
        } catch (error) {
            console.error('Error redirecting to PayFast:', error);
            toast.error('Failed to process payment. Please try again later.');
        }
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
                    },
                }
            );

            // Handle successful order creation
            const newOrderId = response.data.order.id;
            setOrderId(newOrderId);

            // Process payment based on selected payment method
            if (paymentMethod === 'stripe') {
                // Existing Stripe integration
                const stripeRes: any = await axios.post('/api/stripe', {
                    orderId: newOrderId,
                    orderItems,
                    userId: user.id,
                });

                // Redirect to Stripe Checkout
                window.location.href = stripeRes.data.url;
            } else if (paymentMethod === 'payfast') {
                // New PayFast integration - redirect to PayFast
                await redirectToPayfast(newOrderId);
            }
        } catch (err) {
            console.error('Error creating order:', err);
            toast.error('Failed to place order. Please try again later.');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
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
                                    Choose your preferred payment method
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-6">
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-muted/20 transition-colors cursor-pointer">
                                        <RadioGroupItem
                                            value="stripe"
                                            id="stripe"
                                        />
                                        <Label
                                            htmlFor="stripe"
                                            className="flex items-center cursor-pointer"
                                        >
                                            <svg
                                                viewBox="0 0 60 25"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="60"
                                                height="25"
                                                className="mr-2"
                                            >
                                                <path
                                                    fill="#6772E5"
                                                    d="M59.64 14.28h-8.06c.19 1.16 1.18 1.88 2.55 1.88 1.23 0 2.26-.37 3.12-.95v2.28c-.97.47-2.17.73-3.5.73-3.05 0-5.08-1.89-5.08-4.98 0-2.92 1.98-4.97 4.85-4.97 2.35 0 4.22 1.65 4.22 4.44 0 .52-.04 1.06-.1 1.57zm-8.14-1.97h4.47c-.05-1.1-.95-1.88-2.15-1.88-1.17 0-2.07.77-2.32 1.88zm-9.2 4.55V9.33h2.83v1.29c.66-.89 1.86-1.51 3.08-1.51V12c-.29-.06-.56-.1-.98-.1-1.32 0-2.1.6-2.1 2.24v3.85l-2.83-.13zm-5.47-6.55v6.42h-2.82v-6.42h-1.7V9.33h1.7V6.92h2.82v2.41h1.7v1.91h-1.7zM25.97 11.9c0-1.47 1.14-2.76 2.99-2.76 1.88 0 3.02 1.29 3.02 2.76 0 1.5-1.14 2.8-3.02 2.8-1.85 0-2.99-1.3-2.99-2.8zm2.99 5.36c3.5 0 5.87-2.46 5.87-5.36 0-2.86-2.37-5.33-5.87-5.33-3.46 0-5.84 2.47-5.84 5.33 0 2.9 2.38 5.36 5.84 5.36zm-12.43.42V7.46h2.76v2.12c.97-1.42 2.63-2.41 4.36-2.41 1.83 0 3.18.76 3.8 2.05 1.04-1.29 2.58-2.05 4.32-2.05 2.38 0 4.5 1.39 4.5 4.4v5.75h-2.8v-5.5c0-1.65-1.02-2.57-2.48-2.57-1.59 0-2.65 1.05-2.65 2.55v5.52h-2.8v-5.5c0-1.65-.99-2.57-2.48-2.57-1.56 0-2.63 1.05-2.63 2.55v5.52h-2.8zM5.84 16.3a2.95 2.95 0 0 0 2.9-2.96 2.95 2.95 0 0 0-2.9-2.96A2.95 2.95 0 0 0 2.95 13.34a2.95 2.95 0 0 0 2.89 2.96zm0 2.37c-2.9 0-5.84-2.32-5.84-5.33S2.94 7.99 5.84 7.99c1.7 0 2.99.8 3.83 1.94V7.46h2.8v9.85h-2.8v-1.39a5.13 5.13 0 0 1-3.83 1.75z"
                                                ></path>
                                            </svg>
                                            <span className="font-medium ml-1">
                                                Pay with Stripe
                                            </span>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3 border rounded-md p-4 hover:bg-muted/20 transition-colors cursor-pointer">
                                        <RadioGroupItem
                                            value="payfast"
                                            id="payfast"
                                        />
                                        <Label
                                            htmlFor="payfast"
                                            className="flex items-center cursor-pointer"
                                        >
                                            <svg
                                                viewBox="0 0 512 512"
                                                width="25"
                                                height="25"
                                                className="mr-2"
                                            >
                                                <rect
                                                    width="512"
                                                    height="512"
                                                    rx="15%"
                                                    fill="#2D3E50"
                                                />
                                                <path
                                                    fill="#FFF"
                                                    d="M104 104h88v304h-88zM320 104h88v304h-88z"
                                                />
                                                <path
                                                    fill="#E8562D"
                                                    d="M212 104h88v304h-88z"
                                                />
                                            </svg>
                                            <span className="font-medium ml-1">
                                                Pay with PayFast
                                            </span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="flex items-start">
                                        <ShieldCheck className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-sm text-blue-700 font-medium block mb-1">
                                                Secure Checkout
                                            </span>
                                            <p className="text-sm text-blue-700">
                                                {paymentMethod === 'stripe'
                                                    ? "You will be redirected to Stripe's secure payment page to complete your transaction."
                                                    : "You will be redirected to PayFast's secure payment page to complete your transaction."}
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
                                            {paymentMethod === 'stripe'
                                                ? 'Pay with Stripe'
                                                : 'Pay with PayFast'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
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
