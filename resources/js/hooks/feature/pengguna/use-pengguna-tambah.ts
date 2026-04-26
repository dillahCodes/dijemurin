import { router, useForm } from '@inertiajs/react';
import type React from 'react';
import { toast } from 'sonner';
import pengguna from '@/routes/pengguna';
import { userAddSchema } from '@/schema/feature/user/add-user-schema';
import type { UserAddSchema } from '@/schema/feature/user/add-user-schema';

const initialState: UserAddSchema = {
    name: '',
    email: '',
};

export function usePenggunaTambah() {
    const { data, setData, errors, clearErrors, setError, post, reset, processing } = useForm<UserAddSchema>(initialState);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = userAddSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        post(pengguna.store().url, {
            onSuccess: () => {
                toast.success('Pengguna berhasil ditambahkan, \nEmail Set Password berhasil dikirim', {
                    position: 'top-center',
                });
                reset();
            },

            onError: () => {
                toast.error('Pengguna gagal ditambahkan', {
                    position: 'top-center',
                });
            },

            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        router.get(pengguna.index().url);
    };

    return {
        data,
        setData,

        errors,
        clearErrors,

        handleSubmit,
        handleCancel,

        processing,
    };
}
