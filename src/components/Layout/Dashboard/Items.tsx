import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Users,
    Package,
    Store,
} from 'lucide-react';

export const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Categories', href: '/dashboard/categories', icon: Package },
    {
        name: 'Subscriptions',
        href: '/dashboard/subscriptions',
        icon: ShoppingCart,
    },
];

// Seller navigation items
export const sellerNavigationItems = [
    { name: 'Seller Dashboard', href: '/seller-dashboard', icon: Store },
    { name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { name: 'Products', href: '/seller-dashboard/products', icon: Package },
];
