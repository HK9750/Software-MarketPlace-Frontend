// UsersTableSkeleton.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function UsersTableSkeleton() {
    // Generate 5 skeleton rows for better UX
    const skeletonRows = Array(5).fill(null);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {skeletonRows.map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end">
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
