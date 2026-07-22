import type { OutletDetail } from '@/types/feature/outlet/outlet';
import type { ApiResponse } from '@/types/response';
import { OutletDetailHeader } from './outlet-detail-header';
import { OutletInfo } from './outlet-detail-info';
import { OutletDetailUsers } from './outlet-detail-users';

export type OutletDetailPageProps = {
    outletDetail: ApiResponse<OutletDetail>;
};

export function OutletDetailSection() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <OutletDetailHeader />
            </div>

            <div className="flex flex-col gap-6">
                <OutletInfo />
                <OutletDetailUsers />
            </div>
        </div>
    );
}
