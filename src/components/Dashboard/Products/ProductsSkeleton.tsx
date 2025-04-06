'use client';

import React from 'react';

export function ProductsSkeleton() {
    return (
        <div className="border rounded-md shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Seller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Sales
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <tr
                                key={index}
                                className="hover:bg-muted/40 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-muted animate-pulse"></div>
                                        <div className="ml-4 space-y-2">
                                            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                                            <div className="h-3 w-40 bg-muted/70 animate-pulse rounded"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto"></div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
