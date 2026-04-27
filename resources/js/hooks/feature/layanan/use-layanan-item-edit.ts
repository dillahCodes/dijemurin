import { useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { toast } from 'sonner';
import type { LayananItemEditSectionProps } from '@/components/feature/layanan/items/edit/layanan-item-edit-section';
import { useModal } from '@/components/ui/modal';
import layananRoute from '@/routes/layanan';
import type { EditServiceItemSchema } from '@/schema/feature/layanan/edit-service-item-schema';
import { editServiceItemSchema } from '@/schema/feature/layanan/edit-service-item-schema';
import type { ServiceItem } from '@/types/feature/layanan';

const getInitialState = (service: ServiceItem): EditServiceItemSchema => ({
    name: service.name,
    description: service.description,
    time: service.time,
    price: service.price,
    unit: service.unit,
    service_id: service.service_id,
});

export function useLayananItemEdit() {
    const modal = useModal();
    const { serviceItem } = usePage<LayananItemEditSectionProps>().props;

    const initialState = getInitialState(serviceItem);
    const { data, setData, patch, processing, errors, clearErrors, setError } = useForm<EditServiceItemSchema>(initialState);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = editServiceItemSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        patch(layananRoute.items.update([serviceItem.service_id, serviceItem.id]).url, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-edit-service-item');
                toast.success('Price list berhasil diupdate', { position: 'top-center' });
            },
            onError: (error) => {
                console.log(error);
                toast.error('Gagal mengupdate price list', { position: 'top-center' });
            },
        });
    };

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-edit-service-item');
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
