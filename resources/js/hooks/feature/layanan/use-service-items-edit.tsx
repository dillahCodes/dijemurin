import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

interface DefaultData {
    name: string;
    description: string;
    time: string;
    price: number;
    unit: string;
}

export interface ServiceItemsEditProps {
    service_id: number;
    service_item_id: number;
    defaultData: DefaultData;
}

const apiServiceItemsUpdate = (patch: any, service_id: number, service_item_id: number, options: any) => {
    patch(layanan.items.update([service_id, service_item_id]).url, options);
};

export function useServiceItemsEdit({ service_id, service_item_id, defaultData }: ServiceItemsEditProps) {
    const modal = useModal();
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        name: defaultData.name,
        description: defaultData.description,
        time: defaultData.time,
        price: defaultData.price,
        unit: defaultData.unit,
        service_id,
    });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-edit-service-item');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        apiServiceItemsUpdate(patch, service_id, service_item_id, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-edit-service-item');
                toast.success('Price list berhasil diupdate', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal mengupdate price list', { position: 'top-center' });
            },
        });
    };

    return { data, setData, processing, errors, clearErrors, handleCancel, handleSubmit };
}
