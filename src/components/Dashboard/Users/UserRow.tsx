// UserRow.tsx
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import {
    CheckCircle,
    Shield,
    ShieldCheck,
    UserIcon,
    MoreHorizontal,
    Mail,
    Edit,
    Trash,
    AlertCircle,
} from 'lucide-react';

interface UserRowProps {
    user: User;
    verificationLoading: string | null;
    handleVerifySeller: (userId: string) => Promise<void>;
}

export function UserRow({
    user,
    verificationLoading,
    handleVerifySeller,
}: UserRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        {user.avatarUrl ? (
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user.username}
                            />
                        ) : null}
                        <AvatarFallback>
                            {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                </div>
            </TableCell>
            <TableCell>
                {user.role === 'ADMIN' ? (
                    <Badge variant="default" className="bg-primary">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                    </Badge>
                ) : user.role === 'SELLER' ? (
                    <Badge variant="secondary">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Seller
                    </Badge>
                ) : (
                    <Badge variant="outline">
                        <UserIcon className="mr-1 h-3 w-3" />
                        Customer
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {user.role === 'SELLER' ? (
                    user.sellerProfile.verified ? (
                        <div className="flex items-center">
                            <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700"
                            >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Verified
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Badge
                                variant="outline"
                                className="border-amber-200 bg-amber-50 text-amber-700"
                            >
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Not Verified
                            </Badge>
                        </div>
                    )
                ) : (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="border-amber-200 bg-amber-50 text-amber-700"
                        >
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Not Verified
                        </Badge>
                    </div>
                )}
            </TableCell>
            <TableCell className="text-right">
                {user.role === 'SELLER' && !user.sellerProfile.verified ? (
                    <Button
                        size="sm"
                        onClick={() => handleVerifySeller(user.id)}
                        disabled={verificationLoading === user.id}
                    >
                        {verificationLoading === user.id ? (
                            <>
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="mr-1 h-4 w-4" />
                                Verify
                            </>
                        )}
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </TableCell>
        </TableRow>
    );
}
