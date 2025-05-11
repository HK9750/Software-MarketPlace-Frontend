'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import useAccessToken from '@/lib/accessToken';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Info, Copy, ExternalLink } from 'lucide-react';

// Define types based on your API response
interface Software {
    id: string;
    name: string;
    description: string;
    logo?: string;
}

interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
}

interface Subscription {
    id: string;
    software: Software;
    subscriptionPlan: SubscriptionPlan;
    startDate: string;
    endDate: string;
}

interface License {
    id: string;
    key: string;
    isActive: boolean;
    isExpired: boolean;
    activatedAt?: string;
    validUntil: string;
    subscription: Subscription;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: License[];
}

export default function LicensesPage() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [activeLicenses, setActiveLicenses] = useState<License[]>([]);
    const [expiredLicenses, setExpiredLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLicense, setSelectedLicense] = useState<License | null>(
        null
    );
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const access_token = useAccessToken();

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    useEffect(() => {
        if (access_token) {
            fetchLicenses();
        }
    }, [access_token]);

    // Helper function to validate if a license is truly active
    const isLicenseActive = (license: License) => {
        const now = new Date();
        const validUntil = new Date(license.validUntil);
        return license.isActive && !license.isExpired && validUntil > now;
    };

    const fetchLicenses = async () => {
        setLoading(true);
        try {
            // First get all licenses
            const allResponse = await api.get<ApiResponse>('/licenses');
            const allLicenses = allResponse.data.data;

            // We'll use our own logic to filter active and expired licenses to ensure consistency
            const active = allLicenses.filter((license) =>
                isLicenseActive(license)
            );
            const expired = allLicenses.filter(
                (license) => !isLicenseActive(license)
            );

            setLicenses(allLicenses);
            setActiveLicenses(active);
            setExpiredLicenses(expired);
            setError(null);

            // Log any inconsistencies for debugging
            const activeFromApi =
                await api.get<ApiResponse>('/licenses/active');
            const expiredFromApi =
                await api.get<ApiResponse>('/licenses/expired');

            console.log(
                `Client-side active: ${active.length}, API active: ${activeFromApi.data.data.length}`
            );
            console.log(
                `Client-side expired: ${expired.length}, API expired: ${expiredFromApi.data.data.length}`
            );
        } catch (err) {
            setError('Failed to fetch licenses. Please try again later.');
            toast.error('Failed to fetch licenses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('License key copied to clipboard!');
    };

    const openLicenseDetails = (license: License) => {
        setSelectedLicense(license);
        setDetailsOpen(true);
    };

    const LicenseTable = ({ data }: { data: License[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Software</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                        >
                            No licenses found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((license) => (
                        <TableRow key={license.id}>
                            <TableCell className="font-medium">
                                {license.subscription.software.name}
                            </TableCell>
                            <TableCell>
                                {license.subscription.subscriptionPlan.name}
                            </TableCell>
                            <TableCell>
                                {isLicenseActive(license) ? (
                                    <Badge
                                        variant="default"
                                        className="bg-green-500"
                                    >
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">Expired</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {formatDate(license.validUntil)}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(license.key)
                                        }
                                    >
                                        <Copy className="h-4 w-4 mr-1" /> Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            openLicenseDetails(license)
                                        }
                                    >
                                        <Info className="h-4 w-4 mr-1" />{' '}
                                        Details
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Licenses</h1>
                <Button
                    onClick={fetchLicenses}
                    variant="outline"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />{' '}
                            Refreshing...
                        </>
                    ) : (
                        'Refresh'
                    )}
                </Button>
            </div>

            {error && (
                <Card className="mb-6 border-red-300">
                    <CardContent className="pt-6 text-red-500">
                        {error}
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="all">
                        All Licenses ({licenses.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        Active Licenses ({activeLicenses.length})
                    </TabsTrigger>
                    <TabsTrigger value="expired">
                        Expired Licenses ({expiredLicenses.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Licenses</CardTitle>
                            <CardDescription>
                                View all your software licenses in one place
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <LicenseTable data={licenses} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Licenses</CardTitle>
                            <CardDescription>
                                Your currently active software licenses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <LicenseTable data={activeLicenses} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expired">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expired Licenses</CardTitle>
                            <CardDescription>
                                Your expired or inactive software licenses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <LicenseTable data={expiredLicenses} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* License Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                {selectedLicense && (
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>License Details</DialogTitle>
                            <DialogDescription>
                                Details for your{' '}
                                {selectedLicense.subscription.software.name}{' '}
                                license
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-medium">Software:</div>
                                <div className="col-span-2">
                                    {selectedLicense.subscription.software.name}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-medium">License Key:</div>
                                <div className="col-span-2 flex items-center">
                                    <code className="bg-muted px-2 py-1 rounded text-sm mr-2">
                                        {selectedLicense.key}
                                    </code>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                            copyToClipboard(selectedLicense.key)
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-medium">Plan:</div>
                                <div className="col-span-2">
                                    {
                                        selectedLicense.subscription
                                            .subscriptionPlan.name
                                    }
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-medium">Status:</div>
                                <div className="col-span-2">
                                    {isLicenseActive(selectedLicense) ? (
                                        <Badge
                                            variant="default"
                                            className="bg-green-500"
                                        >
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            Expired
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-medium">Valid Until:</div>
                                <div className="col-span-2">
                                    {formatDate(selectedLicense.validUntil)}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetailsOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
