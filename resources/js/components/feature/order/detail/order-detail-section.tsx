import type { OrderDetail } from '@/types/feature/order';
import type { ApiResponse } from '@/types/response';
import { usePage } from '@inertiajs/react';
import { OrderDetailHeader } from './order-detail-header';
import { OrderInfo } from './order-info';
import { OrderItems } from './order-items';
import { OrderPayment } from './order-payment';

export type OrderDetailPageProps = {
    detailOrder: ApiResponse<OrderDetail>;
};

export function OrderDetailSection() {
    const { detailOrder } = usePage<OrderDetailPageProps>().props;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <OrderDetailHeader />
            </div>

            <div className="flex flex-col gap-6">
                <OrderInfo order={detailOrder.data} />
                <OrderItems items={detailOrder.data.order_items} />
                <OrderPayment order={detailOrder.data} />
            </div>
        </div>
    );
}
