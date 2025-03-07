import React from 'react';
import UserProtected from '@/components/UserProtected';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProtected>
            <div>{children}</div>
        </UserProtected>
    );
}
