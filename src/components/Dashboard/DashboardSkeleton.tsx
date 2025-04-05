'use client';
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => {
    return (
        <div className="flex flex-col gap-6 p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-48" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-4 w-40 mt-1" />
                                </div>
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-7 w-16" />
                            </CardContent>
                        </Card>
                    ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <div className="rounded-md bg-muted">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent className="px-2">
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-44" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center"
                                            >
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="ml-4 space-y-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                                <div className="ml-auto">
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardSkeleton;
