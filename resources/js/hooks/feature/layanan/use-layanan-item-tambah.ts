import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { toast } from 'sonner';
import type { LayananItemTambahSectionProps } from '@/components/feature/layanan/items/tambah/layanan-item-tambah-section';
import { useModal } from '@/components/ui/modal';
import layananRoute from '@/routes/layanan';
import type { AddServiceItemSchema } from '@/schema/feature/layanan/add-service-item-schema';
import { addServiceItemSchema } from '@/schema/feature/layanan/add-service-item-schema';
import type { Service } from '@/types/feature/layanan';

const getInitialState = (service: Service): AddServiceItemSchema => ({
    name: '',
    description: '',
    time: '',
    price: 0,
    unit: '',
    service_id: service.id,
});

export function useLayananItemTambah() {
    const modal = useModal();
    const { service } = usePage<LayananItemTambahSectionProps>().props;

    const initialState = getInitialState(service);
    const { data, setData, post, processing, errors, clearErrors, setError } = useForm<AddServiceItemSchema>(initialState);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = addServiceItemSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        post(layananRoute.items.store([service.id]).url, {
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

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-add-price-list');
    };

    return {
        form: {
            data,
            setData,
            processing,
            errors,
            clearErrors,
        },
        handlers: {
            handleSubmit,
            handleCancel,
        },
    };
}
