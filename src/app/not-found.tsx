// not-found.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        document.title = 'Page Not Found';
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="border-muted/30 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-primary to-primary/60 w-full" />

                    <div className="p-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 100,
                                delay: 0.1,
                            }}
                            className="relative"
                        >
                            <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center">
                                <Search
                                    className="text-primary h-12 w-12 opacity-80"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                                className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-sm border border-border"
                            >
                                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                                    <span className="text-primary font-semibold text-sm">
                                        404
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <CardContent className="px-6 pb-2 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <h1 className="text-2xl font-bold text-foreground mb-3">
                                Page Not Found
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                We couldn't locate the page you're looking for.
                                It might have been moved or no longer exists.
                            </p>
                        </motion.div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-3 p-6">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full sm:w-auto gap-2 font-medium shadow-sm"
                            asChild
                        >
                            <Link href="/">
                                <Home size={16} />
                                <span>Homepage</span>
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto gap-2 font-medium"
                            onClick={handleGoBack}
                        >
                            <ArrowLeft size={16} />
                            <span>Go Back</span>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default NotFound;
