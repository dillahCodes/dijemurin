import { usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderPrintReceipt } from '@/hooks/feature/order/use-order-print-receipt';
import type { OrderDetail } from '@/types/feature/order';
import type { ApiResponse } from '@/types/response';
import { OrderDetailHeader } from './order-detail-header';
import { OrderInfo } from './order-info';
import { OrderItems } from './order-items';
import { OrderPayment } from './order-payment';
import { OrderPrintReceiptSection } from './order-print-receipt';

export type OrderDetailPageProps = {
    detailOrder: ApiResponse<OrderDetail>;
};

export function OrderDetailSection() {
    const { detailOrder } = usePage<OrderDetailPageProps>().props;
    const { handlePrint } = useOrderPrintReceipt(detailOrder.data);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start print:hidden">
                <OrderDetailHeader />
                <Button onClick={handlePrint}>
                    <Printer />
                    Cetak Struk
                </Button>
            </div>

            <div className="flex flex-col gap-6 print:hidden">
                <OrderInfo order={detailOrder.data} />
                <OrderItems items={detailOrder.data.order_items} />
                <OrderPayment order={detailOrder.data} />
            </div>

            <OrderPrintReceiptSection order={detailOrder.data} />
        </div>
    );
}
