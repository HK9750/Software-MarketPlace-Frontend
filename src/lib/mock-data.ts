import {
    type Order,
    OrderStatus,
    type UserType,
    type Software,
    type OrderItem,
    type UserOrderHistory,
} from '@/types/types';

// Mock data for users
const mockUsers: UserType[] = [
    { id: 'u1', name: 'John Doe', email: 'john@example.com' },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'u3', name: 'Robert Johnson', email: 'robert@example.com' },
    { id: 'u4', name: 'Emily Davis', email: 'emily@example.com' },
    { id: 'u5', name: 'Michael Wilson', email: 'michael@example.com' },
];

// Mock data for software
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
export function generateMockOrders(): Order[] {
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
}
