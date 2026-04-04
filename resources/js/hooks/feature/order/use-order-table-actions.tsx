import { router, usePage } from '@inertiajs/react';
import type { OrderPageProps } from '@/components/feature/order/order-data-section';
import { OrderTableEdit } from '@/components/feature/order/order-table-edit';
import { useModal } from '@/components/ui/modal';
import { show as orderDetailRoute } from '@/routes/order';
import type { Order } from '@/types/feature/order';

export function useOrderTableActions() {
    const modal = useModal();
    const { orderStatusOptions } = usePage<OrderPageProps>().props;

    const handleOpenEditModal = (order: Order) => () => {
        modal.open({
            id: `edit-order-${order.id}`,
            title: `Edit Order`,
            description: `Order ID: ${order.order_code}`,
            content: <OrderTableEdit order={order} orderStatusOptions={orderStatusOptions} />,
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    const handleGoToShow = (order: Order) => () => {
        router.get(orderDetailRoute(order.id));
    };

    return { handleOpenEditModal, handleGoToShow };
}
