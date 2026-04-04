import type { OrderDetail } from '@/types/feature/order';

export function useOrderPrintReceipt(order: OrderDetail) {
    const isCashPayment = Boolean(order.payment && order.payment.method === 'cash');

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = `Struk-Pesanan-${order.order_code}`;

        window.print();

        setTimeout(() => {
            document.title = originalTitle;
        }, 500);
    };

    return { isCashPayment, handlePrint };
}
