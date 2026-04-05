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

    const orderStatus = orderData.status.value;
    const shouldShowWarning = [OrderStatusEnglish.PICKED_UP, OrderStatusEnglish.CANCELLED].includes(statusValue);
    const shouldDisableStatusSelect = [OrderStatusEnglish.PICKED_UP, OrderStatusEnglish.CANCELLED].includes(orderStatus);
    const shouldDisableSaveButton = statusValue === orderStatus || processing;

    const handleCloseModal = () => {
        clearErrors();
        modal.close(`edit-order-${orderData.id}`);
    };

    const handleStatusChange = (value: OrderStatusEnglish) => {
        console.log({ value });
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
            onError: (error) => {
                console.log({ error });
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
        shouldShowWarning,
    };
}
