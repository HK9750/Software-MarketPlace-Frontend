'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRootContext } from '@/lib/contexts/RootContext';
import { LogOut } from 'lucide-react';

export function UserProfile({ onLogout = () => {} }) {
    const { user } = useRootContext();
    let name = 'Anonymous';
    let email = 'Anonymous@gmail.com';

    if (user) {
        name = user.username;
        email = user.email;
    }

    // Compute initials using user.profile.firstName and user.profile.lastName
    const initials =
        user && user.profile
            ? `${user.profile.firstName[0].toUpperCase()}${user.profile.lastName[0].toUpperCase()}`
            : name
                  .split(' ')
                  .map((n) => n[0].toUpperCase())
                  .join('');

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">
                        {email}
                    </span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={onLogout}
                aria-label="Log out"
            >
                <LogOut className="h-5 w-5" />
            </Button>
        </div>
    );
}

export default UserProfile;
