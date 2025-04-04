// types/order.ts
export interface OrderItem {
    id: string;
    orderId: string;
    subscriptionId: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface CreateOrderRequest {
    orderItems: { subscriptionId: string }[];
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    duration: number;
}
