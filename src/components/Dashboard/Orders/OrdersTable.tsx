'use client';

import { format } from 'date-fns';
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
    CheckCircle,
    Clock,
    Eye,
    History,
    MoreHorizontal,
    RefreshCcw,
    XCircle,
} from 'lucide-react';
import { type Order, OrderStatus } from '@/types/types';

interface OrdersTableProps {
    orders: Order[];
    sortField: keyof Order;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: keyof Order) => void;
    openDetailsDialog: (order: Order) => void;
    openHistoryDrawer: (order: Order) => void;
    openStatusDialog: (order: Order, newStatus: OrderStatus) => void;
}

export function OrdersTable({
    orders,
    sortField,
    sortDirection,
    handleSort,
    openDetailsDialog,
    openHistoryDrawer,
    openStatusDialog,
}: OrdersTableProps) {
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

    return (
        <Card>
            <CardContent className="p-0">
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
                                        onClick={() => handleSort('userId')}
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
                                        {sortField === 'totalAmount' && (
                                            <ArrowUpDown
                                                className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                            />
                                        )}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('status')}
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
                                        onClick={() => handleSort('createdAt')}
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
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center"
                                    >
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
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
                                                            key={item.id}
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
                                            ${order.totalAmount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(order.createdAt),
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
                                                        openDetailsDialog(order)
                                                    }
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        View order details
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() =>
                                                        openHistoryDrawer(order)
                                                    }
                                                >
                                                    <History className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        View order history
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
                                                                Cancel Order
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
            </CardContent>
        </Card>
    );
}
