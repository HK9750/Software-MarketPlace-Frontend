'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Box,
    CircleDollarSign,
    FileText,
    Home,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
} from '@/components/ui/sidebar';

export function SellerSidebar() {
    const pathname = usePathname();

    const routes = [
        {
            title: 'Dashboard',
            href: '/seller-dashboard',
            icon: Home,
            exact: true,
        },
        {
            title: 'Products',
            href: '/seller-dashboard/products',
            icon: Package,
        },
        {
            title: 'Orders',
            href: '/seller-dashboard/orders',
            icon: ShoppingCart,
        },
        {
            title: 'Customers',
            href: '/seller-dashboard/customers',
            icon: Users,
        },
        {
            title: 'Analytics',
            href: '/seller-dashboard/analytics',
            icon: BarChart3,
        },
        {
            title: 'Invoices',
            href: '/seller-dashboard/invoices',
            icon: FileText,
        },
        {
            title: 'Payouts',
            href: '/seller-dashboard/payouts',
            icon: CircleDollarSign,
        },
    ];

    const isActive = (href: string, exact = false) => {
        if (exact) {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <Sidebar>
                <SidebarHeader className="flex h-14 items-center border-b px-4">
                    <Link
                        href="/dashboard/seller"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Box className="h-6 w-6" />
                        <span>Seller Portal</span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarMenu>
                        {routes.map((route) => (
                            <SidebarMenuItem key={route.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(route.href, route.exact)}
                                    tooltip={route.title}
                                >
                                    <Link href={route.href}>
                                        <route.icon className="h-4 w-4" />
                                        <span>{route.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                    <SidebarSeparator />

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(
                                    '/dashboard/seller/settings'
                                )}
                                tooltip="Settings"
                            >
                                <Link href="/dashboard/seller/settings">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="border-t p-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">SP</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                Seller Profile
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Pro Plan
                            </span>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
}
