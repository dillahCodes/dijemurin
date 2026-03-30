import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

const apiServiceStore = (post: any, options: any) => {
    post(layanan.store().url, options);
};

export function useServiceAdd() {
    const modal = useModal();
    const { setData, post, processing, errors, clearErrors } = useForm({ name: '', description: '' });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-add-service');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        apiServiceStore(post, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-add-service');
                toast.success('Layanan berhasil ditambahkan', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal menambahkan layanan', { position: 'top-center' });
            },
        });
    };

    return { setData, processing, errors, clearErrors, handleCancel, handleSubmit };
}
