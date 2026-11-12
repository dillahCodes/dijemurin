import { router, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { toast } from 'sonner';
import type { LayananEditSectionProps } from '@/components/feature/layanan/edit/layanan-edit-section';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { EditServiceSchema } from '@/schema/feature/layanan/edit-service-schema';
import { editServiceSchema } from '@/schema/feature/layanan/edit-service-schema';
import type { ServiceDetail } from '@/types/feature/layanan';
import layanan from '@/routes/layanan';

function generateInitialState(serviceDetail: ServiceDetail): EditServiceSchema {
    return {
        name: serviceDetail.name,
        description: serviceDetail.description,
        outlet_id: serviceDetail.outlet.id,
    };
}

export function useLayananEdit() {
    const { service } = usePage<LayananEditSectionProps>().props;

    const initialState = generateInitialState(service);
    const { data, setData, errors, clearErrors, setError, patch, reset, processing } =
        useForm<EditServiceSchema>(initialState);

    const handleCancel = () => {
        router.get(layanan.index().url);
    };

    const handleSetOutletChange = (outletId: number) => () => {
        setData('outlet_id', outletId);
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = editServiceSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        patch(layanan.update(service.id).url, {
            onSuccess: () => {
                toast.success('Layanan berhasil diupdate', {
                    position: 'top-center',
                });
                reset();
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal mengupdate Layanan', { position: 'top-center' });
            },

            preserveScroll: true,
        });
    };

    const handleFetchOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outlets'] };
        router.get(layanan.edit(service.id).url, { outletSearch: value }, fetchConfig);
    }, 300);

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
            handleSetOutletChange,
            handleFetchOutlet,
        },
    };
}
