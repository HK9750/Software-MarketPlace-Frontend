'use client';

import Link from 'next/link';
import { Package, Zap } from 'lucide-react';
import {
    Sidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { UserProfile } from '@/components/Layout/Dashboard/UserProfile';
import {
    navigationItems,
    sellerNavigationItems,
} from '@/components/Layout/Dashboard/Items';

interface DashboardSidebarProps {
    pathname: string;
    type?: 'ADMIN' | 'SELLER';
}

export function DashboardSidebar({ pathname, type }: DashboardSidebarProps) {
    // Determine which navigation items to show based on the type prop
    const navItems =
        type === 'SELLER' ? sellerNavigationItems : navigationItems;

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border">
                <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                        <Package className="h-5 w-5" />
                    </div>
                    <Link href="/" className="flex items-center space-x-2 py-1">
                        <span className="font-bold text-xl tracking-tight">
                            SoftMarket
                        </span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {type === 'SELLER' ? 'Seller Navigation' : 'Navigation'}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                return (
                                    <NavigationItem
                                        key={item.name}
                                        item={item}
                                        isActive={pathname === item.href}
                                    />
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-4">
                <UserProfile />
            </SidebarFooter>
        </Sidebar>
    );
}

function NavigationItem({ item, isActive }) {
    const { name, href, icon: Icon } = item;
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip={name}>
                <Link href={href} className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
