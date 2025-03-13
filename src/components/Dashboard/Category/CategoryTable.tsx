/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
    AlertCircle,
    Package,
} from 'lucide-react';
import { CategoryDialog } from './CategoryDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import { useRootContext } from '@/lib/contexts/RootContext';

interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

const BASE_CATEGORY_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`;

export function CategoryTable() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Category>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    const { access_token, refresh_token } = useRootContext();

    const [categoryDialog, setCategoryDialog] = useState<{
        isOpen: boolean;
        category: Category | null;
        isSubmitting: boolean;
    }>({
        isOpen: false,
        category: null,
        isSubmitting: false,
    });

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        categoryId: string | null;
        categoryName: string;
        isSubmitting: boolean;
    }>({
        isOpen: false,
        categoryId: null,
        categoryName: '',
        isSubmitting: false,
    });

    const fetchCategories = useCallback(async () => {
        if (!access_token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response: any = await axios.get(BASE_CATEGORY_URL, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'x-refresh-token': refresh_token || '',
                },
            });

            if (isMounted.current) {
                const fetchedCategories = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];
                setCategories(fetchedCategories);
                setError(null);
            }
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            if (isMounted.current) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Failed to load categories. Please try again.'
                );
                toast.error('Failed to load categories', {
                    description:
                        'There was an error loading the categories. Please try again.',
                });
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        fetchCategories();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleSort = useCallback((field: keyof Category) => {
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

    const filteredCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];

        return categories
            .filter((category) => {
                return (
                    searchQuery === '' ||
                    category.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    category.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            })
            .sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }

                return 0;
            });
    }, [categories, searchQuery, sortField, sortDirection]);

    const openCategoryDialog = useCallback(
        (category: Category | null = null) => {
            setCategoryDialog({
                isOpen: true,
                category,
                isSubmitting: false,
            });
        },
        []
    );

    const openDeleteDialog = useCallback(
        (categoryId: string, categoryName: string) => {
            setDeleteDialog({
                isOpen: true,
                categoryId,
                categoryName,
                isSubmitting: false,
            });
        },
        []
    );

    const handleSaveCategory = useCallback(
        async (category: {
            id?: string;
            name: string;
            description: string;
        }) => {
            if (!access_token) {
                toast.error('Authentication error', {
                    description: 'Please log in again to continue.',
                });
                return;
            }

            setCategoryDialog((prev) => ({ ...prev, isSubmitting: true }));

            try {
                if (category.id) {
                    const response: any = await axios.put(
                        `${BASE_CATEGORY_URL}/${category.id}`,
                        {
                            name: category.name,
                            description: category.description,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'x-refresh-token': refresh_token || '',
                            },
                        }
                    );

                    const updatedCategory = response.data.data;

                    setCategories((prevCategories) =>
                        prevCategories.map((c) =>
                            c.id === category.id
                                ? {
                                      ...c,
                                      name:
                                          updatedCategory.name || category.name,
                                      description:
                                          updatedCategory.description ||
                                          category.description,
                                  }
                                : c
                        )
                    );

                    toast.success('Category updated', {
                        description: `${category.name} has been updated successfully`,
                    });
                } else {
                    const response: any = await axios.post(
                        `${BASE_CATEGORY_URL}/create`,
                        {
                            name: category.name,
                            description: category.description,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'x-refresh-token': refresh_token || '',
                            },
                        }
                    );

                    const newCategory = response.data.data;

                    setCategories((prevCategories: any) => [
                        ...prevCategories,
                        newCategory,
                    ]);

                    toast.success('Category created', {
                        description: `${category.name} has been added successfully`,
                    });
                }

                setCategoryDialog({
                    isOpen: false,
                    category: null,
                    isSubmitting: false,
                });
            } catch (err: any) {
                console.error('Error saving category:', err);
                toast.error('Failed to save category', {
                    description:
                        err.response?.data?.message ||
                        err.message ||
                        'Please try again or contact support if the problem persists.',
                });
            } finally {
                setCategoryDialog((prev) => ({ ...prev, isSubmitting: false }));
            }
        },
        [access_token, refresh_token]
    );

    const handleDeleteCategory = useCallback(
        async (categoryId: string) => {
            if (!access_token) {
                toast.error('Authentication error', {
                    description: 'Please log in again to continue.',
                });
                return;
            }

            setDeleteDialog((prev) => ({ ...prev, isSubmitting: true }));

            try {
                await axios.delete(`${BASE_CATEGORY_URL}/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'x-refresh-token': refresh_token || '',
                    },
                });

                const categoryName =
                    categories.find((c) => c.id === categoryId)?.name ||
                    'Category';
                setCategories((prevCategories) =>
                    prevCategories.filter((c) => c.id !== categoryId)
                );

                toast.success('Category deleted', {
                    description: `${categoryName} has been deleted successfully`,
                });

                setDeleteDialog({
                    isOpen: false,
                    categoryId: null,
                    categoryName: '',
                    isSubmitting: false,
                });
            } catch (err: any) {
                console.error('Error deleting category:', err);
                toast.error('Failed to delete category', {
                    description:
                        err.response?.data?.message ||
                        err.message ||
                        'Please try again or contact support if the problem persists.',
                });
            } finally {
                setDeleteDialog((prev) => ({ ...prev, isSubmitting: false }));
            }
        },
        [categories]
    );

    return (
        <>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search categories..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            onClick={() => openCategoryDialog()}
                            disabled={isLoading}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription className="flex justify-between items-center">
                                <span>{error}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchCategories}
                                >
                                    Retry
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 p-0 font-medium"
                                            disabled={isLoading}
                                        >
                                            Name
                                            {sortField === 'name' && (
                                                <ArrowUpDown
                                                    className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
                                                />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[300px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                handleSort('description')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                            disabled={isLoading}
                                        >
                                            Description
                                            {sortField === 'description' && (
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
                                                handleSort('productCount')
                                            }
                                            className="flex items-center gap-1 p-0 font-medium"
                                            disabled={isLoading}
                                        >
                                            Products
                                            {sortField === 'productCount' && (
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
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow
                                            key={i}
                                            className="animate-pulse"
                                        >
                                            <TableCell>
                                                <div className="h-4 w-32 bg-muted rounded"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-48 bg-muted rounded"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 w-16 bg-muted rounded-full"></div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="h-8 w-8 bg-muted rounded-md"></div>
                                                    <div className="h-8 w-8 bg-muted rounded-md"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            {searchQuery ? (
                                                <div className="flex flex-col items-center justify-center gap-2 py-4">
                                                    <Search className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        No categories found
                                                        matching &quot;
                                                        {searchQuery}&quot;
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSearchQuery('')
                                                        }
                                                    >
                                                        Clear search
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-2 py-4">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        No categories found
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            openCategoryDialog()
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add your first category
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                {category.description}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-normal"
                                                >
                                                    <Package className="mr-1 h-3 w-3" />
                                                    {category.productCount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            openCategoryDialog(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Edit category
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
                                                                    openCategoryDialog(
                                                                        category
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Category
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    openDeleteDialog(
                                                                        category.id,
                                                                        category.name
                                                                    )
                                                                }
                                                                disabled={
                                                                    category.productCount >
                                                                    0
                                                                }
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete Category
                                                                {category.productCount >
                                                                    0 && (
                                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                                        Has
                                                                        products
                                                                    </span>
                                                                )}
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

            <CategoryDialog
                isOpen={categoryDialog.isOpen}
                category={categoryDialog.category}
                isSubmitting={categoryDialog.isSubmitting}
                onClose={() =>
                    setCategoryDialog({
                        isOpen: false,
                        category: null,
                        isSubmitting: false,
                    })
                }
                onSave={handleSaveCategory}
            />

            <DeleteCategoryDialog
                isOpen={deleteDialog.isOpen}
                categoryName={deleteDialog.categoryName}
                isSubmitting={deleteDialog.isSubmitting}
                onClose={() =>
                    setDeleteDialog({
                        isOpen: false,
                        categoryId: null,
                        categoryName: '',
                        isSubmitting: false,
                    })
                }
                onDelete={() => {
                    if (deleteDialog.categoryId) {
                        handleDeleteCategory(deleteDialog.categoryId);
                    }
                }}
            />
        </>
    );
}
