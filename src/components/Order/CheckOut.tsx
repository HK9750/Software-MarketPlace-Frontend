'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CreditCard,
    Check,
    ShieldCheck,
    ArrowRight,
    PlayIcon,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    });
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const router = useRouter();
    const {
        access_token,
        refresh_token,
        loading: contextLoading,
    } = useRootContext();

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                if (!contextLoading && access_token) {
                    const response: any = await axios.get(
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
                toast.error(
                    'Failed to fetch cart items. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [contextLoading, access_token, refresh_token]);

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.subscription.price,
            0
        );
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'billing') {
            setBillingInfo((prev) => ({ ...prev, [name]: value }));
        } else if (type === 'card') {
            setCardInfo((prev) => ({ ...prev, [name]: value }));
        }
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

        if (paymentMethod === 'credit_card') {
            const requiredCard = [
                'cardNumber',
                'cardName',
                'expiryDate',
                'cvv',
            ];
            for (const field of requiredCard) {
                if (!cardInfo[field]) {
                    toast.error('Please fill in all required card fields');
                    return false;
                }
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
            setOrderId(response.data.order.id);
            setOrderComplete(true);

            // Clear cart after successful order
            await axios.delete(`${backendUrl}/cart`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'X-Refresh-Token': refresh_token || '',
                },
            });

            toast.success('Order placed successfully!');
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

    if (cartItems.length === 0 && !orderComplete) {
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

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-muted/30 py-16">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                    <Card className="border shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center justify-center py-20 px-6">
                                <div className="bg-green-100 p-6 rounded-full mb-8">
                                    <Check className="h-16 w-16 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-center">
                                    Order Confirmed!
                                </h2>
                                <p className="text-muted-foreground mb-3 max-w-md text-center text-lg">
                                    Thank you for your purchase. Your order has
                                    been successfully processed.
                                </p>
                                <p className="text-primary font-medium text-lg mb-10">
                                    Order ID: {orderId}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md justify-center">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="px-6"
                                        onClick={() =>
                                            router.push('/marketplace')
                                        }
                                    >
                                        Continue Shopping
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="px-6"
                                        onClick={() =>
                                            router.push('/dashboard/licenses')
                                        }
                                    >
                                        View My Licenses{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
                                            className="h-11"
                                            required
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                            onChange={(e) =>
                                                handleInputChange(e, 'billing')
                                            }
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
                                    Select your preferred payment method
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 py-6">
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-2 border p-4 rounded-md bg-background hover:bg-accent/5 transition-colors">
                                        <RadioGroupItem
                                            value="credit_card"
                                            id="credit_card"
                                        />
                                        <Label
                                            htmlFor="credit_card"
                                            className="flex items-center cursor-pointer w-full"
                                        >
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Credit/Debit Card
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2 border p-4 rounded-md bg-background hover:bg-accent/5 transition-colors opacity-50">
                                        <RadioGroupItem
                                            value="payfast"
                                            id="payfast"
                                            disabled
                                        />
                                        <Label
                                            htmlFor="payfast"
                                            className="flex items-center cursor-not-allowed w-full"
                                        >
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            PayFast (Coming Soon)
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {paymentMethod === 'credit_card' && (
                                    <div className="mt-8 space-y-6">
                                        <div>
                                            <Label
                                                htmlFor="cardNumber"
                                                className="text-sm font-medium mb-1.5 block"
                                            >
                                                Card Number
                                            </Label>
                                            <Input
                                                id="cardNumber"
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardInfo.cardNumber}
                                                onChange={(e) =>
                                                    handleInputChange(e, 'card')
                                                }
                                                className="h-11"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="cardName"
                                                className="text-sm font-medium mb-1.5 block"
                                            >
                                                Cardholder Name
                                            </Label>
                                            <Input
                                                id="cardName"
                                                name="cardName"
                                                placeholder="John Doe"
                                                value={cardInfo.cardName}
                                                onChange={(e) =>
                                                    handleInputChange(e, 'card')
                                                }
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <Label
                                                    htmlFor="expiryDate"
                                                    className="text-sm font-medium mb-1.5 block"
                                                >
                                                    Expiry Date
                                                </Label>
                                                <Input
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={cardInfo.expiryDate}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            'card'
                                                        )
                                                    }
                                                    className="h-11"
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="cvv"
                                                    className="text-sm font-medium mb-1.5 block"
                                                >
                                                    CVV
                                                </Label>
                                                <Input
                                                    id="cvv"
                                                    name="cvv"
                                                    placeholder="123"
                                                    value={cardInfo.cvv}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            'card'
                                                        )
                                                    }
                                                    className="h-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 mt-6">
                                            <ShieldCheck className="h-5 w-5 mr-2 flex-shrink-0" />
                                            <span>
                                                Your payment information is
                                                encrypted and secure
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Complete Purchase
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
