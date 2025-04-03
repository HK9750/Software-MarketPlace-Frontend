'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpDown,
    Check,
    Edit,
    MoreHorizontal,
    Search,
    Trash,
    Loader2,
} from 'lucide-react';
import { DeleteSubscriptionPlanDialog } from './DeleteSubscriptionPlanDialog';
import { toast } from 'sonner';
import { useRootContext } from '@/lib/contexts/RootContext';
import axios from 'axios';

// Subscription plan type to match backend model
interface SubscriptionPlan {
    id: string;
    name: string;
    duration: number; // In months
    createdAt: string;
    updatedAt: string;
}

const GET_SUBSCRIPTION_PLANS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/plans`;
const DELETE_SUBSCRIPTION_PLAN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/plan`;

export function SubscriptionPlansTable() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof SubscriptionPlan>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const { access_token, refresh_token } = useRootContext();

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        planId: string | null;
        planName: string;
    }>({
        isOpen: false,
        planId: null,
        planName: '',
    });

    // Fetch subscription plans
    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const response: any = await axios.get(GET_SUBSCRIPTION_PLANS_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token,
                },
            });

            setPlans(response.data.data);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            toast.error('Failed to load subscription plans');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Handle sort toggle
    const handleSort = useCallback((field: keyof SubscriptionPlan) => {
        setSortField((currentField) => {
            if (currentField === field) {
                setSortDirection((currentDirection) =>
                    currentDirection === 'asc' ? 'desc' : 'asc'
                );
                return currentField;
            }
            setSortDirection('asc');
            return field;
        });
    }, []);

    // Filter and sort plans
    const filteredPlans = plans
        .filter((plan) => {
            return (
                searchQuery === '' ||
                plan.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            return 0;
        });

    // Open delete confirmation dialog
    const openDeleteDialog = useCallback((planId: string, planName: string) => {
        setDeleteDialog({
            isOpen: true,
            planId,
            planName,
        });
    }, []);

    // Handle plan deletion
    const handleDeletePlan = useCallback(async (planId: string) => {
        try {
            const response = await axios.delete(
                `${DELETE_SUBSCRIPTION_PLAN_URL}/${planId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                }
            );
            if (response.status !== 200) {
                toast.error('Failed to delete subscription plan');
                return;
            }

            setPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId));
            toast.success('Subscription plan deleted successfully');
        } catch (error) {
            console.error('Error deleting subscription plan:', error);
            toast.error('Failed to delete subscription plan');
        } finally {
            setDeleteDialog({
                isOpen: false,
                planId: null,
                planName: '',
            });
        }
    }, []);

    // Format duration to display months/years
    const formatDuration = (months: number) => {
        if (months === 1) return '1 month';
        if (months < 12) return `${months} months`;

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (remainingMonths === 0) {
            return years === 1 ? '1 year' : `${years} years`;
        }

        return years === 1
            ? `1 year, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
            : `${years} years, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    };

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Name
                                            {sortField === 'name' && (
                                                <ArrowUpDown
                                                    className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                handleSort('duration')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Duration
                                            {sortField === 'duration' && (
                                                <ArrowUpDown
                                                    className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                handleSort('createdAt')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Created
                                            {sortField === 'createdAt' && (
                                                <ArrowUpDown
                                                    className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            No subscription plans found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPlans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">
                                                {plan.name}
                                            </TableCell>
                                            <TableCell>
                                                {formatDuration(plan.duration)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    plan.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/dashboard/subscriptions/edit/${plan.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Edit plan
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    More options
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        plan.id,
                                                                        plan.name
                                                                    )
                                                                }
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete Plan
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <DeleteSubscriptionPlanDialog
                isOpen={deleteDialog.isOpen}
                planName={deleteDialog.planName}
                onClose={() =>
                    setDeleteDialog({
                        isOpen: false,
                        planId: null,
                        planName: '',
                    })
                }
                onDelete={() => {
                    if (deleteDialog.planId) {
                        handleDeletePlan(deleteDialog.planId);
                    }
                }}
            />
        </>
    );
}
