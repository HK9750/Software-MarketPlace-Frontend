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
  id: string
  user: SessionUser
  rating: number
  comment: string
  createdAt: string 
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
}
