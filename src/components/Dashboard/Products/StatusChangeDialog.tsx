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

interface StatusChangeDialogProps {
    isOpen: boolean;
    productId: string | null;
    currentStatus: string;
    newStatus: 'active' | 'inactive' | 'pending';
    isLoading: boolean;
    onClose: () => void;
    onConfirm: (
        productId: string,
        newStatus: 'active' | 'inactive' | 'pending'
    ) => void;
}

export function StatusChangeDialog({
    isOpen,
    productId,
    currentStatus,
    newStatus,
    isLoading,
    onClose,
    onConfirm,
}: StatusChangeDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Product Status</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to change this product's status
                        from{' '}
                        <span className="font-medium">{currentStatus}</span> to{' '}
                        <span className="font-medium">{newStatus}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (productId) {
                                onConfirm(productId, newStatus);
                            }
                        }}
                        disabled={isLoading}
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
