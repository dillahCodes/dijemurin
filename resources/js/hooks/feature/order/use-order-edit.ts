import { useModal } from '@/components/ui/modal';
import order from '@/routes/order';
import { Order, OrderStatusEnglish } from '@/types/feature/order';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function useOrderEdit(orderData: Order) {
    const modal = useModal();
    const [statusValue, setStatusValue] = useState<OrderStatusEnglish>(orderData.status.value);
    const { setData, patch, clearErrors, processing } = useForm({ status: statusValue });

    const hasPickedUp = orderData.status.value === 'picked up';
    const hasCancelled = orderData.status.value === 'cancelled';

    const shouldDisableStatusSelect = hasPickedUp || hasCancelled;
    const shouldDisableSaveButton = statusValue === orderData.status.value || processing;

    const handleCloseModal = () => {
        clearErrors();
        modal.close(`edit-order-${orderData.id}`);
    };

    const handleStatusChange = (value: OrderStatusEnglish) => {
        setData('status', value);
        setStatusValue(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch(order.update(orderData.id).url, {
            onSuccess: () => {
                clearErrors();
                modal.close(`edit-order-${orderData.id}`);
                toast.success('Order berhasil diupdate', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal mengupdate order', { position: 'top-center' });
            },
        });
    };

    return {
        processing,
        handleCloseModal,
        handleStatusChange,
        shouldDisableSaveButton,
        statusValue,
        handleSubmit,
        shouldDisableStatusSelect,
    };
}
