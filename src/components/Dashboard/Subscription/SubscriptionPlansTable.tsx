'use client';

import { useState, useCallback, useMemo } from 'react';
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
    Plus,
    Search,
    Trash,
} from 'lucide-react';
import { SubscriptionPlanDialog } from './SubscriptionPlanDialog';
import { DeleteSubscriptionPlanDialog } from './DeleteSubscriptionPlanDialog';

// Subscription plan type
interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isPopular: boolean;
    isActive: boolean;
    subscriberCount: number;
}

// Mock subscription plans
const initialPlans: SubscriptionPlan[] = [
    {
        id: 'plan1',
        name: 'Basic',
        description: 'For individual sellers and small businesses',
        price: 9.99,
        billingCycle: 'monthly',
        features: [
            'List up to 5 products',
            'Basic analytics',
            'Standard support',
        ],
        isPopular: false,
        isActive: true,
        subscriberCount: 120,
    },
    {
        id: 'plan2',
        name: 'Pro',
        description: 'For growing businesses with more needs',
        price: 24.99,
        billingCycle: 'monthly',
        features: [
            'List up to 20 products',
            'Advanced analytics',
            'Priority support',
            'Custom product pages',
        ],
        isPopular: true,
        isActive: true,
        subscriberCount: 85,
    },
    {
        id: 'plan3',
        name: 'Enterprise',
        description: 'For large businesses with extensive needs',
        price: 49.99,
        billingCycle: 'monthly',
        features: [
            'Unlimited products',
            'Premium analytics',
            '24/7 support',
            'Custom product pages',
            'API access',
            'Dedicated account manager',
        ],
        isPopular: false,
        isActive: true,
        subscriberCount: 32,
    },
    {
        id: 'plan4',
        name: 'Yearly Basic',
        description: 'For individual sellers and small businesses',
        price: 99.99,
        billingCycle: 'yearly',
        features: [
            'List up to 5 products',
            'Basic analytics',
            'Standard support',
        ],
        isPopular: false,
        isActive: true,
        subscriberCount: 45,
    },
    {
        id: 'plan5',
        name: 'Legacy Plan',
        description: 'Old plan no longer offered to new customers',
        price: 19.99,
        billingCycle: 'monthly',
        features: [
            'List up to 10 products',
            'Basic analytics',
            'Email support',
        ],
        isPopular: false,
        isActive: false,
        subscriberCount: 28,
    },
];

export function SubscriptionPlansTable() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof SubscriptionPlan>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Dialog states
    const [planDialog, setPlanDialog] = useState<{
        isOpen: boolean;
        plan: SubscriptionPlan | null;
    }>({
        isOpen: false,
        plan: null,
    });

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        planId: string | null;
        planName: string;
    }>({
        isOpen: false,
        planId: null,
        planName: '',
    });

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
    const filteredPlans = useMemo(() => {
        return plans
            .filter((plan) => {
                return (
                    searchQuery === '' ||
                    plan.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    plan.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
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

                if (
                    typeof aValue === 'boolean' &&
                    typeof bValue === 'boolean'
                ) {
                    return sortDirection === 'asc'
                        ? aValue === bValue
                            ? 0
                            : aValue
                              ? -1
                              : 1
                        : aValue === bValue
                          ? 0
                          : aValue
                            ? 1
                            : -1;
                }

                return 0;
            });
    }, [plans, searchQuery, sortField, sortDirection]);

    // Open plan dialog for add/edit
    const openPlanDialog = useCallback(
        (plan: SubscriptionPlan | null = null) => {
            setPlanDialog({
                isOpen: true,
                plan,
            });
        },
        []
    );

    // Open delete confirmation dialog
    const openDeleteDialog = useCallback((planId: string, planName: string) => {
        setDeleteDialog({
            isOpen: true,
            planId,
            planName,
        });
    }, []);

    // Handle plan save
    const handleSavePlan = useCallback((plan: SubscriptionPlan) => {
        setPlans((prevPlans) => {
            if (plan.id) {
                // Update existing plan
                return prevPlans.map((p) => (p.id === plan.id ? plan : p));
            } else {
                // Add new plan
                const newPlan = {
                    ...plan,
                    id: `plan${prevPlans.length + 1}`,
                    subscriberCount: 0,
                };
                return [...prevPlans, newPlan];
            }
        });

        setPlanDialog({
            isOpen: false,
            plan: null,
        });
    }, []);

    // Handle plan deletion
    const handleDeletePlan = useCallback((planId: string) => {
        setPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId));

        setDeleteDialog({
            isOpen: false,
            planId: null,
            planName: '',
        });
    }, []);

    // Toggle plan active status
    const togglePlanStatus = useCallback((planId: string) => {
        setPlans((prevPlans) =>
            prevPlans.map((plan) =>
                plan.id === planId
                    ? { ...plan, isActive: !plan.isActive }
                    : plan
            )
        );
    }, []);

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search plans..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => openPlanDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Plan
                        </Button>
                    </div>

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
                                            onClick={() => handleSort('price')}
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Price
                                            {sortField === 'price' && (
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
                                                handleSort('billingCycle')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Billing
                                            {sortField === 'billingCycle' && (
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
                                                handleSort('isActive')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Status
                                            {sortField === 'isActive' && (
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
                                                handleSort('subscriberCount')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Subscribers
                                            {sortField ===
                                                'subscriberCount' && (
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
                                {filteredPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            No subscription plans found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPlans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span>{plan.name}</span>
                                                        {plan.isPopular && (
                                                            <Badge className="bg-primary text-primary-foreground">
                                                                Popular
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                                        {plan.description}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                ${plan.price.toFixed(2)} /{' '}
                                                {plan.billingCycle === 'monthly'
                                                    ? 'month'
                                                    : 'year'}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {plan.billingCycle}
                                            </TableCell>
                                            <TableCell>
                                                {plan.isActive ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700"
                                                    >
                                                        <Check className="mr-1 h-3 w-3" />
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-red-200 bg-red-50 text-red-700"
                                                    >
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {plan.subscriberCount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            openPlanDialog(plan)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Edit plan
                                                        </span>
                                                    </Button>
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
                                                                onClick={() =>
                                                                    openPlanDialog(
                                                                        plan
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Plan
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    togglePlanStatus(
                                                                        plan.id
                                                                    )
                                                                }
                                                            >
                                                                {plan.isActive ? (
                                                                    <>
                                                                        <Trash className="mr-2 h-4 w-4 text-amber-600" />
                                                                        Deactivate
                                                                        Plan
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Check className="mr-2 h-4 w-4 text-green-600" />
                                                                        Activate
                                                                        Plan
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
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

            <SubscriptionPlanDialog
                isOpen={planDialog.isOpen}
                plan={planDialog.plan}
                onClose={() => setPlanDialog({ isOpen: false, plan: null })}
                onSave={handleSavePlan}
            />

            <DeleteSubscriptionPlanDialog
                isOpen={deleteDialog.isOpen}
                planName={deleteDialog.planName}
                subscriberCount={
                    plans.find((p) => p.id === deleteDialog.planId)
                        ?.subscriberCount || 0
                }
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
