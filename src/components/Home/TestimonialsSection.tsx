'use client';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: 'Alex Johnson',
        role: 'Product Designer',
        content:
            'SoftMarket has completely transformed how I discover and purchase software. The user reviews and comparison features helped me find the perfect design tools for my team.',
        avatar: 'AJ',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80',
    },
    {
        name: 'Sarah Chen',
        role: 'CTO, TechStart Inc.',
        content:
            "As a startup CTO, I need reliable software that won't break the bank. This marketplace has been invaluable for finding high-quality solutions within our budget.",
        avatar: 'SC',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80',
    },
    {
        name: 'Michael Rodriguez',
        role: 'Freelance Developer',
        content:
            "The variety of development tools available here is impressive. I've discovered several gems that have significantly improved my workflow and productivity.",
        avatar: 'MR',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80',
    },
];

const TestimonialsSection = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-muted/50 flex justify-center">
            <div className="container px-6 md:px-12 lg:px-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                        What Our Customers Say
                    </h2>
                    <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                        Trusted by thousands of businesses and individuals
                        worldwide.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 justify-center">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex justify-center"
                        >
                            <Card className="w-full max-w-md shadow-lg hover:shadow-2xl transition-all rounded-2xl">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="object-cover rounded-full"
                                            />
                                            <AvatarFallback className="bg-muted text-xl font-semibold">
                                                {testimonial.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg font-semibold">
                                                {testimonial.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {testimonial.role}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm italic">
                                        &quot;{testimonial.content}&quot;
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
