import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { LayananTambahForm } from './layanan-tambah-form';
import { LayananTambahHeader } from './layanan-tambah-header';

export type LayananTambahSectionProps = {
    outlets: LaravelPaginator<Outlet>;
};

export function LayananTambahSection() {
    return (
        <div className="flex flex-col gap-6">
            <LayananTambahHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <LayananTambahForm />
            </div>
        </div>
    );
}
