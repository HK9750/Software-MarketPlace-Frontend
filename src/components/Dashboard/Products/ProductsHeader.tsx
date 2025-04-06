'use client';

export function ProductsHeader() {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    Manage your product listings and inventory.
                </p>
            </div>
        </div>
    );
}
