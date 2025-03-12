'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Bell, ChevronDown } from 'lucide-react';
import { useSignOut } from '@/hooks/useSignOut';
import { useRootContext } from '@/lib/contexts/RootContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import CartModal from '../Product/CartModal';
import NotificationPanel from './NotificationPanel';

const Header = () => {
    const { user, loading } = useRootContext();
    const [isOpenCart, setIsOpenCart] = useState(false);
    const router = useRouter();
    const signOut = useSignOut(
        typeof window !== 'undefined' ? window.location.origin : ''
    );

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
    };

    const getUserInitials = () => {
        if (user && user.profile.firstName && user.profile.lastName) {
            return `${user.profile.firstName[0].toUpperCase()}${user.profile.lastName[0].toUpperCase()}`;
        }
        return '';
    };

    const cartCount = user && user.cart ? user.cart.length : 0;
    const unreadCount =
        user &&
        user?.notifications &&
        user?.notifications.filter((n) => !n.isRead).length;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 font-sans shadow-sm">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                {/* Logo Section - Left */}
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center space-x-2 py-1">
                        <Zap className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">
                            SoftMarket
                        </span>
                    </Link>
                </div>

                {/* Navigation Section - Center */}
                <nav className="hidden md:flex justify-center flex-1 mx-4">
                    <div className="flex gap-8">
                        <Link
                            href="/products"
                            className="text-md font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            Products
                        </Link>
                        <Link
                            href="/solutions"
                            className="text-md font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            Solutions
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-md font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/resources"
                            className="text-md font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            Resources
                        </Link>
                    </div>
                </nav>

                <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                    {user && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative hover:bg-muted/80"
                            aria-label="Shopping cart"
                            onClick={() => setIsOpenCart(true)}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                                {!loading && cartCount ? cartCount : 0}
                            </span>
                        </Button>
                    )}

                    {loading ? (
                        <Button
                            variant="outline"
                            disabled
                            className="hidden md:flex h-9 text-sm font-medium px-4"
                        >
                            Sign In
                        </Button>
                    ) : user ? (
                        <>
                            <DropdownMenu
                                open={isNotificationOpen}
                                onOpenChange={setIsNotificationOpen}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative hover:bg-muted/80"
                                        aria-label="Notifications"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-80 p-0"
                                >
                                    <NotificationPanel
                                        notifications={user.notifications}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Shadcn Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 hover:bg-muted/80 h-9 px-2 md:px-3"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                                            {getUserInitials()}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="center"
                                    className="w-56"
                                >
                                    <div className="px-4 py-2 border-b border-border/60">
                                        <p className="text-sm font-medium truncate">
                                            {user.profile.firstName}{' '}
                                            {user.profile.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard"
                                            className="cursor-pointer"
                                        >
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="cursor-pointer"
                                        >
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="cursor-pointer"
                                    >
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => router.push('/sign-in')}
                            className="hidden md:flex h-9 text-sm font-medium px-4 border-border/60"
                        >
                            Sign In
                        </Button>
                    )}
                    <Button className="h-9 text-sm font-medium px-4 ml-1 md:ml-2 bg-primary hover:bg-primary/90">
                        Get Started
                    </Button>
                </div>
            </div>
            <CartModal
                isOpen={isOpenCart}
                onClose={() => setIsOpenCart(false)}
            />
        </header>
    );
};

export default Header;
