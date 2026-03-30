import { OrderItemSetQty } from '@/components/feature/cart/order-item-set-qty';
import { useModal } from '@/components/ui/modal';
import type { ServiceItem } from '@/types/feature/layanan';

interface UseCartAddItemProps {
    item: ServiceItem;
}

export function useCartAddItem({ item }: UseCartAddItemProps) {
    const modal = useModal();

    const modalId = `service-item-modal-${item.id}`;

    const handleOpenModalAddItem = () => {
        modal.open({
            id: modalId,
            title: 'Buat Pesanan',
            description: 'Lengkapi form untuk membuat pesanan',
            content: (
                <OrderItemSetQty
                    mode="SET_ITEM"
                    item={item}
                    afterSubmit={() => modal.close(modalId)}
                    onCancel={() => modal.close(modalId)}
                />
            ),
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    return {
        handleOpenModalAddItem,
    };
}
