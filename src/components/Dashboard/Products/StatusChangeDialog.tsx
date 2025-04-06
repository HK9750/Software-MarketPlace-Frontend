'use client';

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
    if (!isOpen) return null;

    const getDialogTitle = () => {
        switch (newStatus) {
            case 'active':
                return currentStatus === 'pending'
                    ? 'Approve Product'
                    : 'Activate Product';
            case 'inactive':
                return 'Deactivate Product';
            case 'pending':
                return 'Mark as Pending';
            default:
                return 'Change Product Status';
        }
    };

    const getDialogDescription = () => {
        switch (newStatus) {
            case 'active':
                return currentStatus === 'pending'
                    ? 'Are you sure you want to approve this product? It will be visible to customers.'
                    : 'Are you sure you want to activate this product? It will be visible to customers.';
            case 'inactive':
                return 'Are you sure you want to deactivate this product? It will no longer be visible to customers.';
            case 'pending':
                return 'Are you sure you want to mark this product as pending? It will require review before being visible to customers.';
            default:
                return 'Are you sure you want to change the status of this product?';
        }
    };

    const getButtonColor = () => {
        switch (newStatus) {
            case 'active':
                return 'bg-primary hover:bg-primary/90 focus:ring-primary/50';
            case 'inactive':
                return 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/50';
            default:
                return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400';
        }
    };

    const getButtonText = () => {
        switch (newStatus) {
            case 'active':
                return currentStatus === 'pending' ? 'Approve' : 'Activate';
            case 'inactive':
                return 'Deactivate';
            case 'pending':
                return 'Mark as Pending';
            default:
                return 'Confirm';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-background rounded-lg max-w-md w-full mx-4 p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    {getDialogTitle()}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {getDialogDescription()}
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (productId) {
                                onConfirm(productId, newStatus);
                            }
                        }}
                        className={`px-4 py-2 text-sm font-medium text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            getButtonText()
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
