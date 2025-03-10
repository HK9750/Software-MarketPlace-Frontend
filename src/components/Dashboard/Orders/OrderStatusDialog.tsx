'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { OrderStatus } from '@/types/types';

interface OrderStatusDialogProps {
    isOpen: boolean;
    orderId: string | null;
    currentStatus: OrderStatus | null;
    newStatus: OrderStatus | null;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderStatusDialog({
    isOpen,
    orderId,
    currentStatus,
    newStatus,
    isLoading,
    onClose,
    onConfirm,
}: OrderStatusDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Order Status</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to change this order's status from{' '}
                        <span className="font-medium">{currentStatus}</span> to{' '}
                        <span className="font-medium">{newStatus}</span>?
                        {newStatus === OrderStatus.REFUNDED && (
                            <div className="mt-2 text-amber-600">
                                This will process a refund for the customer.
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (orderId && newStatus) {
                                onConfirm(orderId, newStatus);
                            }
                        }}
                        disabled={isLoading}
                        variant={
                            newStatus === OrderStatus.CANCELLED ||
                            newStatus === OrderStatus.REFUNDED
                                ? 'destructive'
                                : 'default'
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
