'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAccessToken from '@/lib/accessToken';
import { toast } from 'sonner';

// shadcn imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertCircle,
    Key,
    Calendar,
    RefreshCcw,
    XCircle,
    CheckCircle,
    Info,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Types
interface LicenseKey {
    id: string;
    key: string;
    validUntil: string;
    createdAt: string;
    isExpired: boolean;
    isActive: boolean;
    redeemedAt: string | null;
    subscription: {
        software: {
            id: string;
            name: string;
            description: string;
        };
        subscriptionPlan: {
            id: string;
            name: string;
            duration: number;
        };
    };
}

const LicensesPage: React.FC = () => {
    const access_token = useAccessToken();
    const [licenses, setLicenses] = useState<LicenseKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activationKey, setActivationKey] = useState<string>('');
    const [selectedLicense, setSelectedLicense] = useState<LicenseKey | null>(
        null
    );
    const [activating, setActivating] = useState<boolean>(false);
    const [renewing, setRenewing] = useState<boolean>(false);
    const [deactivating, setDeactivating] = useState<boolean>(false);

    // API configuration with auth token
    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Fixed typo in env variable name
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    // Fetch user's licenses
    const fetchLicenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: any = await api.get('/licenses');
            setLicenses(response.data.data || []); // Ensure we always set an array
        } catch (error: any) {
            console.error('Error fetching licenses:', error);
            setError('Failed to load your licenses. Please try again later.');
            toast.error('Failed to load your licenses');
            // Initialize licenses as an empty array if there's an error
            setLicenses([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle license activation
    const handleActivateLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activationKey.trim()) {
            toast.error('Please enter a license key');
            return;
        }

        try {
            setActivating(true);
            const response: any = await api.post('/licenses/activate', {
                key: activationKey,
            });

            if (response.data.success) {
                toast.success('License activated successfully');
                setActivationKey('');
                fetchLicenses(); // Refresh licenses
            } else {
                toast.error(
                    response.data.message || 'Failed to activate license'
                );
            }
        } catch (error: any) {
            console.error('Error activating license:', error);
            toast.error(
                error.response?.data?.message || 'Failed to activate license'
            );
        } finally {
            setActivating(false);
        }
    };

    // Handle license deactivation
    const handleDeactivateLicense = async (licenseId: string) => {
        try {
            setDeactivating(true);
            const response: any = await api.patch(
                `/licenses/${licenseId}/deactivate`
            );

            if (response.data.success) {
                toast.success('License deactivated successfully');
                fetchLicenses(); // Refresh licenses
            } else {
                toast.error(
                    response.data.message || 'Failed to deactivate license'
                );
            }
        } catch (error: any) {
            console.error('Error deactivating license:', error);
            toast.error(
                error.response?.data?.message || 'Failed to deactivate license'
            );
        } finally {
            setDeactivating(false);
        }
    };

    // Handle license renewal
    const handleRenewLicense = async (licenseId: string) => {
        try {
            setRenewing(true);
            const response: any = await api.patch(
                `/licenses/${licenseId}/renew`
            );

            if (response.data.success) {
                toast.success('License renewed successfully');
                fetchLicenses(); // Refresh licenses
            } else {
                toast.error(response.data.message || 'Failed to renew license');
            }
        } catch (error: any) {
            console.error('Error renewing license:', error);
            toast.error(
                error.response?.data?.message || 'Failed to renew license'
            );
        } finally {
            setRenewing(false);
        }
    };

    // Show license details
    const handleShowDetails = (license: LicenseKey) => {
        setSelectedLicense(license);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Load licenses on component mount
    useEffect(() => {
        if (access_token) {
            fetchLicenses();
        }
    }, [access_token]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Software Licenses</h1>

            {/* License Activation Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Activate New License</CardTitle>
                    <CardDescription>
                        Enter your license key below to activate it
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleActivateLicense}
                        className="flex gap-4"
                    >
                        <Input
                            type="text"
                            value={activationKey}
                            onChange={(e) => setActivationKey(e.target.value)}
                            placeholder="Enter license key"
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={activating}
                            className="whitespace-nowrap"
                        >
                            {activating ? 'Activating...' : 'Activate License'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Licenses List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <Card key={item} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-1/2 mb-2" />
                                <Skeleton className="h-3 w-1/3" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-3 w-full mb-2" />
                                <Skeleton className="h-3 w-2/3" />
                            </CardContent>
                            <CardFooter className="bg-gray-50 flex justify-between border-t">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-20" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : licenses.length === 0 ? (
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-center">
                            No Licenses Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-500">
                        <p>
                            You don't have any active licenses yet. Purchase
                            software or activate a license key above.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {licenses.map((license) => (
                        <Card key={license.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">
                                        {license.subscription.software.name}
                                    </CardTitle>
                                    <Badge
                                        variant={
                                            license.isActive &&
                                            !license.isExpired
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        {license.isActive && !license.isExpired
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {license.subscription.subscriptionPlan.name}{' '}
                                    Plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Key className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="font-medium mr-2">
                                            Key:
                                        </span>
                                        {license.key.substring(0, 5)}...
                                        {license.key.substring(
                                            license.key.length - 5
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="font-medium mr-2">
                                            Expires:
                                        </span>
                                        {formatDate(license.validUntil)}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 flex justify-between border-t">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleShowDetails(license)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                                <div className="flex gap-2">
                                    {license.isActive && !license.isExpired && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleDeactivateLicense(
                                                    license.id
                                                )
                                            }
                                            disabled={deactivating}
                                            className="text-red-600 hover:text-red-800 border-red-200"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Deactivate
                                        </Button>
                                    )}
                                    {license.isExpired && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleRenewLicense(license.id)
                                            }
                                            disabled={renewing}
                                            className="text-green-600 hover:text-green-800 border-green-200"
                                        >
                                            <RefreshCcw className="h-4 w-4 mr-2" />
                                            Renew
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* License Details Dialog */}
            <Dialog
                open={!!selectedLicense}
                onOpenChange={(open) => !open && setSelectedLicense(null)}
            >
                {selectedLicense && (
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedLicense.subscription.software.name}{' '}
                                License
                            </DialogTitle>
                            <DialogDescription>
                                License details and management options
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">
                                    License Key
                                </h4>
                                <p className="text-sm bg-gray-50 p-2 rounded overflow-auto font-mono">
                                    {selectedLicense.key}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">
                                    Software
                                </h4>
                                <p className="text-sm">
                                    {
                                        selectedLicense.subscription.software
                                            .description
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                        Plan
                                    </h4>
                                    <p className="text-sm">
                                        {
                                            selectedLicense.subscription
                                                .subscriptionPlan.name
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                        Duration
                                    </h4>
                                    <p className="text-sm">
                                        {
                                            selectedLicense.subscription
                                                .subscriptionPlan.duration
                                        }{' '}
                                        months
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                        Status
                                    </h4>
                                    <div className="flex items-center">
                                        {selectedLicense.isActive &&
                                        !selectedLicense.isExpired ? (
                                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                        )}
                                        <p
                                            className={`text-sm ${selectedLicense.isActive && !selectedLicense.isExpired ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {selectedLicense.isActive &&
                                            !selectedLicense.isExpired
                                                ? 'Active'
                                                : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                        Expires On
                                    </h4>
                                    <p className="text-sm">
                                        {formatDate(selectedLicense.validUntil)}
                                    </p>
                                </div>
                            </div>

                            {selectedLicense.redeemedAt && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                                        First Activated
                                    </h4>
                                    <p className="text-sm">
                                        {formatDate(selectedLicense.redeemedAt)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">
                                    Purchase Date
                                </h4>
                                <p className="text-sm">
                                    {formatDate(selectedLicense.createdAt)}
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="flex justify-end gap-2">
                            {selectedLicense.isExpired && (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        handleRenewLicense(selectedLicense.id);
                                        setSelectedLicense(null);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Renew License
                                </Button>
                            )}

                            {selectedLicense.isActive &&
                                !selectedLicense.isExpired && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleDeactivateLicense(
                                                selectedLicense.id
                                            );
                                            setSelectedLicense(null);
                                        }}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Deactivate
                                    </Button>
                                )}

                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default LicensesPage;
