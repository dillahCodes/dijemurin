import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { AddServiceSchema } from '@/schema/feature/layanan/add-service-schema';
import { addServiceSchema } from '@/schema/feature/layanan/add-service-schema';
import layanan from '@/routes/layanan';

const generateInitialState = (): AddServiceSchema => ({ name: '', description: '', outlet_id: null });

export function useLayananTambah() {
    const initialData = generateInitialState();
    const { setData, post, processing, errors, clearErrors, data, setError } = useForm<AddServiceSchema>(initialData);

    const handleCancel = () => {
        router.get(layanan.index().url);
    };

    const handleSetOutletChange = (outletId: number) => () => {
        setData('outlet_id', outletId);
    };

    const handleFetchOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outlets'] };
        router.get(layanan.create().url, { outletSearch: value }, fetchConfig);
    }, 300);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const validate = addServiceSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);

            return;
        }

        post(layanan.store().url, {
            onSuccess: () => {
                clearErrors();
                toast.success('Layanan berhasil ditambahkan', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal menambahkan layanan', { position: 'top-center' });
            },
        });
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
            handleCancel,
            handleSubmit,
            handleSetOutletChange,
            handleFetchOutlet,
        },
    };
}
