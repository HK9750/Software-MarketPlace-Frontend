'use client';

import { useState, useCallback, useMemo } from 'react';
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
} from 'lucide-react';
import { CategoryDialog } from './CategoryDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

// Category type
interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

// Mock categories
const initialCategories: Category[] = [
    {
        id: 'cat1',
        name: 'Design',
        description: 'Design software and tools',
        productCount: 24,
    },
    {
        id: 'cat2',
        name: 'Development',
        description: 'Development tools and IDEs',
        productCount: 36,
    },
    {
        id: 'cat3',
        name: 'Business',
        description: 'Business and productivity software',
        productCount: 18,
    },
    {
        id: 'cat4',
        name: 'Security',
        description: 'Security and privacy tools',
        productCount: 12,
    },
    {
        id: 'cat5',
        name: 'Utilities',
        description: 'Utility software and tools',
        productCount: 30,
    },
    {
        id: 'cat6',
        name: 'Productivity',
        description: 'Productivity and organization tools',
        productCount: 22,
    },
];

export function CategoryTable() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Category>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Dialog states
    const [categoryDialog, setCategoryDialog] = useState<{
        isOpen: boolean;
        category: Category | null;
    }>({
        isOpen: false,
        category: null,
    });

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        categoryId: string | null;
        categoryName: string;
    }>({
        isOpen: false,
        categoryId: null,
        categoryName: '',
    });

    // Handle sort toggle
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

    // Filter and sort categories
    const filteredCategories = useMemo(() => {
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

    // Open category dialog for add/edit
    const openCategoryDialog = useCallback(
        (category: Category | null = null) => {
            setCategoryDialog({
                isOpen: true,
                category,
            });
        },
        []
    );

    // Open delete confirmation dialog
    const openDeleteDialog = useCallback(
        (categoryId: string, categoryName: string) => {
            setDeleteDialog({
                isOpen: true,
                categoryId,
                categoryName,
            });
        },
        []
    );

    // Handle category save
    const handleSaveCategory = useCallback((category: Category) => {
        setCategories((prevCategories) => {
            if (category.id) {
                // Update existing category
                return prevCategories.map((c) =>
                    c.id === category.id ? category : c
                );
            } else {
                // Add new category
                const newCategory = {
                    ...category,
                    id: `cat${prevCategories.length + 1}`,
                    productCount: 0,
                };
                return [...prevCategories, newCategory];
            }
        });

        setCategoryDialog({
            isOpen: false,
            category: null,
        });
    }, []);

    // Handle category deletion
    const handleDeleteCategory = useCallback((categoryId: string) => {
        setCategories((prevCategories) =>
            prevCategories.filter((c) => c.id !== categoryId)
        );

        setDeleteDialog({
            isOpen: false,
            categoryId: null,
            categoryName: '',
        });
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
                                placeholder="Search categories..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => openCategoryDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-1 p-0 font-medium"
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
                                {filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            No categories found.
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
                                                {category.productCount}
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
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete Category
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
                onClose={() =>
                    setCategoryDialog({ isOpen: false, category: null })
                }
                onSave={handleSaveCategory}
            />

            <DeleteCategoryDialog
                isOpen={deleteDialog.isOpen}
                categoryName={deleteDialog.categoryName}
                onClose={() =>
                    setDeleteDialog({
                        isOpen: false,
                        categoryId: null,
                        categoryName: '',
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
