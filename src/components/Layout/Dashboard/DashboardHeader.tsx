'use client';
import { Bell, User, Settings, LogOut } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
    user?: SessionUser;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    const initials = user.profile.firstName[0] + user.profile.lastName[0];
    return (
        <header className="border-b border-border bg-card">
            <div className="flex h-16 items-center justify-between px-4 py-3">
                <div></div>
                <div className="flex gap-2">
                    <NotificationsButton />
                    <UserMenu initials={initials} />
                </div>
            </div>
        </header>
    );
};

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
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full ml-2"
                >
                    <Avatar className="h-9 w-9">
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
                <DropdownMenuItem onClick={() => router.push('/profile')}>
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
