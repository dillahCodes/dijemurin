import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { ServiceDetail } from '@/types/feature/layanan';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { LayananEditForm } from './layanan-edit-form';
import { LayananEditHeader } from './layanan-edit-header';

export type LayananEditSectionProps = {
    outlets: LaravelPaginator<Outlet>;
    service: ServiceDetail;
};

export function LayananEditSection() {
    return (
        <div className="flex flex-col gap-6">
            <LayananEditHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <LayananEditForm />
            </div>
        </div>
    );
}
