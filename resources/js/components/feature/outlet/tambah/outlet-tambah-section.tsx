import { LaravelPaginator } from '@/hooks/use-pagination';
import { OutletTambahForm } from './outlet-tambah-form';
import { OutletTambahHeader } from './outlet-tambah-header';
import { User } from '@/types/feature/user/user';

export type OutletTambahSectionProps = {
    users: LaravelPaginator<User>;
};

export function OutletTambahSection() {
    return (
        <div className="flex flex-col gap-6">
            <OutletTambahHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <OutletTambahForm />
            </div>
        </div>
    );
}
