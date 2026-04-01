import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LaravelPaginator } from '@/hooks/feature/order/use-pagination';
import type { Order } from '@/types/feature/order';
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
        <Card className="flex flex-1 flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">Daftar Order</CardTitle>
                    <CardDescription>Kelola dan filter data pesanan laundry Anda.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-6 py-0!">
                <OrderFilters />
                <div className="rounded-md border">
                    <OrderTable />
                </div>
                <OrderTablePagination />
            </CardContent>
        </Card>
    );
}
