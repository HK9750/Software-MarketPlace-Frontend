'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductsHeader } from './ProductsHeader';
import { ProductsFilters } from './ProductsFilters';
import { ProductsTable } from './ProductsTable';
import { StatusChangeDialog } from './StatusChangeDialog';
import { ProductsSkeleton } from './ProductsSkeleton';
import { toast } from 'sonner';
import { useRootContext } from '@/lib/contexts/RootContext';
import { debounce } from '@/utils/debounce';

// Define proper types for better type safety
interface Product {
    id: string;
    name: string;
    description: string;
    filePath?: string;
    category?: {
        id: string;
        name: string;
    };
    averageRating?: number;
    status: number; // Changed to number to match backend
    sales?: number;
    dateAdded?: string;
    seller?: {
        verified?: boolean;
        user?: {
            id: string;
            username: string;
        };
    };
}

interface Category {
    id: string;
    name: string;
}

interface ProductsPageprops {
    id?: string;
    type?: 'seller' | 'admin';
}

// Map numeric status values to string representations
const STATUS_MAP: Record<number, string> = {
    0: 'pending',
    1: 'active',
    2: 'inactive',
};

// Map string status to numeric values for API requests
const STATUS_VALUE_MAP: Record<string, number> = {
    pending: 0,
    active: 1,
    inactive: 2,
};

const GET_PRODUCTS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
const GET_PRODUCTS_URL_SELLER = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/seller`;
const GET_CATEGORIES_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`;

export default function ProductsPage({
    id,
    type = 'admin',
}: ProductsPageprops) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusChangeLoading, setStatusChangeLoading] = useState<
        string | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
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
    const debouncedSetSearchQuery = debounce((query: string) => {
        setSearchQuery(query);
    }, 500);

    // Fetch categories data
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);

            try {
                const response: any = await axios.get(GET_CATEGORIES_URL, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                });

                if (
                    response.data.success &&
                    response.data.data &&
                    Array.isArray(response.data.data)
                ) {
                    // Extract category names
                    const categoryNames = response.data.data.map(
                        (category: Category) => category.name
                    );
                    setCategories(categoryNames);
                } else {
                    console.warn('Invalid categories data format received');
                    setCategories([]);
                }
            } catch (err: any) {
                console.error('Failed to fetch categories:', err);
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [access_token, refresh_token]);

    const url =
        type === 'admin'
            ? GET_PRODUCTS_URL
            : `${GET_PRODUCTS_URL_SELLER}/${id}`;

    // Fetch products data using axios
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: any = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                });

                if (
                    response.data.success &&
                    response.data.products &&
                    Array.isArray(response.data.products)
                ) {
                    const processedProducts = response.data.products.map(
                        (product: any) => ({
                            ...product,
                            // Convert numeric status to string representation for UI
                            status: STATUS_MAP[product.status] || 'pending',
                            sales: product.sales || 0,
                            dateAdded:
                                product.dateAdded ||
                                new Date().toISOString().split('T')[0],
                        })
                    );
                    setProducts(processedProducts);
                } else {
                    throw new Error('Invalid data format received from server');
                }
            } catch (err: any) {
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
    }, [access_token, refresh_token, url]);

    // Filter and sort products
    const filteredProducts: any = products
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
                statusFilter === null ||
                STATUS_MAP[product.status] === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a: any, b: any) => {
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
            // Convert string status to numeric value for API
            const numericStatus = STATUS_VALUE_MAP[newStatus];
            console.log(
                `Changing status of product ${productId} to ${newStatus} (${numericStatus})`
            );
            // Make API call to update product status - corrected URL to match backend
            console.log(
                `${GET_PRODUCTS_URL}/${productId}/status/${numericStatus}`
            );
            const response: any = await axios.put(
                `${GET_PRODUCTS_URL}/${productId}/status/${numericStatus}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token,
                    },
                }
            );

            if (response.data.success) {
                // Update product status in local state
                setProducts((prevProducts: any) =>
                    prevProducts.map((product) =>
                        product.id === productId
                            ? { ...product, status: newStatus }
                            : product
                    )
                );

                toast.success('Product status updated', {
                    description: `Product is now ${newStatus}`,
                });
            } else {
                throw new Error(
                    response.data.message || 'Status update failed'
                );
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                'Please try again later';

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

    // Get empty state message based on user type and filter status
    const getEmptyStateMessage = () => {
        if (searchQuery || categoryFilter || statusFilter) {
            return 'No products match your current filters';
        }

        if (type === 'seller') {
            return "You haven't created any products yet";
        }

        return 'No products found in the system';
    };

    return (
        <div className="space-y-6">
            <ProductsHeader />

            <ProductsFilters
                searchQuery={searchQuery}
                setSearchQuery={debouncedSetSearchQuery}
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
                isLoading={categoriesLoading}
            />

            {isLoading ? (
                <ProductsSkeleton />
            ) : error ? (
                <div
                    className="bg-red-50 border border-red-200 text-destructive px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">
                        {getEmptyStateMessage()}
                    </p>
                    {type === 'seller' &&
                        !searchQuery &&
                        !categoryFilter &&
                        !statusFilter && (
                            <a
                                href="/seller-dashboard/products/new"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                            >
                                Create your first product
                            </a>
                        )}
                    {(searchQuery || categoryFilter || statusFilter) && (
                        <button
                            onClick={resetFilters}
                            className="text-primary hover:underline mt-2 block mx-auto"
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
