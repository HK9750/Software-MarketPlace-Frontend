import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { CheckCircle, Clock, RefreshCcw, User, XCircle } from 'lucide-react';
import { type Order, OrderStatus } from '@/types/types';

interface OrderHistoryDrawerProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
}

export function OrderHistoryDrawer({
    isOpen,
    order,
    onClose,
}: OrderHistoryDrawerProps) {
    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Order History</DrawerTitle>
                    <DrawerDescription>
                        {order && <>Order {order.id} status history</>}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 py-2">
                    {order && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {order.user.name}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Order Total: ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>

                            <div className="relative pl-6 border-l border-border">
                                {order.history
                                    .sort(
                                        (a, b) =>
                                            new Date(a.createdAt).getTime() -
                                            new Date(b.createdAt).getTime()
                                    )
                                    .map((historyItem) => (
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
    );
}
