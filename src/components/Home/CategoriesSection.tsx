import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Code, PenTool, BarChart, Database, Shield, Globe } from 'lucide-react';

const categories = [
    { icon: <Code className="h-8 w-8" />, name: 'Development' },
    { icon: <PenTool className="h-8 w-8" />, name: 'Design' },
    { icon: <BarChart className="h-8 w-8" />, name: 'Business' },
    { icon: <Database className="h-8 w-8" />, name: 'Data' },
    { icon: <Shield className="h-8 w-8" />, name: 'Security' },
    { icon: <Globe className="h-8 w-8" />, name: 'Web' },
];

const CategoriesSection = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-background flex items-center justify-center">
            <div className="container px-6 md:px-12 lg:px-16">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                            Browse by Category
                        </h2>
                        <p className="max-w-xl text-muted-foreground md:text-lg">
                            Find the perfect software solution for your specific
                            needs.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
                    {categories.map((category, index) => (
                        <Link href="#" key={index} className="group">
                            <Card className="h-full p-4 transition-all rounded-xl border hover:shadow-lg hover:bg-muted/50 flex flex-col items-center">
                                <CardContent className="flex flex-col items-center justify-center space-y-3">
                                    <div className="rounded-full bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-center font-semibold text-lg">
                                        {category.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
