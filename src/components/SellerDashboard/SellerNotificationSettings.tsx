'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SellerNotificationSettings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState({
        orderNotifications: true,
        productUpdates: true,
        paymentNotifications: true,
        marketingEmails: false,
        reviewNotifications: true,
        securityAlerts: true,
        newsletterUpdates: false,
        productApprovals: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Notification settings:', settings);

            toast.success('Notification settings updated', {
                description: 'Your notification preferences have been saved',
            });
        } catch (error: any) {
            console.error('Error saving settings:', error);
            toast.error('Something went wrong', {
                description: error.message || 'Please try again later',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Manage how you receive notifications and updates
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                            Email Notifications
                        </h3>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">
                                    Order Notifications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails when you get new orders
                                </p>
                            </div>
                            <Switch
                                checked={settings.orderNotifications}
                                onCheckedChange={() =>
                                    handleToggle('orderNotifications')
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">Product Updates</p>
                                <p className="text-sm text-muted-foreground">
                                    Get notified about product status changes
                                </p>
                            </div>
                            <Switch
                                checked={settings.productUpdates}
                                onCheckedChange={() =>
                                    handleToggle('productUpdates')
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">
                                    Payment Notifications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails about payments and payouts
                                </p>
                            </div>
                            <Switch
                                checked={settings.paymentNotifications}
                                onCheckedChange={() =>
                                    handleToggle('paymentNotifications')
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">
                                    Review Notifications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when customers leave reviews
                                </p>
                            </div>
                            <Switch
                                checked={settings.reviewNotifications}
                                onCheckedChange={() =>
                                    handleToggle('reviewNotifications')
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                            System Notifications
                        </h3>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">Security Alerts</p>
                                <p className="text-sm text-muted-foreground">
                                    Important security notifications about your
                                    account
                                </p>
                            </div>
                            <Switch
                                checked={settings.securityAlerts}
                                onCheckedChange={() =>
                                    handleToggle('securityAlerts')
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">Product Approvals</p>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when your products are approved
                                    or rejected
                                </p>
                            </div>
                            <Switch
                                checked={settings.productApprovals}
                                onCheckedChange={() =>
                                    handleToggle('productApprovals')
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Marketing</h3>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-muted-foreground">
                                    Receive promotional emails and special
                                    offers
                                </p>
                            </div>
                            <Switch
                                checked={settings.marketingEmails}
                                onCheckedChange={() =>
                                    handleToggle('marketingEmails')
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium">
                                    Newsletter Updates
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Receive our monthly newsletter with
                                    marketplace updates
                                </p>
                            </div>
                            <Switch
                                checked={settings.newsletterUpdates}
                                onCheckedChange={() =>
                                    handleToggle('newsletterUpdates')
                                }
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Preferences'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
