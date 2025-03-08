'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const Unauthorized: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-primary/80 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="border-muted/20 shadow-xl overflow-hidden backdrop-blur bg-background/95">
                    <div className="h-1 bg-destructive w-full" />

                    <CardHeader className="pb-2">
                        <div className="flex justify-center mb-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    delay: 0.2,
                                }}
                                className="relative"
                            >
                                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <Lock
                                        className="text-destructive h-10 w-10"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="absolute -top-2 -right-2 bg-background rounded-full p-1.5 shadow-sm border border-border"
                                >
                                    <ShieldAlert className="h-5 w-5 text-destructive" />
                                </motion.div>
                            </motion.div>
                        </div>

                        <CardTitle className="text-center text-2xl font-bold">
                            Unauthorized Access
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center px-8">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-muted-foreground"
                        >
                            You don't have the necessary permissions to access
                            this page. Please contact your administrator if you
                            believe this is an error.
                        </motion.p>
                    </CardContent>

                    <CardFooter className="flex justify-center p-6 pt-2">
                        <Button
                            variant="default"
                            size="lg"
                            className="gap-2 font-medium shadow-sm bg-primary hover:bg-primary/90 transition-colors"
                            asChild
                        >
                            <Link href="/">
                                <ArrowLeft size={16} />
                                <span>Return to Home</span>
                            </Link>
                        </Button>
                    </CardFooter>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-muted/30 p-3 text-xs text-center text-muted-foreground"
                    >
                        Error Code: 403 Forbidden
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Unauthorized;
