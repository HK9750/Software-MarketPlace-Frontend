/* eslint-disable @typescript-eslint/no-explicit-any */
export type SessionUser = {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    profile: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        address: Address | string;
        userId: string;
    };
    sellerProfile?: {
        id: string;
        verified: boolean;
        websiteLink: string;
        userId: string;
    };
    cart: any;
    notifications: Notification[];
};

export type Category = {
    id: string;
    name: string;
    description: string;
};

interface Review {
    id: string;
    user: SessionUser;
    rating: number;
    comment: string;
    createdAt: string;
}



export interface ProductDetail {
    id: string;
    name: string;
    description: string;
    features: Record<string, string>; // Allows dynamic key-value pairs
    requirements: Record<string, string>; // Allows dynamic key-value pairs
    filePath: string;
    category: {
        id: string;
        name: string;
    };
    seller: Seller;
    reviews: Review[];
    averageRating: number;
    subscriptions: Subscription[];
    isWishlisted: boolean;
    isInCart: boolean;
}

interface Subscription {
    id: string;
    name: string;
    price: number;
    duration: string; // e.g., "1 month", "1 year"
    basePrice: number; // The original price before any discounts
}

interface Seller {
    user: User;
    websiteLink: string;
    verified: boolean;
}

interface User {
    username: string;
    profile: UserProfile;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    phone: string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export interface UserType {
    id: string;
    name: string;
    email: string;
}

export interface Software {
    id: string;
    name: string;
    price: number;
    image?: string;
}

export interface LicenseKey {
    id: string;
    key: string;
    orderItemId: string;
    isActive: boolean;
}

export interface OrderItem {
    id: string;
    orderId: string;
    softwareId: string;
    price: number;
    software: Software;
    licenseKeys?: LicenseKey[];
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: string;
    transactionId: string;
    createdAt: Date;
}

export interface UserOrderHistory {
    id: string;
    userId: string;
    orderId: string;
    status: OrderStatus;
    note?: string;
    createdAt: Date;
    user: UserType;
}

export interface Order {
    id: string;
    userId: string;
    softwareId: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
    payment?: Payment;
    user: UserType;
    software: Software;
    history: UserOrderHistory[];
}

export interface Notification {
    id: string;
    type: string;
    userId: string;
    software?: {
        id: string;
        name: string;
    };
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface Address {
    [key: string]: string;
}
