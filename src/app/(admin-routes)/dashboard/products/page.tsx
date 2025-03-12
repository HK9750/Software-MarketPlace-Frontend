'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductsHeader } from '@/components/Dashboard/Products/ProductsHeader';
import { ProductsFilters } from '@/components/Dashboard/Products/ProductsFilters';
import { ProductsTable } from '@/components/Dashboard/Products/ProductsTable';
import { StatusChangeDialog } from '@/components/Dashboard/Products/StatusChangeDialog';
import { toast } from 'sonner';
import { useRootContext } from '@/lib/contexts/RootContext';

const GET_PRODUCTS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusChangeLoading, setStatusChangeLoading] = useState<
        string | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        productId: string | null;
        currentStatus: string;
        newStatus: 'active' | 'inactive' | 'pending';
    }>({
        isOpen: false,
        productId: null,
        currentStatus: '',
        newStatus: 'active',
    });
    const { access_token, refresh_token } = useRootContext();

    // Fetch products data using axios
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: any = await axios.get(GET_PRODUCTS_URL, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                });
                if (response.data.data && Array.isArray(response.data.data)) {
                    const processedProducts = response.data.data.map(
                        (product: any) => ({
                            ...product,
                            status: product.status || 'pending', // Default status if missing
                            sales: product.sales || 0, // Default sales if missing
                            dateAdded:
                                product.dateAdded ||
                                new Date().toISOString().split('T')[0], // Default date if missing
                        })
                    );
                    setProducts(processedProducts);
                } else {
                    throw new Error('Invalid data format received from server');
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to fetch products';
                setError(errorMessage);
                toast.error('Failed to load products', {
                    description: errorMessage,
                });

                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [access_token, refresh_token]);

    // Get unique categories from loaded products
    const categories = Array.from(
        new Set(
            products.map((product) => product.category?.name || 'Uncategorized')
        )
    );

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            const matchesSearch =
                searchQuery === '' ||
                product.name
                    ?.toLowerCase()
                    ?.includes(searchQuery.toLowerCase()) ||
                product.description
                    ?.toLowerCase()
                    ?.includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === null ||
                product.category?.name === categoryFilter;

            const matchesStatus =
                statusFilter === null || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            let comparison = 0;

            // Handle nested fields
            if (sortField === 'category.name') {
                comparison = (a.category?.name || '').localeCompare(
                    b.category?.name || ''
                );
            } else if (sortField === 'seller.user.username') {
                comparison = (a.seller?.user?.username || '').localeCompare(
                    b.seller?.user?.username || ''
                );
            } else {
                // Handle top-level fields
                switch (sortField) {
                    case 'name':
                        comparison = (a.name || '').localeCompare(b.name || '');
                        break;
                    case 'price':
                        comparison = (a.price || 0) - (b.price || 0);
                        break;
                    case 'status':
                        comparison = (a.status || '').localeCompare(
                            b.status || ''
                        );
                        break;
                    case 'sales':
                        comparison = (a.sales || 0) - (b.sales || 0);
                        break;
                    case 'averageRating':
                        comparison =
                            (a.averageRating || 0) - (b.averageRating || 0);
                        break;
                    default:
                        return 0;
                }
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

    // Handle sort toggle
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle status change with API integration
    const handleStatusChange = async (
        productId: string,
        newStatus: 'active' | 'inactive' | 'pending'
    ) => {
        setConfirmDialog({
            isOpen: false,
            productId: null,
            currentStatus: '',
            newStatus: 'active',
        });

        setStatusChangeLoading(productId);

        try {
            // Make API call to update product status
            await axios.patch(`/api/products/${productId}`, {
                status: newStatus,
            });

            // Update product status in local state
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? { ...product, status: newStatus }
                        : product
                )
            );

            toast.success('Product status updated', {
                description: `Product is now ${newStatus}`,
            });
        } catch (err) {
            let errorMessage = 'Please try again later';

            errorMessage =
                err.response?.data?.message || err.message || errorMessage;

            toast.error('Failed to update product status', {
                description: errorMessage,
            });
        } finally {
            setStatusChangeLoading(null);
        }
    };

    // Open confirm dialog for status change
    const openConfirmDialog = (
        productId: string,
        currentStatus: string,
        newStatus: 'active' | 'inactive' | 'pending'
    ) => {
        setConfirmDialog({
            isOpen: true,
            productId,
            currentStatus,
            newStatus,
        });
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setCategoryFilter(null);
        setStatusFilter(null);
        setSortField(null);
        setSortDirection('asc');
    };

    return (
        <div className="space-y-6">
            <ProductsHeader />

            <ProductsFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categories={categories}
                hasFilters={
                    !!(
                        searchQuery ||
                        categoryFilter ||
                        statusFilter ||
                        sortField
                    )
                }
                resetFilters={resetFilters}
            />

            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-2">No products found</p>
                    {(searchQuery || categoryFilter || statusFilter) && (
                        <button
                            onClick={resetFilters}
                            className="text-primary hover:underline"
                        >
                            Clear filters and try again
                        </button>
                    )}
                </div>
            ) : (
                <ProductsTable
                    products={filteredProducts}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    handleSort={handleSort}
                    openConfirmDialog={openConfirmDialog}
                />
            )}

            <StatusChangeDialog
                isOpen={confirmDialog.isOpen}
                productId={confirmDialog.productId}
                currentStatus={confirmDialog.currentStatus}
                newStatus={confirmDialog.newStatus}
                isLoading={statusChangeLoading === confirmDialog.productId}
                onClose={() =>
                    setConfirmDialog({
                        isOpen: false,
                        productId: null,
                        currentStatus: '',
                        newStatus: 'active',
                    })
                }
                onConfirm={handleStatusChange}
            />
        </div>
    );
}
