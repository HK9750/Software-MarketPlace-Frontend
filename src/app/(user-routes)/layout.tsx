import React from 'react';
import UserProtected from '@/components/UserProtected';
import Header from '@/components/Home/Header';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProtected>
            <div>
                <Header />
                {children}
            </div>
        </UserProtected>
    );
}
