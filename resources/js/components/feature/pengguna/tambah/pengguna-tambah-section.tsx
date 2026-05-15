import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { User } from '@/types/feature/user/user';
import { PenggunaTambahForm } from './pengguna-tambah-form';
import { PenggunaTambahHeader } from './pengguna-tambah-header';

export type PenggunaTambahPageProps = {
    outlets: LaravelPaginator<Outlet>;
    userRoleOptions: User['role'][];
};

export function PenggunaTambahSection() {
    return (
        <div className="flex flex-col gap-6">
            <PenggunaTambahHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <PenggunaTambahForm />
            </div>
        </div>
    );
}
