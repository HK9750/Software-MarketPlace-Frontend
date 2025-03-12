'use client';

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
    Eye,
    MoreHorizontal,
    AlertCircle,
    XCircle,
    ExternalLink,
    Edit,
    Trash,
} from 'lucide-react';
import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';

interface ProductsTableProps {
    products: any[];
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
    const router = useRouter();

    const getStatusBadge = (status: string | undefined) => {
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
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
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
                                            handleSort('category.name')
                                        }
                                        className="flex items-center gap-1 p-0 font-medium"
                                    >
                                        Category
                                        {sortField === 'category.name' && (
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
                                            handleSort('seller.user.username')
                                        }
                                        className="flex items-center gap-1 p-0 font-medium"
                                    >
                                        Seller
                                        {sortField ===
                                            'seller.user.username' && (
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
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center"
                                    >
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
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
                                                        {product.description}
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
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">
                                                    {
                                                        product.seller.user
                                                            .username
                                                    }
                                                </span>
                                                {product.seller.verified && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-1 border-blue-200 bg-blue-50 text-blue-700 text-xs"
                                                    >
                                                        Verified
                                                    </Badge>
                                                )}
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
                                                            `/products/${product.id}`
                                                        )
                                                    }
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
                                                                More options
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
                                                            View in Store
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {product.status !==
                                                            'active' && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openConfirmDialog(
                                                                        product.id,
                                                                        product.status ||
                                                                            'pending',
                                                                        'active'
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                Set as Active
                                                            </DropdownMenuItem>
                                                        )}
                                                        {product.status !==
                                                            'inactive' && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openConfirmDialog(
                                                                        product.id,
                                                                        product.status ||
                                                                            'pending',
                                                                        'inactive'
                                                                    )
                                                                }
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                                Set as Inactive
                                                            </DropdownMenuItem>
                                                        )}
                                                        {product.status !==
                                                            'pending' && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openConfirmDialog(
                                                                        product.id,
                                                                        product.status ||
                                                                            'active',
                                                                        'pending'
                                                                    )
                                                                }
                                                            >
                                                                <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                                                                Set as Pending
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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
    );
}
