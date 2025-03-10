import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function RecentSales() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 12 sales this week</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {[
                        {
                            name: 'Olivia Martin',
                            email: 'olivia.martin@email.com',
                            amount: '+$1,999.00',
                            product: 'DesignPro Studio',
                        },
                        {
                            name: 'Jackson Lee',
                            email: 'jackson.lee@email.com',
                            amount: '+$39.00',
                            product: 'CloudSync Storage',
                        },
                        {
                            name: 'Isabella Nguyen',
                            email: 'isabella.nguyen@email.com',
                            amount: '+$299.00',
                            product: 'SecureShield Pro',
                        },
                        {
                            name: 'William Kim',
                            email: 'will@email.com',
                            amount: '+$99.00',
                            product: 'CodeMaster IDE',
                        },
                        {
                            name: 'Sofia Davis',
                            email: 'sofia.davis@email.com',
                            amount: '+$39.00',
                            product: 'TaskFlow Manager',
                        },
                    ].map((sale, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    {sale.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {sale.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {sale.email}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {sale.product}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">
                                {sale.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
