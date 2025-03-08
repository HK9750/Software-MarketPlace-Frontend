'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/Layout/Dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/Layout/Dashboard/DashboardHeader';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration errors by only rendering client components after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background w-full">
                {/* Sidebar with a fixed width */}
                <div className="w-80">
                    <DashboardSidebar pathname={pathname} />
                </div>

                {/* Main content takes up remaining space */}
                <main className="flex-grow flex flex-col w-full">
                    <DashboardHeader />
                    <div className="flex-1 p-4 md:p-6 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
