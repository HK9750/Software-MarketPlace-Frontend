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

export interface Product {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    vendor: string;
    image: string;
    rating: number;
    badge?: string;
    features?: string[];
}
