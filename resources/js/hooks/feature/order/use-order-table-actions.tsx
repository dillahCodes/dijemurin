import { router, usePage } from '@inertiajs/react';
import type { OrderPageProps } from '@/components/feature/order/order-data-section';
import { OrderTableEdit } from '@/components/feature/order/order-table-edit';
import { useModal } from '@/components/ui/modal';
import type { Order } from '@/types/feature/order/order';
import { show as orderDetailRoute } from '@/routes/order';

export function useOrderTableActions() {
    const modal = useModal();
    const { orderStatusOptions, orderTransitionRules, auth } = usePage<OrderPageProps>().props;

    const handleOpenEditModal = (order: Order) => () => {
        modal.open({
            id: `edit-order-${order.id}`,
            title: `Edit Order`,
            description: `Order ID: ${order.order_code}`,
            content: (
                <OrderTableEdit
                    userRole={auth.user.role}
                    order={order}
                    orderStatusOptions={orderStatusOptions}
                    orderTransitionRules={orderTransitionRules}
                />
            ),
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    const handleGoToShow = (order: Order) => () => {
        router.get(orderDetailRoute(order.id));
    };

    return { handleOpenEditModal, handleGoToShow };
}
