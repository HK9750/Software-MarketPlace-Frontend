import type { ReactNode } from 'react';
import { SellerSidebar } from '@/components/SellerDashboard/SellerSidebar';
import { SellerHeader } from '@/components/SellerDashboard/SellerHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function SellerLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex min-h-screen flex-col">
                <SellerHeader />
                <div className="flex flex-1">
                    <SellerSidebar />
                    <main className="flex-1 p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
