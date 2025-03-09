import DashboardLayout from '@/components/Layout/Dashboard';
import AdminProtected from '@/components/AdminProtected/AdminProtected';

export default function Layout({ children }) {
    return (
        <AdminProtected>
            <DashboardLayout>{children}</DashboardLayout>
        </AdminProtected>
    );
}
