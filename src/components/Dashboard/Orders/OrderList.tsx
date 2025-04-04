// components/orders/OrderList.tsx
import { TableCaption } from '@/components/ui/table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
    id: string;
    orderId: string;
    subscriptionId: string;
    price: number;
}

interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

interface OrderListProps {
    orders: Order[];
    onViewDetails: (orderId: string) => void;
}

export function OrderList({ orders, onViewDetails }: OrderListProps) {
    if (!orders.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground mt-1">
                    Create a new order to get started.
                </p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">Order ID</TableHead>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Items</TableHead>
                        <TableHead className="text-right font-medium">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-sm">
                                {order.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell className="text-sm">
                                {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                                ${order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`${getStatusColor(order.status)} text-xs px-2 py-0.5 font-medium`}
                                >
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {order.items.length}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewDetails(order.id)}
                                    className="h-8 px-3"
                                >
                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption className="text-xs text-muted-foreground pt-2 pb-4">
                    Showing {orders.length} order
                    {orders.length !== 1 ? 's' : ''}
                </TableCaption>
            </Table>
        </div>
    );
}
