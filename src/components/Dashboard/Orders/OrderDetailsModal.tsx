/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import useAccessToken from '@/lib/accessToken';

interface OrderDetailsModalProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailsModal({
    orderId,
    isOpen,
    onClose,
}: OrderDetailsModalProps) {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const access_token = useAccessToken();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!isOpen || !orderId) return;

            setLoading(true);
            try {
                const response: any = await axios.get(
                    `${backendUrl}/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                setOrderDetails(response.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch order details');
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, isOpen, access_token, backendUrl]);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    {!loading && !error && orderDetails && (
                        <DialogDescription>
                            Order #{orderDetails.id.substring(0, 8)}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                ) : orderDetails ? (
                    <div className="space-y-6 py-2">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Order ID
                                </p>
                                <p className="text-sm font-medium">
                                    {orderDetails.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Status
                                </p>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(orderDetails.status)}
                                    <Badge
                                        variant="outline"
                                        className={`${getStatusColor(orderDetails.status)} text-xs`}
                                    >
                                        {orderDetails.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Created At
                                </p>
                                <p className="text-sm">
                                    {formatDate(orderDetails.createdAt)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Total Amount
                                </p>
                                <p className="text-sm font-medium">
                                    ${orderDetails.totalAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-sm font-medium mb-3">
                                Order Items
                            </h3>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-medium text-xs">
                                                Item ID
                                            </TableHead>
                                            <TableHead className="font-medium text-xs">
                                                Subscription
                                            </TableHead>
                                            <TableHead className="text-right font-medium text-xs">
                                                Price
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderDetails.items.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/30"
                                            >
                                                <TableCell className="font-medium text-xs">
                                                    {item.id.substring(0, 8)}...
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {item.subscriptionId.substring(
                                                        0,
                                                        8
                                                    )}
                                                    ...
                                                </TableCell>
                                                <TableCell className="text-right text-xs font-medium">
                                                    ${item.price.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
