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
    name: string; // replaced "title" with "name"
    description: string;
    price: number;
    filePath: string; // new property for image file path
    averageRating: number; // replaced "rating" with "averageRating"
    badge?: string;
    // Additional fields from the response (not used in the card)
    features?: string;
    requirements?: string;
    category: {
        id: string;
        name: string;
    };
    seller: {
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
}
