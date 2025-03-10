export type SessionUser = {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    profile: {
        firstName: string;
        lastName: string;
    };
};

interface Review {
    id: string;
    user: SessionUser;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    filePath: string;
    averageRating: number;
    status: number; // 0 = PENDING, 1 = ACTIVE, 2 = INACTIVE
    features: string[];
    requirements: string[];
    category?: {
        filePath: string;
        averageRating: number;
        badge?: string;
        status?: 'active' | 'inactive' | 'pending'; // Adding status for dashboard functionality
        sales?: number; // Adding sales for dashboard functionality
        dateAdded?: string; // Adding dateAdded for dashboard functionality
        features?: string;
        requirements?: string;
        category: {
            id: string;
            name: string;
        };
        seller: {
            id: string;
            verified: boolean;
            websiteLink: string;
            user: {
                id: string;
                username: string;
                email: string;
                profile: {
                    firstName: string;
                    lastName: string;
                    phone: string;
                };
            };
        };
        isWishlisted: boolean;
        isInCart: boolean;
        reviews: Review[];
        createdAt: string;
        updatedAt: string;
    };
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
