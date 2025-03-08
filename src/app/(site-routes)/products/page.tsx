import ProductCatalog from '@/components/Product';
import { products } from '@/lib/product-data';

export const metadata = {
    title: 'Software Products | SoftMarket',
    description: 'Browse our collection of software products and services',
};

export default function ProductsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2">Software Products</h1>
            <p className="text-muted-foreground mb-8">
                Browse our collection of high-quality software products and
                services
            </p>
            <ProductCatalog products={products} />
        </div>
    );
}
