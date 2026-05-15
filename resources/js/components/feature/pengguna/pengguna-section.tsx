import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { User, UserTransitionRules } from '@/types/feature/user/user';
import type { ApiResponse } from '@/types/response';
import { PenggunaFilters } from './pengguna-filters';
import { PenggunaHeader } from './pengguna-header';
import { PenggunaTable } from './pengguna-table';
import { PenggunaTablePagination } from './pengguna-table-pagination';

export type PenggunaFilterPageProps = {
    search?: string;
    role?: string;
    status?: string;
    outletIdSelected?: number;
    outletSearch?: string;
};

export type PenggunaSectionProps = {
    userRoleOptions: User['role'][];
    userStatusOptions: User['status'][];
    userTransitionRules: UserTransitionRules;
    filters: PenggunaFilterPageProps;
    users: LaravelPaginator<User>;
    outlets: LaravelPaginator<Outlet>;
    outletSelected: ApiResponse<Outlet>;
};

export function PenggunaSection() {
    return (
        <div className="flex flex-col gap-6">
            <PenggunaHeader />
            <PenggunaFilters />
            <div className="rounded-md border">
                <PenggunaTable />
            </div>
            <PenggunaTablePagination />
        </div>
    );
}
