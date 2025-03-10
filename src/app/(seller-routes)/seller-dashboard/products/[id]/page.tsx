import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, ExternalLink, Star } from 'lucide-react';
import type { Product } from '@/types/types';

export const metadata: Metadata = {
    title: 'Product Details | Seller Dashboard',
    description: 'View product details and performance',
};

// Mock function to get product by ID
async function getProduct(id: string): Promise<any | null> {
    // In a real app, this would fetch from an API
    const mockProduct: any = {
        id: '1',
        name: 'DesignPro Studio',
        description: 'Professional design software for creative professionals',
        price: 49.99,
        filePath: '/placeholder.svg?height=200&width=200',
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
    };

    return mockProduct;
}

export default async function ProductDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Product not found</h1>
                    <p className="text-muted-foreground">
                        The product you are looking for does not exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/seller/products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Product details and performance
                        </p>
                    </div>
                </div>
                <Button asChild>
                    <Link
                        href={`/dashboard/seller/products/${product.id}/edit`}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>
                            Basic details about your product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex items-center justify-center">
                                <img
                                    src={product.filePath || '/placeholder.svg'}
                                    alt={product.name}
                                    className="rounded-lg border object-contain max-w-[200px] max-h-[200px]"
                                />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-semibold">
                                            {product.name}
                                        </h3>
                                        {product.badge && (
                                            <Badge className="bg-primary text-primary-foreground">
                                                {product.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Price
                                        </p>
                                        <p className="text-lg font-semibold">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Category
                                        </p>
                                        <p>{product.category.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className={
                                                product.status === 'active'
                                                    ? 'border-green-200 bg-green-50 text-green-700'
                                                    : product.status ===
                                                        'inactive'
                                                      ? 'border-red-200 bg-red-50 text-red-700'
                                                      : 'border-amber-200 bg-amber-50 text-amber-700'
                                            }
                                        >
                                            {product.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                product.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Rating
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            <span>
                                                {product.averageRating.toFixed(
                                                    1
                                                )}
                                                /5
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Added On
                                    </p>
                                    <p>
                                        {new Date(
                                            product.dateAdded
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={`/products/${product.id}`}
                                            target="_blank"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View in Marketplace
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>
                            Sales and performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Sales
                                </p>
                                <p className="text-3xl font-bold">
                                    {product.sales}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Revenue
                                </p>
                                <p className="text-3xl font-bold">
                                    $
                                    {(
                                        product.sales * product.price
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Conversion Rate
                                </p>
                                <p className="text-3xl font-bold">3.2%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Page Views
                                </p>
                                <p className="text-3xl font-bold">38.9K</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Features
                                </h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {product.features
                                        .split(',')
                                        .map((feature, index) => (
                                            <li key={index}>
                                                {feature.trim()}
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    System Requirements
                                </h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {product.requirements
                                        .split(',')
                                        .map((requirement, index) => (
                                            <li key={index}>
                                                {requirement.trim()}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reviews" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    Review analytics are coming soon. Check back
                                    later for detailed customer feedback.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-6 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    Detailed analytics are coming soon. Check
                                    back later for comprehensive performance
                                    data.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
