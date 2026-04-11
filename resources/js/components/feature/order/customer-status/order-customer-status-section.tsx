import { usePage } from '@inertiajs/react';
import type { OrderDetail } from '@/types/feature/order';
import type { ApiResponse } from '@/types/response';
import { OrderCustomerStatusInfo } from './order-customer-status-info';
import { OrderCustomerStatusItems } from './order-customer-status-items';
import { OrderCustomerStatusPayment } from './order-customer-status-payment';

export type OrderCustomerStatusPageProps = {
    orderDetail: ApiResponse<OrderDetail>;
};

export function OrderCustomerStatusSection() {
    const { orderDetail } = usePage<OrderCustomerStatusPageProps>().props;

    return (
        <div className="flex w-full max-w-3xl flex-col gap-6">
            <div className="flex flex-col gap-6">
                <OrderCustomerStatusInfo order={orderDetail.data} />
                <OrderCustomerStatusItems items={orderDetail.data.order_items} />
                <OrderCustomerStatusPayment order={orderDetail.data} />
            </div>
        </div>
    );
}
