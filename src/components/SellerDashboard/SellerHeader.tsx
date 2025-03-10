'use client';

import Link from 'next/link';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function SellerHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />

            <div className="relative hidden md:flex">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 rounded-lg bg-background pl-8"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Help</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                3
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                            {
                                title: 'New Order Received',
                                description:
                                    'You received a new order for DesignPro Studio',
                                time: '2 minutes ago',
                            },
                            {
                                title: 'Product Approved',
                                description:
                                    'Your product CodeMaster IDE has been approved',
                                time: '1 hour ago',
                            },
                            {
                                title: 'Payout Processed',
                                description:
                                    'Your payout of $1,245.00 has been processed',
                                time: 'Yesterday',
                            },
                        ].map((notification, index) => (
                            <DropdownMenuItem
                                key={index}
                                className="cursor-pointer"
                            >
                                <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium">
                                        {notification.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {notification.description}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {notification.time}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className="cursor-pointer justify-center text-center"
                        >
                            <Link href="/dashboard/seller/notifications">
                                View all notifications
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">User menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/seller/profile">
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/seller/settings">
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
