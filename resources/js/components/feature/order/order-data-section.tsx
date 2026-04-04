import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Order } from '@/types/feature/order';
import { OrderDataHeader } from './order-data--header';
import { OrderFilters } from './order-filters';
import { OrderTable } from './order-table';
import { OrderTablePagination } from './order-table-pagination';

export type OrderOption = {
    label: string;
    value: string;
};

export type OrderFilterPageProps = {
    search: string;
    status: string;
    payment_method: string;
    start_date: string;
    end_date: string;
};

export type OrderPageProps = {
    orderStatusOptions: OrderOption[];
    paymentMethodOptions: OrderOption[];
    filters: OrderFilterPageProps;
    orders: LaravelPaginator<Order>;
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
