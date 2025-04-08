'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    label?: string;
    icon?: boolean;
    variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'link' | 'back';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    iconClassName?: string;
    onBack?: () => void;
}

export const BackButton = ({
    label = 'Back',
    icon = true,
    variant = 'back',
    size = 'default',
    className = '',
    iconClassName = '',
    onBack,
}: BackButtonProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <Button
            variant={variant === 'back' ? 'outline' : variant}
            size={size}
            onClick={handleBack}
            className={cn(
                'font-medium transition-all',
                size === 'sm' ? 'text-xs' : 'text-sm',
                className
            )}
        >
            {icon && (
                <ArrowLeft
                    className={cn(
                        'transition-transform',
                        size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
                        iconClassName
                    )}
                />
            )}
            {label}
        </Button>
    );
};
