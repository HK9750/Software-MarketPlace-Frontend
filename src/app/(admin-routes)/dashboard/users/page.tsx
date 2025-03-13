/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRootContext } from '@/lib/contexts/RootContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CheckCircle,
    ChevronDown,
    Search,
    Shield,
    ShieldCheck,
    UserIcon,
    MoreHorizontal,
    Mail,
    Edit,
    Trash,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
    verified: boolean;
    avatarUrl?: string;
    sellerProfile: {
        verified: boolean;
    };
    joinedDate: string;
}

const GET_USERS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/users`;
const VERIFY_SELLER_URL = (userId: string) =>
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/seller/${userId}`;

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [verificationLoading, setVerificationLoading] = useState<
        string | null
    >(null);
    const [loading, setLoading] = useState(true);
    const { access_token, refresh_token } = useRootContext();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response: any = await axios.get(GET_USERS_URL, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });
            setUsers(response.data.users);
        } catch {
            toast.error('Failed to fetch users', {
                description: 'Please try again later',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            searchQuery === '' ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === null || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleVerifySeller = async (userId: string) => {
        setVerificationLoading(userId);

        try {
            await axios.post(
                VERIFY_SELLER_URL(userId),
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, verified: true } : user
                )
            );

            toast.success('Seller verified successfully', {
                description:
                    'The seller can now list products on the marketplace',
            });
        } catch {
            toast.error('Failed to verify seller', {
                description: 'Please try again later',
            });
        } finally {
            setVerificationLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    Manage users and seller verification
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                View and manage all users on the platform
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="w-full pl-8"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="ml-auto"
                                    >
                                        {roleFilter
                                            ? `Filter: ${roleFilter}`
                                            : 'Filter'}{' '}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Filter by Role
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setRoleFilter(null)}
                                    >
                                        All Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setRoleFilter('customer')
                                        }
                                    >
                                        <UserIcon className="mr-2 h-4 w-4" />{' '}
                                        Customer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setRoleFilter('seller')}
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />{' '}
                                        Seller
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setRoleFilter('admin')}
                                    >
                                        <Shield className="mr-2 h-4 w-4" />{' '}
                                        Admin
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex justify-center">
                                                <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        {user.avatarUrl ? (
                                                            <AvatarImage
                                                                src={
                                                                    user.avatarUrl
                                                                }
                                                                alt={
                                                                    user.username
                                                                }
                                                            />
                                                        ) : null}
                                                        <AvatarFallback>
                                                            {user.username
                                                                .substring(0, 2)
                                                                .toUpperCase()}
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
                                                    <Badge
                                                        variant="default"
                                                        className="bg-primary"
                                                    >
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
                                                    user.sellerProfile
                                                        .verified ? (
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
                                                                Not Verfied
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
                                                            Not Verfied
                                                        </Badge>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {user.role === 'SELLER' &&
                                                !user.sellerProfile.verified ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleVerifySeller(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            verificationLoading ===
                                                            user.id
                                                        }
                                                    >
                                                        {verificationLoading ===
                                                        user.id ? (
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
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
