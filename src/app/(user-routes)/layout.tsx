'use client';
import React from 'react';
import UserProtected from '@/components/UserProtected';
import Header from '@/components/Home/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
    }) {
    const path = usePathname();
    console.log(path);
    return (
        <UserProtected>
            <div>
                {path !== "/setup-profile" && <Header />}
                {children}
            </div>
        </UserProtected>
    );
}
