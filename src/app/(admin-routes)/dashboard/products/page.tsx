'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChevronDown,
    Search,
    Eye,
    Edit,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    ArrowUpDown,
    Trash,
    ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// Product type definition
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    status: 'active' | 'inactive' | 'pending';
    image: string;
    stock: number;
    rating: number;
    sales: number;
    dateAdded: string;
}

// Mock product data
const initialProducts: Product[] = [
    {
        id: '1',
        name: 'DesignPro Studio',
        price: 49.99,
        category: 'Design',
        status: 'active',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.8,
        sales: 1245,
        dateAdded: '2023-01-15',
    },
    {
        id: '2',
        name: 'CodeMaster IDE',
        price: 39.99,
        category: 'Development',
        status: 'active',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.7,
        sales: 982,
        dateAdded: '2023-02-20',
    },
    {
        id: '3',
        name: 'DataViz Analytics',
        price: 59.99,
        category: 'Business',
        status: 'pending',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.9,
        sales: 567,
        dateAdded: '2023-03-10',
    },
    {
        id: '4',
        name: 'SecureShield Pro',
        price: 29.99,
        category: 'Security',
        status: 'active',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.6,
        sales: 1893,
        dateAdded: '2023-03-15',
    },
    {
        id: '5',
        name: 'CloudSync Storage',
        price: 19.99,
        category: 'Utilities',
        status: 'inactive',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.5,
        sales: 723,
        dateAdded: '2023-04-05',
    },
    {
        id: '6',
        name: 'TaskFlow Manager',
        price: 24.99,
        category: 'Productivity',
        status: 'active',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.4,
        sales: 1056,
        dateAdded: '2023-01-05',
    },
    {
        id: '7',
        name: 'VideoEdit Pro',
        price: 69.99,
        category: 'Multimedia',
        status: 'active',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.8,
        sales: 876,
        dateAdded: '2023-05-12',
    },
    {
        id: '8',
        name: 'AudioMix Studio',
        price: 34.99,
        category: 'Multimedia',
        status: 'pending',
        image: '/placeholder.svg?height=40&width=40',
        stock: 999,
        rating: 4.3,
        sales: 432,
        dateAdded: '2023-05-20',
    },
];

// Get unique categories from products
const getUniqueCategories = (products: Product[]) => {
    return Array.from(new Set(products.map((product) => product.category)));
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [statusChangeLoading, setStatusChangeLoading] = useState<
        string | null
    >(null);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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
    const categories = getUniqueCategories(products);

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            const matchesSearch =
                searchQuery === '' ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === null || product.category === categoryFilter;
            const matchesStatus =
                statusFilter === null || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            if (!sortField) return 0;

            let comparison = 0;

            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'sales':
                    comparison = a.sales - b.sales;
                    break;
                default:
                    return 0;
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

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                    >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                    </Badge>
                );
            case 'inactive':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactive
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            default:
                return null;
        }
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                    Manage your software products and their status
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Product Management</CardTitle>
                            <CardDescription>
                                View and manage all products on the marketplace
                            </CardDescription>
                        </div>
                        <Button className="w-full sm:w-auto">
                            Add New Product
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full pl-8"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                                <Select
                                    value={categoryFilter || ''}
                                    onValueChange={(value) =>
                                        setCategoryFilter(value || null)
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={statusFilter || ''}
                                    onValueChange={(value) =>
                                        setStatusFilter(value || null)
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {(searchQuery ||
                                    categoryFilter ||
                                    statusFilter ||
                                    sortField) && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full sm:w-auto"
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('name')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Product
                                                {sortField === 'name' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('price')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Price
                                                {sortField === 'price' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('category')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Category
                                                {sortField === 'category' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('status')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Status
                                                {sortField === 'status' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    handleSort('sales')
                                                }
                                                className="flex items-center gap-1 p-0 font-medium"
                                            >
                                                Sales
                                                {sortField === 'sales' && (
                                                    <ArrowUpDown
                                                        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                    />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                product.image ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        <span className="line-clamp-1">
                                                            {product.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    ${product.price.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {product.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        product.status
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {product.sales.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                View product
                                                            </span>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        More
                                                                        options
                                                                    </span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>
                                                                    Actions
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Product
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                                    View in
                                                                    Store
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {product.status !==
                                                                    'active' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openConfirmDialog(
                                                                                product.id,
                                                                                product.status,
                                                                                'active'
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                        Set as
                                                                        Active
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {product.status !==
                                                                    'inactive' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openConfirmDialog(
                                                                                product.id,
                                                                                product.status,
                                                                                'inactive'
                                                                            )
                                                                        }
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                                        Set as
                                                                        Inactive
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {product.status !==
                                                                    'pending' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            openConfirmDialog(
                                                                                product.id,
                                                                                product.status,
                                                                                'pending'
                                                                            )
                                                                        }
                                                                    >
                                                                        <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                                                                        Set as
                                                                        Pending
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                    Product
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setConfirmDialog({
                            isOpen: false,
                            productId: null,
                            currentStatus: '',
                            newStatus: 'active',
                        });
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Product Status</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to change this product's
                            status from{' '}
                            <span className="font-medium">
                                {confirmDialog.currentStatus}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {confirmDialog.newStatus}
                            </span>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setConfirmDialog({
                                    isOpen: false,
                                    productId: null,
                                    currentStatus: '',
                                    newStatus: 'active',
                                });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (confirmDialog.productId) {
                                    handleStatusChange(
                                        confirmDialog.productId,
                                        confirmDialog.newStatus
                                    );
                                }
                            }}
                            disabled={
                                statusChangeLoading === confirmDialog.productId
                            }
                        >
                            {statusChangeLoading === confirmDialog.productId ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                    Updating...
                                </>
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
