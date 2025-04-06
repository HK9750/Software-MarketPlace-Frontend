// UsersPage.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRootContext } from '@/lib/contexts/RootContext';
import { toast } from 'sonner';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/user';
import UserFilters from './UserFilters';
import UsersTable from './UsersTable';
import UsersTableSkeleton from './UsersTableSkeleton';

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
                    user.id === userId
                        ? {
                              ...user,
                              sellerProfile: {
                                  ...user.sellerProfile,
                                  verified: true,
                              },
                          }
                        : user
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
                        <UserFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            roleFilter={roleFilter}
                            setRoleFilter={setRoleFilter}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {loading ? (
                            <UsersTableSkeleton />
                        ) : (
                            <UsersTable
                                users={filteredUsers}
                                verificationLoading={verificationLoading}
                                handleVerifySeller={handleVerifySeller}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
