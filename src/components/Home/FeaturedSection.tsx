import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    Star,
    Award,
    RotateCcw,
} from 'lucide-react';
import SoftwareCard from './SoftwareCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const HOMEPAGE_PRODUCTS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/homepage/filter`;

// Define strongly typed interfaces based on the backend
interface Software {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    rating: number;
    latestPrice: number | null;
    type: 'popular' | 'trending' | 'bestseller';
}

interface SoftwareCategories {
    popular: Software[];
    trending: Software[];
    bestSellers: Software[];
}

interface ApiResponse {
    success: boolean;
    message: string;
    softwares: SoftwareCategories;
}

const FeaturedSection: FC = () => {
    const [categories, setCategories] = useState<SoftwareCategories>({
        popular: [],
        trending: [],
        bestSellers: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        'popular' | 'trending' | 'bestSellers'
    >('trending');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>(
                HOMEPAGE_PRODUCTS_URL
            );

            if (response.data.success) {
                setCategories(response.data.softwares);
                setError(null);
            } else {
                setError('Unable to load featured software.');
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError(
                'Unable to load featured software. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getTabIcon = (tab: string) => {
        switch (tab) {
            case 'popular':
                return <Star className="h-4 w-4 mr-1" />;
            case 'trending':
                return <TrendingUp className="h-4 w-4 mr-1" />;
            case 'bestSellers':
                return <Award className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    if (error) {
        return (
            <section className="py-16 max-w-6xl mx-auto px-4">
                <Alert variant="destructive" className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div className="ml-2 flex-1">
                        <AlertTitle className="text-lg font-medium">
                            Error
                        </AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchProducts}
                        className="ml-auto flex items-center gap-1"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Retry
                    </Button>
                </Alert>
            </section>
        );
    }

    const hasNoContent =
        Object.values(categories).every((cat) => cat.length === 0) && !loading;

    if (hasNoContent) {
        return (
            <section className="w-full py-16 bg-muted/30 flex flex-col items-center">
                <div className="text-center mb-6 px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Featured Software
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                        No featured products available at the moment.
                    </p>
                    <Button onClick={fetchProducts} className="mt-6 gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-16 bg-muted/30 flex flex-col items-center">
            <div className="text-center mb-10 px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Featured Software
                </h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                    Explore our curated selection of subscription-based software
                    solutions with flexible licensing options
                </p>
            </div>

            <div className="w-full max-w-6xl px-4">
                <Tabs
                    defaultValue="trending"
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as any)}
                    className="w-full"
                >
                    <div className="border-b mb-8">
                        <TabsList className="justify-center space-x-6 bg-transparent">
                            {(
                                ['popular', 'trending', 'bestSellers'] as const
                            ).map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="relative py-2 px-3 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-all"
                                >
                                    <div className="flex items-center">
                                        {getTabIcon(tab)}
                                        <span className="capitalize">
                                            {tab === 'bestSellers'
                                                ? 'Best Sellers'
                                                : tab}
                                        </span>
                                    </div>
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {(['popular', 'trending', 'bestSellers'] as const).map(
                        (key) => (
                            <TabsContent
                                key={key}
                                value={key}
                                className="focus-visible:outline-none focus-visible:ring-0"
                            >
                                {loading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {Array(8)
                                            .fill(0)
                                            .map((_, i) => (
                                                <SoftwareCard
                                                    key={i}
                                                    software={{} as any}
                                                    loading={true}
                                                />
                                            ))}
                                    </div>
                                ) : categories[key].length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {categories[key].map((item) => (
                                            <SoftwareCard
                                                key={item.id}
                                                software={item}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <p className="text-muted-foreground">
                                            No{' '}
                                            {key === 'bestSellers'
                                                ? 'best-selling'
                                                : key}{' '}
                                            software found at this time.
                                        </p>
                                        {activeTab !== 'popular' && (
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() =>
                                                    setActiveTab('popular')
                                                }
                                            >
                                                Browse popular software instead
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {categories[key].length > 0 && !loading && (
                                    <div className="flex justify-center mt-12">
                                        <Button
                                            variant="outline"
                                            className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors group"
                                        >
                                            View All{' '}
                                            {key === 'bestSellers'
                                                ? 'Best Sellers'
                                                : key}
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        )
                    )}
                </Tabs>
            </div>
        </section>
    );
};

export default FeaturedSection;
