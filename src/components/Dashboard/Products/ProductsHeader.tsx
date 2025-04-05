'use client';

export function ProductsHeader() {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    Manage your product listings and inventory.
                </p>
            </div>
        </div>
    );
}
