import { LaravelPaginator } from '@/hooks/use-pagination';
import { Outlet } from '@/types/feature/outlet/outlet';
import { OutletFilters } from './outlet-filters';
import { OutletHeader } from './outlet-header';
import { OutletTable } from './outlet-table';
import { OutletTablePagination } from './outlet-table-pagination';

export type OutletFilterPageProps = {
    search: string;
    status: string;
};

export type OutletSectionProps = {
    outlets: LaravelPaginator<Outlet>;
    filters: OutletFilterPageProps;
    outletStatusOptions: Outlet['status'][];
};

export function OutletSection() {
    return (
        <div className="flex flex-col gap-6">
            <OutletHeader />
            <OutletFilters />
            <div className="rounded-md border">
                <OutletTable />
            </div>
            <OutletTablePagination />
        </div>
    );
}
