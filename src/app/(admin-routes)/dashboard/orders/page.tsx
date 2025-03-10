'use client';

import { useState } from 'react';
import { OrdersHeader } from '@/components/Dashboard/Orders/OrdersHeader';
import { OrdersFilters } from '@/components/Dashboard/Orders/OrdersFilters';
import { OrdersTable } from '@/components/Dashboard/Orders/OrdersTable';
import { OrderStatusDialog } from '@/components/Dashboard/Orders/OrderStatusDialog';
import { OrderHistoryDrawer } from '@/components/Dashboard/Orders/OrderHistoryDrawer';
import { OrderDetailsDialog } from '@/components/Dashboard/Orders/OrderDetailsDialog';
import { type Order, OrderStatus } from '@/types/types';
import { generateMockOrders } from '@/lib/mock-data';

// Enum for order status
enum OriginalOrderStatus {
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
    status: OriginalOrderStatus;
    note?: string;
    createdAt: Date;
    user: UserType;
}

interface OriginalOrder {
    id: string;
    userId: string;
    softwareId: string;
    totalAmount: number;
    status: OriginalOrderStatus;
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
const generateOriginalMockOrders = (): OriginalOrder[] => {
    const orders: OriginalOrder[] = [];

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
        const statuses = Object.values(OriginalOrderStatus);
        const status = statuses[
            Math.floor(Math.random() * statuses.length)
        ] as OriginalOrderStatus;

        const orderItems: OrderItem[] = [
            {
                id: `oi${i}`,
                orderId: `ord${i}`,
                softwareId,
                price: software.price,
                software,
                licenseKeys:
                    status === OriginalOrderStatus.COMPLETED
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
                    status === OriginalOrderStatus.COMPLETED
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
            status !== OriginalOrderStatus.CANCELLED
                ? {
                      id: `pay${i}`,
                      orderId: `ord${i}`,
                      amount: totalAmount,
                      method: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
                      status:
                          status === OriginalOrderStatus.REFUNDED
                              ? 'refunded'
                              : status === OriginalOrderStatus.COMPLETED
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
                status: OriginalOrderStatus.PENDING,
                note: 'Order created',
                createdAt: new Date(createdAt),
                user,
            },
        ];

        // Add status change history based on current status
        if (status !== OriginalOrderStatus.PENDING) {
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
            if (status === OriginalOrderStatus.REFUNDED) {
                const refundDate = new Date(statusChangeDate);
                refundDate.setHours(
                    refundDate.getHours() + Math.floor(Math.random() * 48)
                );

                history.push({
                    id: `hist${i}-3`,
                    userId,
                    orderId: `ord${i}`,
                    status: OriginalOrderStatus.REFUNDED,
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

const initialOrders = generateOriginalMockOrders();

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(generateMockOrders());
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
                        const newHistoryEntry = {
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
        } catch (error) {
            console.error('Failed to update order status', error);
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

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('ALL');
        setSortField('createdAt');
        setSortDirection('desc');
    };

    return (
        <div className="space-y-6">
            <OrdersHeader />

            <OrdersFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                hasFilters={
                    searchQuery !== '' ||
                    statusFilter !== 'ALL' ||
                    sortField !== 'createdAt' ||
                    sortDirection !== 'desc'
                }
                resetFilters={resetFilters}
            />

            <OrdersTable
                orders={filteredOrders}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                openDetailsDialog={openDetailsDialog}
                openHistoryDrawer={openHistoryDrawer}
                openStatusDialog={openStatusDialog}
            />

            <OrderStatusDialog
                isOpen={statusDialog.isOpen}
                orderId={statusDialog.orderId}
                currentStatus={statusDialog.currentStatus}
                newStatus={statusDialog.newStatus}
                isLoading={statusChangeLoading === statusDialog.orderId}
                onClose={() =>
                    setStatusDialog({
                        isOpen: false,
                        orderId: null,
                        currentStatus: null,
                        newStatus: null,
                    })
                }
                onConfirm={handleStatusChange}
            />

            <OrderHistoryDrawer
                isOpen={historyDrawer.isOpen}
                order={historyDrawer.order}
                onClose={() =>
                    setHistoryDrawer({
                        isOpen: false,
                        order: null,
                    })
                }
            />

            <OrderDetailsDialog
                isOpen={detailsDialog.isOpen}
                order={detailsDialog.order}
                onClose={() =>
                    setDetailsDialog({
                        isOpen: false,
                        order: null,
                    })
                }
                openStatusDialog={openStatusDialog}
            />
        </div>
    );
}
