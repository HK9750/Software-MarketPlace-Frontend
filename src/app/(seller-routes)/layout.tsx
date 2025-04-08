import type { ReactNode } from 'react';
import DashboardLayout from '@/components/Layout/Dashboard';
import SellerProtected from '@/components/SellerProtected/SellerProtected';

export default function SellerLayout({ children }: { children: ReactNode }) {
    return (
        <SellerProtected>
            <DashboardLayout type="SELLER">{children}</DashboardLayout>
        </SellerProtected>
    );
}
