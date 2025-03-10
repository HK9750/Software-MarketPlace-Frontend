import type { Metadata } from 'next';
import { ProductForm } from '@/components/SellerDashboard/Products/ProductForm';
import type { Product } from '@/types/types';

export const metadata: Metadata = {
    title: 'Edit Product | Seller Dashboard',
    description: 'Edit your product details',
};

// Mock function to get product by ID
async function getProduct(id: string): Promise<any | null> {
    // In a real app, this would fetch from an API
    const mockProduct: any = {
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
    };

    return mockProduct;
}

export default async function EditProductPage({
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Product
                </h1>
                <p className="text-muted-foreground">
                    Update your product details
                </p>
            </div>

            <ProductForm product={product} />
        </div>
    );
}
