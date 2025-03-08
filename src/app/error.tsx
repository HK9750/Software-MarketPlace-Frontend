'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="border-muted/30 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-destructive to-destructive/60 w-full" />

                    <CardHeader className="pb-2">
                        <div className="flex justify-center mb-2">
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
                                <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertTriangle
                                        className="text-destructive h-12 w-12 opacity-80"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 shadow-sm border border-border"
                                >
                                    <div className="h-6 w-6 rounded-full bg-destructive/15 flex items-center justify-center">
                                        <span className="text-destructive font-semibold text-xs">
                                            500
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        <CardTitle className="text-center text-2xl font-bold">
                            Something Went Wrong
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <p className="text-muted-foreground text-sm">
                                We encountered an unexpected error while
                                processing your request.
                            </p>
                            {error.digest && (
                                <p className="text-xs text-muted-foreground/70">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </motion.div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-4">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full sm:w-auto gap-2 font-medium shadow-sm bg-destructive hover:bg-destructive/90"
                            onClick={reset}
                        >
                            <RefreshCcw size={16} />
                            <span>Try Again</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto gap-2 font-medium"
                            asChild
                        >
                            <Link href="/">
                                <Home size={16} />
                                <span>Return Home</span>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
