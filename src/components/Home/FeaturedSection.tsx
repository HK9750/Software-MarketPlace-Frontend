import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SoftwareCard from '@/components/Home/SoftwareCard';

const softwareCategories = {
    trending: [
        {
            title: 'DesignPro Studio',
            description:
                'Professional design software for creative professionals',
            price: '$49.99',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=375&q=80',
            badge: 'Popular',
        },
        {
            title: 'CodeMaster IDE',
            description:
                'Powerful integrated development environment for coders',
            price: '$39.99',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=375&q=80',
            badge: 'Trending',
        },
        {
            title: 'DataViz Analytics',
            description: 'Data visualization and analytics platform',
            price: '$59.99',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=375&q=80',
            badge: 'Best Seller',
        },
        {
            title: 'SecureShield Pro',
            description: 'Advanced security and privacy protection',
            price: '$29.99',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&h=375&q=80',
        },
    ],
    new: [
        {
            title: 'CloudSync Pro',
            description: 'Next-generation cloud storage and synchronization',
            price: '$34.99',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=375&q=80',
            badge: 'New',
        },
        {
            title: 'VideoEdit Master',
            description: 'Professional video editing suite for creators',
            price: '$59.99',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=375&q=80',
            badge: 'New',
        },
        {
            title: 'TaskFlow',
            description:
                'Streamline your workflow with advanced task management',
            price: '$24.99',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=375&q=80',
            badge: 'New',
        },
        {
            title: 'AudioMix Pro',
            description: 'Professional audio mixing and mastering software',
            price: '$49.99',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=375&q=80',
            badge: 'New',
        },
    ],
    top: [
        {
            title: 'PhotoEdit Pro',
            description: 'Advanced photo editing and manipulation software',
            price: '$39.99',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=375&q=80',
            badge: 'Top Rated',
        },
        {
            title: 'ProjectManager Pro',
            description: 'Complete project management solution for teams',
            price: '$69.99',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=375&q=80',
            badge: 'Top Rated',
        },
        {
            title: 'WebBuilder Studio',
            description: 'Create beautiful websites without coding',
            price: '$29.99',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&h=375&q=80',
            badge: 'Top Rated',
        },
        {
            title: 'FinanceTracker',
            description: 'Personal and business finance management tool',
            price: '$34.99',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=375&q=80',
            badge: 'Top Rated',
        },
    ],
};

const FeaturedSection = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-muted/50 flex flex-col items-center justify-center">
            <div className="container px-6 md:px-12 lg:px-16 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                    Featured Software
                </h2>
                <p className="max-w-xl mx-auto text-muted-foreground md:text-lg mt-4">
                    Discover top-rated and trending software solutions.
                </p>
            </div>
            <Tabs defaultValue="trending" className="mt-10 w-full max-w-6xl">
                <TabsList className="flex justify-center space-x-4">
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="new">New Releases</TabsTrigger>
                    <TabsTrigger value="top">Top Rated</TabsTrigger>
                </TabsList>
                {Object.entries(softwareCategories).map(([key, items]) => (
                    <TabsContent key={key} value={key} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((software, index) => (
                                <SoftwareCard key={index} software={software} />
                            ))}
                        </div>
                        <div className="flex justify-center mt-8">
                            <Button variant="outline" className="gap-2">
                                View All <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
};

export default FeaturedSection;
