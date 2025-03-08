import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Users,
    Package,
    Settings,
    HelpCircle,
} from 'lucide-react';

export const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
];

export const utilityItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Help & Support', href: '/dashboard/support', icon: HelpCircle },
];
