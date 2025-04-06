// UsersTable.tsx
import { User } from '@/types/user';
import { UserRow } from './UserRow';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface UsersTableProps {
    users: User[];
    verificationLoading: string | null;
    handleVerifySeller: (userId: string) => Promise<void>;
}

export default function UsersTable({
    users,
    verificationLoading,
    handleVerifySeller,
}: UsersTableProps) {
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
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            verificationLoading={verificationLoading}
                            handleVerifySeller={handleVerifySeller}
                        />
                    ))
                )}
            </TableBody>
        </Table>
    );
}
