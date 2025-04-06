export interface User {
    id: string;
    username: string;
    email: string;
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
    verified: boolean;
    avatarUrl?: string;
    sellerProfile: {
        verified: boolean;
    };
    joinedDate: string;
}
