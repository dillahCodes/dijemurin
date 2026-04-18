import { LaravelPaginator } from '@/hooks/use-pagination';
import { User, UserTransitionRules } from '@/types/feature/user/user';
import { PenggunaFilters } from './pengguna-filters';
import { PenggunaHeader } from './pengguna-header';
import { PenggunaTable } from './pengguna-table';
import { PenggunaTablePagination } from './pengguna-table-pagination';

export type PenggunaFilterPageProps = {
    search: string;
    role: string;
    status: string;
};

export type PenggunaSectionProps = {
    userRoleOptions: User['role'][];
    userStatusOptions: User['status'][];
    userTransitionRules: UserTransitionRules;
    filters: PenggunaFilterPageProps;
    users: LaravelPaginator<User>;
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
