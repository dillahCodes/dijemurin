import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

export interface ServiceItemsAddProps {
    service_id: number;
}

const apiServiceItemsStore = (post: any, service_id: number, options: any) => {
    post(layanan.items.store([service_id]).url, options);
};

export function useServiceItemsAdd({ service_id }: ServiceItemsAddProps) {
    const modal = useModal();
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        description: '',
        time: '',
        price: 0,
        unit: '',
        service_id,
    });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-add-price-list');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        apiServiceItemsStore(post, service_id, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-add-price-list');
                toast.success('Price list berhasil ditambahkan', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal menambahkan price list', { position: 'top-center' });
            },
        });
    };

    return { data, setData, processing, errors, clearErrors, handleCancel, handleSubmit };
}
