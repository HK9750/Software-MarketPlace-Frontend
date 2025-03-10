import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function ProductsHeader() {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Product Management</CardTitle>
                        <CardDescription>
                            View and manage all products on the marketplace
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
