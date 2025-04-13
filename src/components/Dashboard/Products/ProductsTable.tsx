'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRootContext } from '@/lib/contexts/RootContext';

interface Product {
    id: string;
    name: string;
    description: string;
    filePath?: string;
    category?: {
        id: string;
        name: string;
    };
    status: string;
    sales?: number;
    averageRating?: number;
    dateAdded?: string;
    seller?: {
        verified?: boolean;
        user?: {
            id: string;
            username: string;
        };
    };
}

interface ProductsTableProps {
    products: Product[];
    sortField: string | null;
    sortDirection: 'asc' | 'desc';
    handleSort: (field: string) => void;
    openConfirmDialog: (
        productId: string,
        currentStatus: string,
        newStatus: 'active' | 'inactive' | 'pending'
    ) => void;
}

export function ProductsTable({
    products,
    sortField,
    sortDirection,
    handleSort,
    openConfirmDialog,
}: ProductsTableProps) {
    // State for tracking expanded product descriptions
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {}
    );
    const { user } = useRootContext();
    const isSeller = user?.role === 'SELLER';
    // Toggle row expansion
    const toggleRowExpand = (productId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    // Sort indicator component
    const SortIndicator = ({ field }: { field: string }) => {
        if (sortField !== field) return null;

        return (
            <span className="ml-1">
                {sortDirection === 'asc' ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline"
                    >
                        <path d="m5 15 7-7 7 7" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline"
                    >
                        <path d="m19 9-7 7-7-7" />
                    </svg>
                )}
            </span>
        );
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        let colorClass;

        switch (status) {
            case 'active':
                colorClass =
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
                break;
            case 'inactive':
                colorClass =
                    'bg-destructive/20 text-destructive dark:bg-destructive/30 dark:text-destructive-foreground';
                break;
            default:
                colorClass =
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'; // pending
        }

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Generate status actions based on current status
    const renderStatusActions = (product: Product) => {
        switch (product.status) {
            case 'active':
                return (
                    <button
                        onClick={() =>
                            openConfirmDialog(
                                product.id,
                                product.status,
                                'inactive'
                            )
                        }
                        className="text-destructive hover:text-destructive/80 font-medium"
                    >
                        Deactivate
                    </button>
                );
            case 'inactive':
                return (
                    <button
                        onClick={() =>
                            openConfirmDialog(
                                product.id,
                                product.status,
                                'active'
                            )
                        }
                        className="text-primary hover:text-primary/80 font-medium"
                    >
                        Activate
                    </button>
                );
            case 'pending':
                return (
                    <button
                        onClick={() =>
                            openConfirmDialog(
                                product.id,
                                product.status,
                                'active'
                            )
                        }
                        className="text-primary hover:text-primary/80 font-medium"
                    >
                        Approve
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="border rounded-md shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                        >
                            Product
                            <SortIndicator field="name" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('category.name')}
                        >
                            Category
                            <SortIndicator field="category.name" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('status')}
                        >
                            Status
                            <SortIndicator field="status" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('seller.user.username')}
                        >
                            Seller
                            <SortIndicator field="seller.user.username" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('averageRating')}
                        >
                            Rating
                            <SortIndicator field="averageRating" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('sales')}
                        >
                            Sales
                            <SortIndicator field="sales" />
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="hover:bg-muted/40 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-start">
                                    {product.filePath ? (
                                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                                            <Image
                                                src={product.filePath}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-shrink-0 h-10 w-10 bg-muted rounded flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-muted-foreground"
                                            >
                                                <rect
                                                    width="18"
                                                    height="18"
                                                    x="3"
                                                    y="3"
                                                    rx="2"
                                                />
                                                <path d="M3 9h18" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        <div className="font-medium text-foreground">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {expandedRows[product.id] ? (
                                                product.description
                                            ) : (
                                                <>
                                                    {product.description
                                                        ?.length > 60
                                                        ? `${product.description.substring(0, 60)}...`
                                                        : product.description}
                                                </>
                                            )}
                                        </div>
                                        {product.description?.length > 60 && (
                                            <button
                                                onClick={() =>
                                                    toggleRowExpand(product.id)
                                                }
                                                className="text-xs text-primary hover:text-primary/80 hover:underline mt-1"
                                            >
                                                {expandedRows[product.id]
                                                    ? 'Show less'
                                                    : 'Show more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {product.category?.name || 'Uncategorized'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={product.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {product.seller?.user?.username || 'Unknown'}
                                {product.seller?.verified && (
                                    <span className="ml-1 text-primary">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            stroke="none"
                                            className="inline"
                                        >
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {product.averageRating ? (
                                    <div className="flex items-center">
                                        <span className="mr-1">
                                            {product.averageRating.toFixed(1)}
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="gold"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                ) : (
                                    'No ratings'
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {product.sales || 0}
                            </td>
                            {isSeller ? (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/seller-dashboard/products/${product.id}/edit`}
                                        className="text-primary hover:text-primary/80 font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            ) : (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {renderStatusActions(product)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
