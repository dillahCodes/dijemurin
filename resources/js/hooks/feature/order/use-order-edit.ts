import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import type { Order } from '@/types/feature/order/order';
import { OrderStatusEnglish } from '@/types/feature/order/order';
import order from '@/routes/order';

export function useOrderEdit(orderData: Order) {
    const modal = useModal();
    const [statusValue, setStatusValue] = useState<OrderStatusEnglish>(orderData.status.value);
    const { setData, patch, clearErrors, processing } = useForm({ status: statusValue });

    const orderStatus = orderData.status.value;
    const shouldShowWarning = [OrderStatusEnglish.PICKED_UP, OrderStatusEnglish.CANCELLED].includes(statusValue);
    const shouldDisableStatusSelect = [OrderStatusEnglish.PICKED_UP, OrderStatusEnglish.CANCELLED].includes(orderStatus);
    const shouldDisableSaveButton = statusValue === orderStatus || processing;

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
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError ?? 'Gagal mengupdate order', { position: 'top-center' });
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
        shouldShowWarning,
    };
}
