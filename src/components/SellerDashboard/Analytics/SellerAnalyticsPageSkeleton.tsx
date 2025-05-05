'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SellerAnalyticsPageSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Seller Analytics</h1>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-4 w-32" />
                    </CardFooter>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-4 w-32" />
                    </CardFooter>
                </Card>
            </div>

            {/* Conversion Rates and Top Performing Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between"
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-44 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-5 w-40" />
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((j) => (
                                                <Skeleton
                                                    key={j}
                                                    className="h-4 w-4"
                                                />
                                            ))}
                                            <Skeleton className="h-4 w-8 ml-2" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <div className="mt-2 pt-2 border-t">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <div className="bg-muted p-2 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-4 w-20" />
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (j) => (
                                                            <Skeleton
                                                                key={j}
                                                                className="h-3 w-3"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-full mt-2" />
                                            <Skeleton className="h-4 w-3/4 mt-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-24" />
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="text-left py-3 px-4">
                                        <Skeleton className="h-4 w-24" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b">
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-40" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-6 w-16" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-16" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-12" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-20" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
