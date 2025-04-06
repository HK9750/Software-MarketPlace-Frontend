// UserFilters.tsx
import {
    Search,
    ChevronDown,
    UserIcon,
    ShieldCheck,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    roleFilter: string | null;
    setRoleFilter: (role: string | null) => void;
}

export default function UserFilters({
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
}: UserFiltersProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search users..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        {roleFilter ? `Filter: ${roleFilter}` : 'Filter'}{' '}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                        All Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter('CUSTOMER')}>
                        <UserIcon className="mr-2 h-4 w-4" /> Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter('SELLER')}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Seller
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter('ADMIN')}>
                        <Shield className="mr-2 h-4 w-4" /> Admin
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
