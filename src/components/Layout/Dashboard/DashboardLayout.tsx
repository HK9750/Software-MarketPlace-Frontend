/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/Layout/Dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/Layout/Dashboard/DashboardHeader';
import { useSelector } from 'react-redux';

interface DashboardLayoutProps {
    children: React.ReactNode;
    type?: 'ADMIN' | 'SELLER';
}
export default function DashboardLayout({
    children,
    type = 'ADMIN',
}: DashboardLayoutProps) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const user = useSelector((state: any) => state.auth.userData);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background w-full">
                <div className="w-64">
                    <DashboardSidebar pathname={pathname} type={type} />
                </div>
                <main className="flex-grow flex flex-col w-full">
                    <DashboardHeader user={user} />
                    <div className="flex-1 p-4 md:p-6 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
