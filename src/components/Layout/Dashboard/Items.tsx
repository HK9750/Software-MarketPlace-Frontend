import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Users,
    Package,
} from 'lucide-react';

export const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'users', href: '/dashboard/users', icon: Users },
    { name: 'categories', href: '/dashboard/categories', icon: Package },
    {
        name: 'subscriptions',
        href: '/dashboard/subscriptions',
        icon: ShoppingCart,
    },
];
