'use client';

import { useState } from 'react';
import { format } from 'date-fns';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Eye,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowUpDown,
    Clock,
    RefreshCcw,
    Calendar,
    User,
    Package,
    CreditCard,
    History,
    FileText,
    Download,
} from 'lucide-react';
import { toast } from 'sonner';

// Enum for order status
enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

// Types based on the schema
interface UserType {
    id: string;
    name: string;
    email: string;
}

interface Software {
    id: string;
    name: string;
    price: number;
    image?: string;
}

interface LicenseKey {
    id: string;
    key: string;
    orderItemId: string;
    isActive: boolean;
}

interface OrderItem {
    id: string;
    orderId: string;
    softwareId: string;
    price: number;
    software: Software;
    licenseKeys?: LicenseKey[];
}

interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: string;
    transactionId: string;
    createdAt: Date;
}

interface UserOrderHistory {
    id: string;
    userId: string;
    orderId: string;
    status: OrderStatus;
    note?: string;
    createdAt: Date;
    user: UserType;
}

interface Order {
    id: string;
    userId: string;
    softwareId: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
    payment?: Payment;
    user: UserType;
    software: Software;
    history: UserOrderHistory[];
}

// Mock data for orders
const mockUsers: UserType[] = [
    { id: 'u1', name: 'John Doe', email: 'john@example.com' },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'u3', name: 'Robert Johnson', email: 'robert@example.com' },
    { id: 'u4', name: 'Emily Davis', email: 'emily@example.com' },
    { id: 'u5', name: 'Michael Wilson', email: 'michael@example.com' },
];

const mockSoftware: Software[] = [
    {
        id: 's1',
        name: 'DesignPro Studio',
        price: 49.99,
        image: '/placeholder.svg?height=40&width=40',
    },
    {
        id: 's2',
        name: 'CodeMaster IDE',
        price: 39.99,
        image: '/placeholder.svg?height=40&width=40',
    },
    {
        id: 's3',
        name: 'DataViz Analytics',
        price: 59.99,
        image: '/placeholder.svg?height=40&width=40',
    },
    {
        id: 's4',
        name: 'SecureShield Pro',
        price: 29.99,
        image: '/placeholder.svg?height=40&width=40',
    },
    {
        id: 's5',
        name: 'CloudSync Storage',
        price: 19.99,
        image: '/placeholder.svg?height=40&width=40',
    },
];

// Generate mock orders
const generateMockOrders = (): Order[] => {
    const orders: Order[] = [];

    for (let i = 1; i <= 10; i++) {
        const userId =
            mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
        const softwareId =
            mockSoftware[Math.floor(Math.random() * mockSoftware.length)].id;
        const software = mockSoftware.find((s) => s.id === softwareId)!;
        const user = mockUsers.find((u) => u.id === userId)!;

        // Random date within the last 30 days
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

        const updatedAt = new Date(createdAt);
        updatedAt.setHours(
            updatedAt.getHours() + Math.floor(Math.random() * 48)
        );

        // Random status
        const statuses = Object.values(OrderStatus);
        const status = statuses[
            Math.floor(Math.random() * statuses.length)
        ] as OrderStatus;

        const orderItems: OrderItem[] = [
            {
                id: `oi${i}`,
                orderId: `ord${i}`,
                softwareId,
                price: software.price,
                software,
                licenseKeys:
                    status === OrderStatus.COMPLETED
                        ? [
                              {
                                  id: `lk${i}`,
                                  key: `LICENSE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                                  orderItemId: `oi${i}`,
                                  isActive: true,
                              },
                          ]
                        : [],
            },
        ];

        // Add additional items for some orders
        if (i % 3 === 0) {
            const additionalSoftwareId =
                mockSoftware[
                    (Math.floor(Math.random() * mockSoftware.length) + 1) %
                        mockSoftware.length
                ].id;
            const additionalSoftware = mockSoftware.find(
                (s) => s.id === additionalSoftwareId
            )!;

            orderItems.push({
                id: `oi${i}-2`,
                orderId: `ord${i}`,
                softwareId: additionalSoftwareId,
                price: additionalSoftware.price,
                software: additionalSoftware,
                licenseKeys:
                    status === OrderStatus.COMPLETED
                        ? [
                              {
                                  id: `lk${i}-2`,
                                  key: `LICENSE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                                  orderItemId: `oi${i}-2`,
                                  isActive: true,
                              },
                          ]
                        : [],
            });
        }

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price,
            0
        );

        // Generate payment for non-cancelled orders
        const payment =
            status !== OrderStatus.CANCELLED
                ? {
                      id: `pay${i}`,
                      orderId: `ord${i}`,
                      amount: totalAmount,
                      method: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
                      status:
                          status === OrderStatus.REFUNDED
                              ? 'refunded'
                              : status === OrderStatus.COMPLETED
                                ? 'completed'
                                : 'pending',
                      transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`,
                      createdAt: new Date(createdAt),
                  }
                : undefined;

        // Generate order history
        const history: UserOrderHistory[] = [
            {
                id: `hist${i}-1`,
                userId,
                orderId: `ord${i}`,
                status: OrderStatus.PENDING,
                note: 'Order created',
                createdAt: new Date(createdAt),
                user,
            },
        ];

        // Add status change history based on current status
        if (status !== OrderStatus.PENDING) {
            const statusChangeDate = new Date(createdAt);
            statusChangeDate.setHours(
                statusChangeDate.getHours() + Math.floor(Math.random() * 24)
            );

            history.push({
                id: `hist${i}-2`,
                userId,
                orderId: `ord${i}`,
                status,
                note: `Status changed to ${status}`,
                createdAt: statusChangeDate,
                user,
            });

            // Add refund history if refunded
            if (status === OrderStatus.REFUNDED) {
                const refundDate = new Date(statusChangeDate);
                refundDate.setHours(
                    refundDate.getHours() + Math.floor(Math.random() * 48)
                );

                history.push({
                    id: `hist${i}-3`,
                    userId,
                    orderId: `ord${i}`,
                    status: OrderStatus.REFUNDED,
                    note: 'Refund processed',
                    createdAt: refundDate,
                    user,
                });
            }
        }

        orders.push({
            id: `ord${i}`,
            userId,
            softwareId,
            totalAmount,
            status,
            createdAt,
            updatedAt,
            items: orderItems,
            payment,
            user,
            software,
            history,
        });
    }

    return orders;
};

const initialOrders = generateMockOrders();

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(
        'ALL'
    );
    const [sortField, setSortField] = useState<keyof Order>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [statusChangeLoading, setStatusChangeLoading] = useState<
        string | null
    >(null);

    // State for dialogs and drawers
    const [statusDialog, setStatusDialog] = useState<{
        isOpen: boolean;
        orderId: string | null;
        currentStatus: OrderStatus | null;
        newStatus: OrderStatus | null;
    }>({
        isOpen: false,
        orderId: null,
        currentStatus: null,
        newStatus: null,
    });

    const [historyDrawer, setHistoryDrawer] = useState<{
        isOpen: boolean;
        order: Order | null;
    }>({
        isOpen: false,
        order: null,
    });

    const [detailsDialog, setDetailsDialog] = useState<{
        isOpen: boolean;
        order: Order | null;
    }>({
        isOpen: false,
        order: null,
    });

    // Filter and sort orders
    const filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                searchQuery === '' ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.user.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.user.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.items.some((item) =>
                    item.software.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );

            const matchesStatus =
                statusFilter === 'ALL' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortField === 'createdAt' || sortField === 'updatedAt') {
                const dateA = new Date(a[sortField]).getTime();
                const dateB = new Date(b[sortField]).getTime();
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (sortField === 'totalAmount') {
                return sortDirection === 'asc'
                    ? a.totalAmount - b.totalAmount
                    : b.totalAmount - a.totalAmount;
            }

            // For string fields like status
            const valueA = String(a[sortField]);
            const valueB = String(b[sortField]);
            return sortDirection === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });

    // Handle sort toggle
    const handleSort = (field: keyof Order) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to descending for new sort field
        }
    };

    // Handle status change
    const handleStatusChange = async (
        orderId: string,
        newStatus: OrderStatus
    ) => {
        setStatusDialog({
            isOpen: false,
            orderId: null,
            currentStatus: null,
            newStatus: null,
        });

        setStatusChangeLoading(orderId);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update order status
            setOrders((prevOrders) =>
                prevOrders.map((order) => {
                    if (order.id === orderId) {
                        // Create a new history entry
                        const newHistoryEntry: UserOrderHistory = {
                            id: `hist-${Math.random().toString(36).substring(2, 10)}`,
                            userId: order.userId,
                            orderId: order.id,
                            status: newStatus,
                            note: `Status changed to ${newStatus}`,
                            createdAt: new Date(),
                            user: order.user,
                        };

                        return {
                            ...order,
                            status: newStatus,
                            updatedAt: new Date(),
                            history: [...order.history, newHistoryEntry],
                            // Update payment status if refunded
                            payment:
                                newStatus === OrderStatus.REFUNDED &&
                                order.payment
                                    ? { ...order.payment, status: 'refunded' }
                                    : order.payment,
                        };
                    }
                    return order;
                })
            );

            toast.success('Order status updated', {
                description: `Order status changed to ${newStatus}`,
            });
        } catch (error) {
            toast.error('Failed to update order status', {
                description: 'Please try again later',
            });
        } finally {
            setStatusChangeLoading(null);
        }
    };

    // Open status change dialog
    const openStatusDialog = (order: Order, newStatus: OrderStatus) => {
        setStatusDialog({
            isOpen: true,
            orderId: order.id,
            currentStatus: order.status,
            newStatus,
        });
    };

    // Open history drawer
    const openHistoryDrawer = (order: Order) => {
        setHistoryDrawer({
            isOpen: true,
            order,
        });
    };

    // Open details dialog
    const openDetailsDialog = (order: Order) => {
        setDetailsDialog({
            isOpen: true,
            order,
        });
    };

    // Get status badge
    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return (
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                    >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                    </Badge>
                );
            case OrderStatus.CANCELLED:
                return (
                    <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                        Cancelled
                    </Badge>
                );
            case OrderStatus.REFUNDED:
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-blue-700"
                    >
                        <RefreshCcw className="mr-1 h-3 w-3" />
                        Refunded
                    </Badge>
                );
            case OrderStatus.PENDING:
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('ALL');
        setSortField('createdAt');
        setSortDirection('desc');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    Manage customer orders and their status
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Order Management</CardTitle>
                            <CardDescription>
                                View and manage all customer orders
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search orders..."
                                    className="w-full pl-8"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) =>
                                        setStatusFilter(
                                            value as OrderStatus | 'ALL'
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value={OrderStatus.PENDING}>
                                            Pending
                                        </SelectItem>
                                        <SelectItem
                                            value={OrderStatus.COMPLETED}
                                        >
                                            Completed
                                        </SelectItem>
                                        <SelectItem
                                            value={OrderStatus.CANCELLED}
                                        >
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem
                                            value={OrderStatus.REFUNDED}
                                        >
                                            Refunded
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {(searchQuery ||
                                    statusFilter !== 'ALL' ||
                                    sortField !== 'createdAt' ||
                                    sortDirection !== 'desc') && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full sm:w-auto"
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('id')}
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Order ID
                                                {sortField === 'id' && (
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
                                                    handleSort('userId')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Customer
                                                {sortField === 'userId' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('totalAmount')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Total
                                                {sortField ===
                                                    'totalAmount' && (
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
                                                    handleSort('status')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Status
                                                {sortField === 'status' && (
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
                                                Date
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
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center"
                                            >
                                                No orders found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    {order.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {order.user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {order.user.email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {order.items.map(
                                                            (item, index) => (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .software
                                                                                .image ||
                                                                            '/placeholder.svg'
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .software
                                                                                .name
                                                                        }
                                                                        className="h-6 w-6 rounded-md object-cover"
                                                                    />
                                                                    <span className="text-sm line-clamp-1">
                                                                        {
                                                                            item
                                                                                .software
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    $
                                                    {order.totalAmount.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            order.createdAt
                                                        ),
                                                        'MMM dd, yyyy'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                openDetailsDialog(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                View order
                                                                details
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                openHistoryDrawer(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            <History className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                View order
                                                                history
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
                                                                        More
                                                                        options
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
                                                                        openDetailsDialog(
                                                                            order
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        openHistoryDrawer(
                                                                            order
                                                                        )
                                                                    }
                                                                >
                                                                    <History className="mr-2 h-4 w-4" />
                                                                    View History
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {order.status !==
                                                                    OrderStatus.COMPLETED && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openStatusDialog(
                                                                                order,
                                                                                OrderStatus.COMPLETED
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                        Mark as
                                                                        Completed
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {order.status !==
                                                                    OrderStatus.CANCELLED && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openStatusDialog(
                                                                                order,
                                                                                OrderStatus.CANCELLED
                                                                            )
                                                                        }
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                                        Cancel
                                                                        Order
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {order.status !==
                                                                    OrderStatus.REFUNDED &&
                                                                    order.status !==
                                                                        OrderStatus.CANCELLED && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openStatusDialog(
                                                                                    order,
                                                                                    OrderStatus.REFUNDED
                                                                                )
                                                                            }
                                                                        >
                                                                            <RefreshCcw className="mr-2 h-4 w-4 text-blue-600" />
                                                                            Process
                                                                            Refund
                                                                        </DropdownMenuItem>
                                                                    )}
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
                    </div>
                </CardContent>
            </Card>

            {/* Status Change Dialog */}
            <Dialog
                open={statusDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setStatusDialog({
                            isOpen: false,
                            orderId: null,
                            currentStatus: null,
                            newStatus: null,
                        });
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Order Status</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change this order's status
                            from{' '}
                            <span className="font-medium">
                                {statusDialog.currentStatus}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {statusDialog.newStatus}
                            </span>
                            ?
                            {statusDialog.newStatus ===
                                OrderStatus.REFUNDED && (
                                <div className="mt-2 text-amber-600">
                                    This will process a refund for the customer.
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStatusDialog({
                                    isOpen: false,
                                    orderId: null,
                                    currentStatus: null,
                                    newStatus: null,
                                });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (
                                    statusDialog.orderId &&
                                    statusDialog.newStatus
                                ) {
                                    handleStatusChange(
                                        statusDialog.orderId,
                                        statusDialog.newStatus
                                    );
                                }
                            }}
                            disabled={
                                statusChangeLoading === statusDialog.orderId
                            }
                            variant={
                                statusDialog.newStatus ===
                                    OrderStatus.CANCELLED ||
                                statusDialog.newStatus === OrderStatus.REFUNDED
                                    ? 'destructive'
                                    : 'default'
                            }
                        >
                            {statusChangeLoading === statusDialog.orderId ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                    Updating...
                                </>
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Order History Drawer */}
            <Drawer
                open={historyDrawer.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setHistoryDrawer({
                            isOpen: false,
                            order: null,
                        });
                    }
                }}
            >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Order History</DrawerTitle>
                        <DrawerDescription>
                            {historyDrawer.order && (
                                <>
                                    Order {historyDrawer.order.id} status
                                    history
                                </>
                            )}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-2">
                        {historyDrawer.order && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {historyDrawer.order.user.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Order Total: $
                                        {historyDrawer.order.totalAmount.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>

                                <div className="relative pl-6 border-l border-border">
                                    {historyDrawer.order.history
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    a.createdAt
                                                ).getTime() -
                                                new Date(b.createdAt).getTime()
                                        )
                                        .map((historyItem, index) => (
                                            <div
                                                key={historyItem.id}
                                                className="mb-6 relative"
                                            >
                                                <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center">
                                                    {historyItem.status ===
                                                        OrderStatus.COMPLETED && (
                                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                                    )}
                                                    {historyItem.status ===
                                                        OrderStatus.CANCELLED && (
                                                        <XCircle className="h-3 w-3 text-red-600" />
                                                    )}
                                                    {historyItem.status ===
                                                        OrderStatus.REFUNDED && (
                                                        <RefreshCcw className="h-3 w-3 text-blue-600" />
                                                    )}
                                                    {historyItem.status ===
                                                        OrderStatus.PENDING && (
                                                        <Clock className="h-3 w-3 text-amber-600" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {historyItem.status}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(
                                                                new Date(
                                                                    historyItem.createdAt
                                                                ),
                                                                'MMM dd, yyyy - h:mm a'
                                                            )}
                                                        </span>
                                                    </div>
                                                    {historyItem.note && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {historyItem.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Order Details Dialog */}
            <Dialog
                open={detailsDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailsDialog({
                            isOpen: false,
                            order: null,
                        });
                    }
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            {detailsDialog.order && (
                                <>
                                    Complete information for order{' '}
                                    {detailsDialog.order.id}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsDialog.order && (
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="items">
                                    <Package className="h-4 w-4 mr-2" />
                                    Items
                                </TabsTrigger>
                                <TabsTrigger value="payment">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Payment
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="details"
                                className="space-y-4 pt-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Order Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="font-medium">
                                                Order ID:
                                            </span>
                                            <span>
                                                {detailsDialog.order.id}
                                            </span>

                                            <span className="font-medium">
                                                Status:
                                            </span>
                                            <span>
                                                {getStatusBadge(
                                                    detailsDialog.order.status
                                                )}
                                            </span>

                                            <span className="font-medium">
                                                Date Created:
                                            </span>
                                            <span>
                                                {format(
                                                    new Date(
                                                        detailsDialog.order.createdAt
                                                    ),
                                                    'MMM dd, yyyy - h:mm a'
                                                )}
                                            </span>

                                            <span className="font-medium">
                                                Last Updated:
                                            </span>
                                            <span>
                                                {format(
                                                    new Date(
                                                        detailsDialog.order.updatedAt
                                                    ),
                                                    'MMM dd, yyyy - h:mm a'
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            Customer Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="font-medium">
                                                Name:
                                            </span>
                                            <span>
                                                {detailsDialog.order.user.name}
                                            </span>

                                            <span className="font-medium">
                                                Email:
                                            </span>
                                            <span>
                                                {detailsDialog.order.user.email}
                                            </span>

                                            <span className="font-medium">
                                                User ID:
                                            </span>
                                            <span>
                                                {detailsDialog.order.userId}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                        Order Summary
                                    </h4>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Product
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Price
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {detailsDialog.order.items.map(
                                                    (item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .software
                                                                                .image ||
                                                                            '/placeholder.svg'
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .software
                                                                                .name
                                                                        }
                                                                        className="h-8 w-8 rounded-md object-cover"
                                                                    />
                                                                    <span>
                                                                        {
                                                                            item
                                                                                .software
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                $
                                                                {item.price.toFixed(
                                                                    2
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Total
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        $
                                                        {detailsDialog.order.totalAmount.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="items"
                                className="space-y-4 pt-4"
                            >
                                {detailsDialog.order.items.map((item) => (
                                    <Card key={item.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            item.software
                                                                .image ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={item.software.name}
                                                        className="h-10 w-10 rounded-md object-cover"
                                                    />
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {item.software.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Item ID: {item.id}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-base font-bold">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {item.licenseKeys &&
                                            item.licenseKeys.length > 0 ? (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">
                                                        License Keys
                                                    </h4>
                                                    {item.licenseKeys.map(
                                                        (license) => (
                                                            <div
                                                                key={license.id}
                                                                className="flex items-center justify-between rounded-md border p-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-sm">
                                                                        {
                                                                            license.key
                                                                        }
                                                                    </span>
                                                                    {license.isActive ? (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="border-green-200 bg-green-50 text-green-700"
                                                                        >
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
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Download
                                                                        license
                                                                        key
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    {detailsDialog.order
                                                        .status ===
                                                    OrderStatus.PENDING
                                                        ? 'License keys will be generated when the order is completed.'
                                                        : 'No license keys available for this item.'}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent
                                value="payment"
                                className="space-y-4 pt-4"
                            >
                                {detailsDialog.order.payment ? (
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Payment Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium block">
                                                                Payment ID:
                                                            </span>
                                                            <span>
                                                                {
                                                                    detailsDialog
                                                                        .order
                                                                        .payment
                                                                        .id
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Transaction ID:
                                                            </span>
                                                            <span>
                                                                {
                                                                    detailsDialog
                                                                        .order
                                                                        .payment
                                                                        .transactionId
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Date:
                                                            </span>
                                                            <span>
                                                                {format(
                                                                    new Date(
                                                                        detailsDialog.order.payment.createdAt
                                                                    ),
                                                                    'MMM dd, yyyy - h:mm a'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="font-medium block">
                                                                Amount:
                                                            </span>
                                                            <span className="font-bold">
                                                                $
                                                                {detailsDialog.order.payment.amount.toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Method:
                                                            </span>
                                                            <span>
                                                                {
                                                                    detailsDialog
                                                                        .order
                                                                        .payment
                                                                        .method
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Status:
                                                            </span>
                                                            <span>
                                                                {detailsDialog
                                                                    .order
                                                                    .payment
                                                                    .status ===
                                                                    'completed' && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-green-200 bg-green-50 text-green-700"
                                                                    >
                                                                        Completed
                                                                    </Badge>
                                                                )}
                                                                {detailsDialog
                                                                    .order
                                                                    .payment
                                                                    .status ===
                                                                    'pending' && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-amber-200 bg-amber-50 text-amber-700"
                                                                    >
                                                                        Pending
                                                                    </Badge>
                                                                )}
                                                                {detailsDialog
                                                                    .order
                                                                    .payment
                                                                    .status ===
                                                                    'refunded' && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-blue-200 bg-blue-50 text-blue-700"
                                                                    >
                                                                        Refunded
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {detailsDialog.order.status !==
                                            OrderStatus.COMPLETED &&
                                            detailsDialog.order.status !==
                                                OrderStatus.REFUNDED && (
                                                <div className="flex justify-end gap-2">
                                                    {detailsDialog.order
                                                        .status !==
                                                        OrderStatus.CANCELLED && (
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => {
                                                                setDetailsDialog(
                                                                    {
                                                                        isOpen: false,
                                                                        order: null,
                                                                    }
                                                                );
                                                                openStatusDialog(
                                                                    detailsDialog.order,
                                                                    OrderStatus.REFUNDED
                                                                );
                                                            }}
                                                        >
                                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                                            Process Refund
                                                        </Button>
                                                    )}
                                                    {detailsDialog.order
                                                        .status ===
                                                        OrderStatus.PENDING && (
                                                        <Button
                                                            onClick={() => {
                                                                setDetailsDialog(
                                                                    {
                                                                        isOpen: false,
                                                                        order: null,
                                                                    }
                                                                );
                                                                openStatusDialog(
                                                                    detailsDialog.order,
                                                                    OrderStatus.COMPLETED
                                                                );
                                                            }}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Completed
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium">
                                            No Payment Information
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This order does not have any payment
                                            information.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDetailsDialog({ isOpen: false, order: null })
                            }
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
