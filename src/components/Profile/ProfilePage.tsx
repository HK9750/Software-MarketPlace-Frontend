'use client';

import type React from 'react';

import { useState } from 'react';
import {
    User,
    MapPin,
    Phone,
    Mail,
    Globe,
    Edit,
    Check,
    X,
    ShieldCheck,
    UserCog,
    EyeOff,
    Eye,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Address, SessionUser } from '@/types/types';
import axios from 'axios';
import BackButton from '../BackButton';
import { toast } from 'sonner';
import useAccessToken from '@/lib/accessToken';

interface ProfilePageProps {
    userData: SessionUser;
}

export default function ProfilePage({ userData }: ProfilePageProps) {
    const [user, setUser] = useState<SessionUser>(userData);
    const [editMode, setEditMode] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [changepassword, setChangePassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const access_token = useAccessToken();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
        phone: user?.profile?.phone,
        address:
            typeof user?.profile?.address === 'string'
                ? user?.profile?.address
                : JSON.stringify(user?.profile?.address, null, 2),
        websiteLink: user.sellerProfile?.websiteLink || '',
    });

    const [originalFormData] = useState({
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
        phone: user?.profile?.phone,
        address:
            typeof user?.profile?.address === 'string'
                ? user?.profile?.address
                : JSON.stringify(user?.profile?.address, null, 2),
        websiteLink: user.sellerProfile?.websiteLink || '',
    });

    const hasChanges = () => {
        return (
            formData.firstName !== originalFormData.firstName ||
            formData.lastName !== originalFormData.lastName ||
            formData.phone !== originalFormData.phone ||
            formData.address !== originalFormData.address ||
            formData.websiteLink !== originalFormData.websiteLink
        );
    };

    const formatAddress = (address: Address | string): string => {
        if (typeof address === 'string') {
            return address;
        }

        try {
            const parts = [];
            if (address.street) parts.push(address.street);
            if (address.city) parts.push(address.city);
            if (address.state) parts.push(address.state);
            if (address.zip) parts.push(address.zip);
            if (address.country) parts.push(address.country);

            return parts.join(', ');
        } catch {
            return JSON.stringify(address);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveAll = async () => {
        if (!hasChanges()) return;

        try {
            setUpdating(true);
            const changedFields: Partial<
                SessionUser['profile'] & { websiteLink?: string }
            > = {};

            if (formData.firstName !== originalFormData.firstName) {
                changedFields.firstName = formData.firstName;
            }
            if (formData.lastName !== originalFormData.lastName) {
                changedFields.lastName = formData.lastName;
            }
            if (formData.phone !== originalFormData.phone) {
                changedFields.phone = formData.phone;
            }
            if (formData.address !== originalFormData.address) {
                try {
                    const parsedAddress = JSON.parse(formData.address);
                    changedFields.address = parsedAddress;
                } catch {
                    changedFields.address = formData.address;
                }
            }
            if (formData.websiteLink !== originalFormData.websiteLink) {
                changedFields.websiteLink = formData.websiteLink;
            }

            console.log('Changed fields payload:', changedFields);

            const response = await axios.put<{
                success: boolean;
                data: SessionUser;
            }>(`${backendUrl}/profile/update`, changedFields, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (response.data.success) {
                setUser(response.data.data);
                setEditMode(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.profile?.firstName,
            lastName: user?.profile?.lastName,
            phone: user?.profile?.phone,
            address:
                typeof user?.profile?.address === 'string'
                    ? user?.profile?.address
                    : JSON.stringify(user?.profile?.address, null, 2),
            websiteLink: user?.sellerProfile?.websiteLink || '',
        });

        setEditMode(false);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords donot match');
            return;
        }

        try {
            const response = await axios.put<{
                success: boolean;
            }>(
                `${backendUrl}/auth/change-password`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            if (response.data.success) {
                setChangePassword(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                toast.success('Password changed successfully');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            toast.error('Error changing password');
        }
    };

    const getUserInitials = () => {
        return `${user?.profile?.firstName[0]}${user?.profile?.lastName[0]}`;
    };

    return (
        <div className="container mx-auto py-8 px-8">
            <BackButton className="mb-6" />
            <div className="">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    <Avatar className="h-24 w-24">
                        <AvatarImage
                            src={user?.profile?.avatar || ''}
                            alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                        />
                        <AvatarFallback className="text-2xl">
                            {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                            <Badge variant="outline" className="text-sm">
                                @{user.username}
                            </Badge>
                            <Badge className="bg-primary text-primary-foreground">
                                {user.role}
                            </Badge>
                            {user.sellerProfile?.verified && (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 flex items-center gap-1"
                                >
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified Seller
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </p>
                    </div>

                    {/* Edit/Save/Cancel Buttons */}
                    <div className="flex gap-2">
                        {!editMode ? (
                            <Button
                                variant="outline"
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveAll}
                                    className="flex items-center gap-2"
                                    disabled={!hasChanges()}
                                >
                                    <Check className="h-4 w-4" />
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Your personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!editMode ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                Name:
                                            </span>
                                            <span>
                                                {user?.profile?.firstName}{' '}
                                                {user?.profile?.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                Phone:
                                            </span>
                                            <span>{user.profile.phone}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="firstName"
                                                    className="text-sm font-medium"
                                                >
                                                    First Name
                                                </label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="lastName"
                                                    className="text-sm font-medium"
                                                >
                                                    Last Name
                                                </label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="phone"
                                                className="text-sm font-medium"
                                            >
                                                Phone Number
                                            </label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                                <CardDescription>
                                    Your shipping and billing address
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!editMode ? (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <span>
                                            {formatAddress(
                                                user.profile.address
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="address"
                                            className="text-sm font-medium"
                                        >
                                            Address (JSON or string format)
                                        </label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={5}
                                            className="font-mono text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            You can enter a simple address
                                            string or a JSON object with fields
                                            like street, city, state, etc.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Seller Information (conditional) */}
                        {user.role === 'SELLER' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Seller Information</CardTitle>
                                    <CardDescription>
                                        Your seller profile details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!editMode ? (
                                        <div className="space-y-4">
                                            {user.sellerProfile?.verified && (
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">
                                                        Verification Status:
                                                    </span>
                                                    <span className="text-green-600">
                                                        Verified
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    Website:
                                                </span>
                                                <a
                                                    href={`${user.sellerProfile?.websiteLink}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {user.sellerProfile
                                                        ?.websiteLink ||
                                                        'Not provided'}
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="websiteLink"
                                                className="text-sm font-medium"
                                            >
                                                Website Link
                                            </label>
                                            <Input
                                                id="websiteLink"
                                                name="websiteLink"
                                                value={formData.websiteLink}
                                                onChange={handleInputChange}
                                                placeholder="example.com"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Account Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Type</CardTitle>
                                <CardDescription>
                                    Your account role
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Role:</span>
                                    <Badge>{user.role}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    Your account details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium">
                                        Username
                                    </span>
                                    <p className="text-sm text-muted-foreground">
                                        @{user.username}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">
                                        Email
                                    </span>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">
                                        Account ID
                                    </span>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {user.id}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        setChangePassword((prev) => !prev)
                                    }
                                >
                                    Change Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <Dialog
                        open={changepassword}
                        onOpenChange={setChangePassword}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                    Enter your current password and a new
                                    password to update your credentials.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="oldPassword"
                                        className="text-sm font-medium"
                                    >
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="oldPassword"
                                            type={
                                                showOldPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={oldPassword}
                                            onChange={(e) =>
                                                setOldPassword(e.target.value)
                                            }
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowOldPassword(
                                                    !showOldPassword
                                                )
                                            }
                                        >
                                            {showOldPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="newPassword"
                                        className="text-sm font-medium"
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Password must be at least 6 characters
                                        long.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium"
                                    >
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setChangePassword(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={
                                        !oldPassword ||
                                        !newPassword ||
                                        !confirmPassword
                                    }
                                >
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Update Password
                                    </>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
