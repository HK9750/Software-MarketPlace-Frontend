'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRootContext } from '@/lib/contexts/RootContext';
import { OrderList } from './OrderList';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Loader2, RefreshCw } from 'lucide-react';
import OrderListSkeleton from './OrderListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderDashboardPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        access_token,
        refresh_token,
        loading: contextLoading,
    } = useRootContext();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response: any = await axios.get(`${backendUrl}/orders/`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'X-Refresh-Token': refresh_token || '',
                },
            });
            setOrders(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchOrders();
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (!contextLoading && access_token) {
            fetchOrders();
        }
    }, [access_token, contextLoading]);

    const handleViewOrderDetails = (orderId) => {
        setSelectedOrderId(orderId);
        setIsDetailsModalOpen(true);
    };

    if (contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            Order Dashboard
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading || isRefreshing}
                            className="h-9"
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading ? (
                        <OrderListSkeleton />
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    ) : (
                        <OrderList
                            orders={orders}
                            onViewDetails={handleViewOrderDetails}
                        />
                    )}
                </CardContent>
            </Card>

            {selectedOrderId && (
                <OrderDetailsModal
                    orderId={selectedOrderId}
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            )}
        </div>
    );
}
