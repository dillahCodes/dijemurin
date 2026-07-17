import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { AccidentTypeOption, OrderComboboxItem, OrderItemComboboxItem } from '@/types/feature/accident/accident';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { ApiResponse } from '@/types/response';
import { AccidentTambahForm } from './accident-tambah-form';
import { AccidentTambahHeader } from './accident-tambah-header';

export type AccidentTambahSectionProps = {
    outlets: LaravelPaginator<Outlet>;
    outletSelected: ApiResponse<Outlet> | null;
    orders: ApiResponse<OrderComboboxItem[]>;
    orderItems: ApiResponse<OrderItemComboboxItem[]>;
    accidentTypeOptions: AccidentTypeOption[];
};

export function AccidentTambahSection() {
    return (
        <div className="flex flex-col gap-6">
            <AccidentTambahHeader />
            <div className="w-full max-w-3xl rounded-md border bg-card p-6 shadow-sm">
                <AccidentTambahForm />
            </div>
        </div>
    );
}
