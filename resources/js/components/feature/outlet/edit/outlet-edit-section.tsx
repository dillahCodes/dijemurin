import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { OutletDetail, OutletStatus } from '@/types/feature/outlet/outlet';
import type { User } from '@/types/feature/user/user';
import type { ApiResponse } from '@/types/response';
import { OutletEditForm } from './outlet-edit-form';
import { OutletEditHeader } from './outlet-edit-header';

export type OutletEditSectionProps = {
    usersSearch: LaravelPaginator<User>;
    outletDetail: ApiResponse<OutletDetail>;
    outletStatusOptions: OutletStatus[];
};

export function OutletEditSection() {
    return (
        <div className="flex flex-col gap-6">
            <OutletEditHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <OutletEditForm />
            </div>
        </div>
    );
}
