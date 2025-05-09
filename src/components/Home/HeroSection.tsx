import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        // Only handle Enter key
        if (e.key === 'Enter') {
            // Prevent default behavior (form submission)
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <section className="w-full py-16 md:py-24 lg:py-32 bg-background flex items-center justify-center">
            <div className="container px-6 md:px-12 lg:px-16">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center text-center lg:text-left">
                    {/* Text Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl">
                            Find the Perfect Software for Your Business
                        </h1>
                        <p className="max-w-lg text-muted-foreground md:text-lg">
                            Browse thousands of subscription-based software
                            solutions with flexible licensing options. Compare
                            features, read authentic reviews, and make confident
                            purchase decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="What software are you looking for?"
                                    className="w-full pl-12 pr-4 py-4 text-base"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <Button
                                size="lg"
                                className="px-6 py-4"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-4">
                            {[
                                'Productivity',
                                'Design',
                                'Development',
                                'Business',
                                'Security',
                                'Subscription',
                            ].map((category) => (
                                <Badge
                                    key={category}
                                    variant="secondary"
                                    className="px-3 py-1 text-sm"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&h=600&q=80"
                                alt="Software marketplace illustration"
                                className="relative z-10 w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
