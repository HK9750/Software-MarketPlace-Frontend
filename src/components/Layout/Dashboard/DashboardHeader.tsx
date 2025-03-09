'use client';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionUser } from '@/types/types';

interface DashboardHeaderProps {
    user?: SessionUser;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    const initials = user.profile.firstName[0] + user.profile.lastName[0];
    return (
        <header className="border-b border-border bg-card">
            <div className="flex h-16 items-center px-4 py-3">
                <SidebarTrigger className="mr-2" />
                <SearchBar />
                <NotificationsButton />
                <UserMenu initials={initials} />
            </div>
        </header>
    );
};

function SearchBar() {
    return (
        <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:px-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-background pl-8 focus-visible:ring-primary"
                />
            </div>
        </div>
    );
}

function NotificationsButton() {
    return (
        <Button
            variant="outline"
            size="icon"
            className="relative ml-auto md:ml-0"
        >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
            </span>
        </Button>
    );
}

function UserMenu({ initials }: { initials: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full ml-2"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src="/placeholder.svg?height=32&width=32"
                            alt="User"
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DashboardHeader;
