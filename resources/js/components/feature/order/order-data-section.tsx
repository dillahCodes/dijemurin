import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Order, OrderTransitionRules } from '@/types/feature/order/order';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { ApiResponse } from '@/types/response';
import { OrderDataHeader } from './order-data--header';
import { OrderFilters } from './order-filters';
import { OrderTable } from './order-table';
import { OrderTablePagination } from './order-table-pagination';

export type OrderOption = {
    label: string;
    value: string;
};

export type OrderFilterPageProps = {
    search?: string;
    status?: string | string[];
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    timeStatus?: string;
    dateType?: string;
    outletIdSelected?: number;
    outletSearch?: string;
};

export type OrderPageProps = {
    orderStatusOptions: OrderOption[];
    orderTimeStatusOptions: OrderOption[];
    orderDateTypeOptions: OrderOption[];
    paymentMethodOptions: OrderOption[];
    orderTransitionRules: OrderTransitionRules;
    filters: OrderFilterPageProps;
    orders: LaravelPaginator<Order>;
    outlets: LaravelPaginator<Outlet>;
    outletSelected: ApiResponse<Outlet>;
};

export function OrderDataSection() {
    return (
        <div className="flex flex-col gap-6">
            <OrderDataHeader />
            <OrderFilters />
            <div className="rounded-md border">
                <OrderTable />
            </div>
            <OrderTablePagination />
        </div>
    );
}
