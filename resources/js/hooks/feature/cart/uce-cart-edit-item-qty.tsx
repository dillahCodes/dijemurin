import { OrderItemSetQty } from '@/components/feature/cart/order-item-set-qty';
import { useModal } from '@/components/ui/modal';
import type { CartItemType } from '@/context/feature/cart/cart-context';

interface UseCartEditItemQtyProps {
    item: CartItemType;
}

export function useCartEditItemQty({ item }: UseCartEditItemQtyProps) {
    const modal = useModal();
    const modalId = `modal-edit-service-item-${item.data.id}`;

    const handleCloseModal = () => modal.close(modalId);

    const baseConfig = {
        content: (
            <OrderItemSetQty
                mode="SET_QTY"
                item={item.data}
                defaultQty={item.qty}
                onCancel={handleCloseModal}
                afterSubmit={handleCloseModal}
            />
        ),
    };

    const handleOpenModalEdit = () => {
        modal.open({
            ...baseConfig,
            id: modalId,
            title: 'Edit Kuantitas',
            description: 'Isi form untuk mengedit kuantitas.',
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    return { handleOpenModalEdit };
}
