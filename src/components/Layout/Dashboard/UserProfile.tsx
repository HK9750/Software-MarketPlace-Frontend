'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function UserProfile({
    name = 'John Doe',
    email = 'john@example.com',
    avatarSrc = '/placeholder.svg?height=36&width=36',
    onLogout = () => {},
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarSrc} alt={name} />
                    <AvatarFallback>
                        {name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </AvatarFallback>
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
