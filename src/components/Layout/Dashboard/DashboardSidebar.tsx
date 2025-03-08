'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
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
    utilityItems,
} from '@/components/Layout/Dashboard/Items';

export function DashboardSidebar({ pathname }) {
    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border">
                <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                        <Package className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-lg">SoftMarket</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <NavigationItem
                                    key={item.name}
                                    item={item}
                                    isActive={pathname === item.href}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {utilityItems.map((item) => (
                                <NavigationItem
                                    key={item.name}
                                    item={item}
                                    isActive={pathname === item.href}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
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
                <Link href={href}>
                    <Icon className="h-5 w-5" />
                    <span>{name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
