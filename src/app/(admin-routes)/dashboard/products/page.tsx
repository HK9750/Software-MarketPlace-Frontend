'use client';

import { useState } from 'react';
import { ProductsHeader } from '@/components/Dashboard/Products/ProductsHeader';
import { ProductsFilters } from '@/components/Dashboard/Products/ProductsFilters';
import { ProductsTable } from '@/components/Dashboard/Products/ProductsTable';
import { StatusChangeDialog } from '@/components/Dashboard/Products/StatusChangeDialog';
import { toast } from 'sonner';

// Mock product data with the new Product interface
const initialProducts: any[] = [
    {
        id: '1',
        name: 'DesignPro Studio',
        description: 'Professional design software for creative professionals',
        price: 49.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.8,
        status: 'active',
        sales: 1245,
        dateAdded: '2023-01-15',
        badge: 'Popular',
        features:
            'Advanced design tools, Cloud collaboration, Template library',
        requirements: 'Windows 10/11 or macOS 10.15+, 8GB RAM, 4GB storage',
        category: {
            id: 'cat1',
            name: 'Design',
        },
        seller: {
            verified: true,
            websiteLink: 'https://designpro.com',
            user: {
                id: 'u1',
                username: 'designpro',
                email: 'info@designpro.com',
                profile: {
                    firstName: 'Design',
                    lastName: 'Studio',
                    phone: '+1234567890',
                },
            },
        },
        isWishlisted: false,
    },
    {
        id: '2',
        name: 'CodeMaster IDE',
        description: 'Powerful integrated development environment for coders',
        price: 39.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.7,
        status: 'active',
        sales: 982,
        dateAdded: '2023-02-20',
        badge: 'Trending',
        features: 'Code completion, Debugging tools, Git integration',
        requirements: 'Windows 10/11, macOS, or Linux, 4GB RAM',
        category: {
            id: 'cat2',
            name: 'Development',
        },
        seller: {
            verified: true,
            websiteLink: 'https://codemaster.dev',
            user: {
                id: 'u2',
                username: 'codemaster',
                email: 'support@codemaster.dev',
                profile: {
                    firstName: 'Code',
                    lastName: 'Master',
                    phone: '+1987654321',
                },
            },
        },
        isWishlisted: true,
    },
    {
        id: '3',
        name: 'DataViz Analytics',
        description: 'Data visualization and analytics platform',
        price: 59.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.9,
        status: 'pending',
        sales: 567,
        dateAdded: '2023-03-10',
        badge: 'New',
        features:
            'Interactive dashboards, Real-time data processing, Export capabilities',
        requirements: 'Any modern browser, 2GB RAM',
        category: {
            id: 'cat3',
            name: 'Business',
        },
        seller: {
            verified: false,
            websiteLink: 'https://dataviz.io',
            user: {
                id: 'u3',
                username: 'dataviz',
                email: 'hello@dataviz.io',
                profile: {
                    firstName: 'Data',
                    lastName: 'Viz',
                    phone: '+1122334455',
                },
            },
        },
        isWishlisted: false,
    },
    {
        id: '4',
        name: 'SecureShield Pro',
        description: 'Advanced security and privacy protection',
        price: 29.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.6,
        status: 'active',
        sales: 1893,
        dateAdded: '2023-03-15',
        features: 'Malware protection, Password manager, VPN service',
        requirements: 'Windows 7/8/10/11, macOS 10.13+',
        category: {
            id: 'cat4',
            name: 'Security',
        },
        seller: {
            verified: true,
            websiteLink: 'https://secureshield.com',
            user: {
                id: 'u4',
                username: 'secureshield',
                email: 'support@secureshield.com',
                profile: {
                    firstName: 'Secure',
                    lastName: 'Shield',
                    phone: '+1555666777',
                },
            },
        },
        isWishlisted: false,
    },
    {
        id: '5',
        name: 'CloudSync Storage',
        description: 'Secure cloud storage and file synchronization',
        price: 19.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.5,
        status: 'inactive',
        sales: 723,
        dateAdded: '2023-04-05',
        features: 'Automatic sync, File versioning, Cross-platform',
        requirements: 'Windows, macOS, iOS, Android',
        category: {
            id: 'cat5',
            name: 'Utilities',
        },
        seller: {
            verified: true,
            websiteLink: 'https://cloudsync.net',
            user: {
                id: 'u5',
                username: 'cloudsync',
                email: 'help@cloudsync.net',
                profile: {
                    firstName: 'Cloud',
                    lastName: 'Sync',
                    phone: '+1777888999',
                },
            },
        },
        isWishlisted: true,
    },
    {
        id: '6',
        name: 'TaskFlow Manager',
        description: 'Streamline your workflow with task management',
        price: 24.99,
        filePath: '/placeholder.svg?height=40&width=40',
        averageRating: 4.4,
        status: 'active',
        sales: 1056,
        dateAdded: '2023-01-05',
        features: 'Task tracking, Team collaboration, Calendar integration',
        requirements: 'Web browser, mobile app available',
        category: {
            id: 'cat6',
            name: 'Productivity',
        },
        seller: {
            verified: false,
            websiteLink: 'https://taskflow.io',
            user: {
                id: 'u6',
                username: 'taskflow',
                email: 'hello@taskflow.io',
                profile: {
                    firstName: 'Task',
                    lastName: 'Flow',
                    phone: '+1444555666',
                },
            },
        },
        isWishlisted: false,
    },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusChangeLoading, setStatusChangeLoading] = useState<
        string | null
    >(null);
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

    // Get unique categories
    const categories = Array.from(
        new Set(products.map((product) => product.category.name))
    );

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            const matchesSearch =
                searchQuery === '' ||
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === null ||
                product.category.name === categoryFilter;
            const matchesStatus =
                statusFilter === null || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            let comparison = 0;

            // Handle nested fields
            if (sortField === 'category.name') {
                comparison = a.category.name.localeCompare(b.category.name);
            } else if (sortField === 'seller.user.username') {
                comparison = a.seller.user.username.localeCompare(
                    b.seller.user.username
                );
            } else {
                // Handle top-level fields
                switch (sortField) {
                    case 'name':
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case 'price':
                        comparison = a.price - b.price;
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
                        comparison = a.averageRating - b.averageRating;
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

    // Handle status change
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update product status
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
        } catch (error) {
            toast.error('Failed to update product status', {
                description: 'Please try again later',
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

            <ProductsTable
                products={filteredProducts}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                openConfirmDialog={openConfirmDialog}
            />

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
