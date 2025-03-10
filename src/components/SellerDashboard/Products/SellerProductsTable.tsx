'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpDown,
    CheckCircle,
    Edit,
    Eye,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
    XCircle,
} from 'lucide-react';
import type { Product } from '@/types/types';
import { DeleteProductDialog } from './DeleteProductDialog';

// Mock data for seller's products
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
            verified: true,
            websiteLink: 'https://dataviz.io',
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
];

export function SellerProductsTable() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof any | null>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        productId: string | null;
        productName: string;
    }>({
        isOpen: false,
        productId: null,
        productName: '',
    });

    // Handle sort toggle - memoized callback
    const handleSort = useCallback((field: keyof any) => {
        setSortField((currentField) => {
            if (currentField === field) {
                setSortDirection((currentDirection) =>
                    currentDirection === 'asc' ? 'desc' : 'asc'
                );
                return currentField;
            }
            setSortDirection('asc');
            return field;
        });
    }, []);

    // Filter and sort products - memoized calculation
    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                return (
                    searchQuery === '' ||
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.category.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            })
            .sort((a, b) => {
                if (!sortField) return 0;

                let comparison = 0;

                if (sortField === 'category') {
                    comparison = a.category.name.localeCompare(b.category.name);
                } else if (sortField === 'averageRating') {
                    comparison = a.averageRating - b.averageRating;
                } else if (sortField === 'price') {
                    comparison = a.price - b.price;
                } else if (sortField === 'sales') {
                    comparison = (a.sales || 0) - (b.sales || 0);
                } else if (sortField === 'name') {
                    comparison = a.name.localeCompare(b.name);
                } else if (sortField === 'status') {
                    comparison = (a.status || '').localeCompare(b.status || '');
                }

                return sortDirection === 'asc' ? comparison : -comparison;
            });
    }, [products, searchQuery, sortField, sortDirection]);

    // Handle product deletion
    const handleDeleteProduct = useCallback(async (productId: string) => {
        // In a real app, you would call an API here
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
        );
        setDeleteDialog({
            isOpen: false,
            productId: null,
            productName: '',
        });
    }, []);

    // Open delete confirmation dialog
    const openDeleteDialog = useCallback(
        (productId: string, productName: string) => {
            setDeleteDialog({
                isOpen: true,
                productId,
                productName,
            });
        },
        []
    );

    // Get status badge - memoized function
    const getStatusBadge = useCallback((status: string | undefined) => {
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
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    }, []);

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() =>
                                router.push('/dashboard/seller/products/new')
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Product
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
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
                                            onClick={() => handleSort('price')}
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
                                            onClick={() => handleSort('status')}
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
                                                handleSort('averageRating')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                        >
                                            Rating
                                            {sortField === 'averageRating' && (
                                                <ArrowUpDown
                                                    className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('sales')}
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
                                            colSpan={7}
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
                                                            product.filePath ||
                                                            '/placeholder.svg'
                                                        }
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-md object-cover"
                                                    />
                                                    <div>
                                                        <span className="line-clamp-1 font-medium">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground line-clamp-1">
                                                            {
                                                                product.description
                                                            }
                                                        </span>
                                                    </div>
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
                                                    {product.category.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(product.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="font-medium">
                                                        {product.averageRating.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        /5
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {product.sales?.toLocaleString() ||
                                                    '0'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/seller/products/${product.id}`
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            View product
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/seller/products/${product.id}/edit`
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Edit product
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
                                                                    More options
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/dashboard/seller/products/${product.id}`
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/dashboard/seller/products/${product.id}/edit`
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Product
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        product.id,
                                                                        product.name
                                                                    )
                                                                }
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete Product
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
                </CardContent>
            </Card>

            <DeleteProductDialog
                isOpen={deleteDialog.isOpen}
                productName={deleteDialog.productName}
                onClose={() =>
                    setDeleteDialog({
                        isOpen: false,
                        productId: null,
                        productName: '',
                    })
                }
                onDelete={() => {
                    if (deleteDialog.productId) {
                        handleDeleteProduct(deleteDialog.productId);
                    }
                }}
            />
        </>
    );
}
