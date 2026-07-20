import { router, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { toast } from 'sonner';
import type { PenggunaEditPageProps } from '@/components/feature/pengguna/edit/pengguna-edit-section';
import pengguna from '@/routes/pengguna';
import { userEditSchema } from '@/schema/feature/user/edit-user-schema';
import type { UserEditSchema } from '@/schema/feature/user/edit-user-schema';
import type { User, UserStatus } from '@/types/feature/user/user';

function generateInitialState(userDetail: User): UserEditSchema {
    return {
        name: userDetail.name,
        email: userDetail.email,
        status: userDetail.status.value,
        role: userDetail.role.value,
        outlet_id: userDetail.outlet?.id ?? null,
    };
}

export function usePenggunaEdit() {
    const { user } = usePage<PenggunaEditPageProps>().props;

    const initialState = generateInitialState(user.data);
    const { data, setData, errors, clearErrors, setError, patch, reset, processing } = useForm<UserEditSchema>(initialState);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = userEditSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        patch(pengguna.update(user.data.id).url, {
            onSuccess: () => {
                toast.success('Pengguna berhasil diupdate', {
                    position: 'top-center',
                });
                reset();
            },

            onError: () => {
                toast.error('Pengguna gagal diupdate', {
                    position: 'top-center',
                });
            },

            preserveScroll: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setData('status', value as UserStatus);
        clearErrors('status');
    };

    const handleRoleChange = (value: string) => {
        setData('role', value as User['role']['value']);
        clearErrors('role');
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'name' || name === 'email') {
            setData(name as keyof UserEditSchema, value);
            clearErrors(name as keyof UserEditSchema);
        }
    };

    const handleCancel = () => {
        router.get(pengguna.index().url);
    };

    return {
        form: {
            data,
            setData,
            errors,
            clearErrors,
            processing,
        },
        handlers: {
            handleSubmit,
            handleStatusChange,
            handleRoleChange,
            handleFieldChange,
            handleCancel,
        },
    };
}
