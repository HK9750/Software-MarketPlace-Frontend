/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAccessToken from '@/lib/accessToken';
import { fetchUserProfile } from '@/hooks/useFetchProfile';
import { useDispatch } from 'react-redux';
import { login } from '@/redux-store/authSlice';

interface NotificationPanelProps {
    notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    notifications,
}) => {
    const dispatch = useDispatch();
    const access_token = useAccessToken();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const onMarkAsRead = async (id: string) => {
        try {
            await axios.put<{ success: boolean }>(
                `${backendUrl}/notifications/read/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            fetchUserProfile(access_token).then((res: any) => {
                            console.log(res);
                            dispatch(login(res.user));
                        });
        } catch (error) {
            console.error('Error :', error);
        }
    };

    const handleClick = (notification: Notification) => {
        if (notification?.software) {
            router.push(`/products/${notification?.software?.id}`);
        }
    };
    return (
        <div className="w-80 bg-background border rounded-md shadow-lg">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
            </div>
            <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border-b last:border-b-0 ${
                                notification.isRead
                                    ? 'bg-background'
                                    : 'bg-blue-50 dark:bg-blue-900/20'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {!notification.isRead && (
                                    <Circle className="h-2 w-2 mt-2 flex-shrink-0 fill-blue-500 text-blue-500" />
                                )}
                                <div className="flex-1">
                                    <button
                                        onClick={() =>
                                            handleClick(notification)
                                        }
                                        className={`text-sm cursor-pointer ${notification.isRead ? 'text-muted-foreground' : 'font-medium text-foreground'}`}
                                    >
                                        <p className="text-start">
                                            {notification.message}
                                        </p>
                                    </button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(
                                            new Date(notification.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                    {!notification.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-blue-500 hover:text-blue-700 p-0 h-auto font-normal"
                                            onClick={() =>
                                                onMarkAsRead(notification.id)
                                            }
                                        >
                                            Mark as read
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
};

export default NotificationPanel;
