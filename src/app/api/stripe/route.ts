// app/api/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { v4 as Uuid } from 'uuid';

export async function POST(request: Request) {
    const { orderId, orderItems, userId } = await request.json();

    if (!orderId || !orderItems?.length) {
        return NextResponse.json(
            { error: 'orderId and orderItems are required' },
            { status: 400 }
        );
    }

    try {
        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        // Build dynamic line_items
        const line_items = orderItems.map((item) => ({
            price_data: {
                currency: 'usd', // or your currency
                unit_amount: Math.round(item.amount * 100),
                product_data: { name: item.itemName },
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?orderId=${orderId}&transactionId=${Uuid()}&userId=${userId}&amount=${totalAmount}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error('Error creating Stripe session:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
