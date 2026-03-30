import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

export interface ServiceEditProps {
    serviceId: number;
    title: string;
    description: string;
}

const apiServiceUpdate = (patch: any, serviceId: number, options: any) => {
    patch(layanan.update(serviceId).url, options);
};

export function useServiceEdit({ serviceId, title, description }: ServiceEditProps) {
    const modal = useModal();
    const { setData, patch, processing, errors, clearErrors } = useForm({ name: title, description: description });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-edit-service');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        apiServiceUpdate(patch, serviceId, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-edit-service');
                toast.success('Layanan berhasil diupdate', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Layanan gagal diupdate', { position: 'top-center' });
            },
        });
    };

    return { setData, processing, errors, clearErrors, handleCancel, handleSubmit };
}
