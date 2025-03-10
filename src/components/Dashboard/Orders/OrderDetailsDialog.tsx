'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    CheckCircle,
    CreditCard,
    Download,
    FileText,
    Package,
    RefreshCcw,
    XCircle,
    Clock,
} from 'lucide-react';
import { type Order, OrderStatus } from '@/types/types';

interface OrderDetailsDialogProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    openStatusDialog: (order: Order, newStatus: OrderStatus) => void;
}

export function OrderDetailsDialog({
    isOpen,
    order,
    onClose,
    openStatusDialog,
}: OrderDetailsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        {order && (
                            <>Complete information for order {order.id}</>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {order && (
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

                        <TabsContent value="details" className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Order Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="font-medium">
                                            Order ID:
                                        </span>
                                        <span>{order.id}</span>

                                        <span className="font-medium">
                                            Status:
                                        </span>
                                        <span>
                                            {order.status ===
                                                OrderStatus.COMPLETED && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-200 bg-green-50 text-green-700"
                                                >
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Completed
                                                </Badge>
                                            )}
                                            {order.status ===
                                                OrderStatus.CANCELLED && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-red-200 bg-red-50 text-red-700"
                                                >
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                    Cancelled
                                                </Badge>
                                            )}
                                            {order.status ===
                                                OrderStatus.REFUNDED && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-blue-200 bg-blue-50 text-blue-700"
                                                >
                                                    <RefreshCcw className="mr-1 h-3 w-3" />
                                                    Refunded
                                                </Badge>
                                            )}
                                            {order.status ===
                                                OrderStatus.PENDING && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-200 bg-amber-50 text-amber-700"
                                                >
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </span>

                                        <span className="font-medium">
                                            Date Created:
                                        </span>
                                        <span>
                                            {format(
                                                new Date(order.createdAt),
                                                'MMM dd, yyyy - h:mm a'
                                            )}
                                        </span>

                                        <span className="font-medium">
                                            Last Updated:
                                        </span>
                                        <span>
                                            {format(
                                                new Date(order.updatedAt),
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
                                        <span>{order.user.name}</span>

                                        <span className="font-medium">
                                            Email:
                                        </span>
                                        <span>{order.user.email}</span>

                                        <span className="font-medium">
                                            User ID:
                                        </span>
                                        <span>{order.userId}</span>
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
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">
                                                    Price
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((item) => (
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
                                                        ${item.price.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Total
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    $
                                                    {order.totalAmount.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="items" className="space-y-4 pt-4">
                            {order.items.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        item.software.image ||
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
                                                                    license key
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                {order.status ===
                                                OrderStatus.PENDING
                                                    ? 'License keys will be generated when the order is completed.'
                                                    : 'No license keys available for this item.'}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="payment" className="space-y-4 pt-4">
                            {order.payment ? (
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
                                                            {order.payment.id}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium block">
                                                            Transaction ID:
                                                        </span>
                                                        <span>
                                                            {
                                                                order.payment
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
                                                                    order.payment.createdAt
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
                                                            {order.payment.amount.toFixed(
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
                                                                order.payment
                                                                    .method
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium block">
                                                            Status:
                                                        </span>
                                                        <span>
                                                            {order.payment
                                                                .status ===
                                                                'completed' && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-green-200 bg-green-50 text-green-700"
                                                                >
                                                                    Completed
                                                                </Badge>
                                                            )}
                                                            {order.payment
                                                                .status ===
                                                                'pending' && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-amber-200 bg-amber-50 text-amber-700"
                                                                >
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                            {order.payment
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

                                    {order.status !== OrderStatus.COMPLETED &&
                                        order.status !==
                                            OrderStatus.REFUNDED && (
                                            <div className="flex justify-end gap-2">
                                                {order.status !==
                                                    OrderStatus.CANCELLED && (
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => {
                                                            onClose();
                                                            openStatusDialog(
                                                                order,
                                                                OrderStatus.REFUNDED
                                                            );
                                                        }}
                                                    >
                                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                                        Process Refund
                                                    </Button>
                                                )}
                                                {order.status ===
                                                    OrderStatus.PENDING && (
                                                    <Button
                                                        onClick={() => {
                                                            onClose();
                                                            openStatusDialog(
                                                                order,
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
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
