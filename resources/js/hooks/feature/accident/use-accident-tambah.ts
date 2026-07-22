import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { AddAccidentItemSchema, AddAccidentSchema } from '@/schema/feature/accident/add-accident-schema';
import { addAccidentSchema } from '@/schema/feature/accident/add-accident-schema';
import type { AccidentTypeEnglish } from '@/types/feature/accident/accident';
import accidents from '@/routes/accidents';

const createEmptyItem = (): AddAccidentItemSchema => ({
    order_item_id: null as unknown as number,
    type: undefined as unknown as AccidentTypeEnglish,
    item_details: '',
    description: '',
});

const generateInitialState = (outletId: number | null): AddAccidentSchema => ({
    outlet_id: outletId as unknown as number,
    order_id: null as unknown as number,
    description: '',
    items: [createEmptyItem()],
});

export function useAccidentTambah(initialOutletId: number | null) {
    const initialData = generateInitialState(initialOutletId);
    const { setData, post, processing, errors, clearErrors, data, setError } = useForm<AddAccidentSchema>(initialData);

    const handleCancel = () => {
        router.get(accidents.index().url);
    };

    const handleSetOutletChange = (outletId: number) => {
        setData((prev) => ({
            ...prev,
            outlet_id: outletId,
            order_id: null as unknown as number,
            items: [createEmptyItem()],
        }));
        clearErrors();

        router.get(
            accidents.create().url,
            { outletIdSelected: outletId },
            { preserveState: true, preserveScroll: true, only: ['orders', 'orderItems'] },
        );
    };

    const handleSetOrderChange = (orderId: number) => {
        setData((prev) => ({
            ...prev,
            order_id: orderId,
            items: [createEmptyItem()],
        }));
        clearErrors('order_id');

        router.get(
            accidents.create().url,
            { outletIdSelected: data.outlet_id, order_id: orderId },
            { preserveState: true, preserveScroll: true, only: ['orderItems'] },
        );
    };

    const handleFetchOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        router.get(
            accidents.create().url,
            { outletSearch: value },
            { preserveState: true, preserveScroll: true, only: ['outlets'] },
        );
    }, 300);

    const handleFetchOrder = useDebouncedCallback((value: string) => {
        if (value.length < 3 || !data.outlet_id) {
            return;
        }

        router.get(
            accidents.create().url,
            { outletIdSelected: data.outlet_id, orderSearch: value },
            { preserveState: true, preserveScroll: true, only: ['orders'] },
        );
    }, 300);

    // --- Item management ---

    const handleAddItem = () => {
        setData('items', [...data.items, createEmptyItem()]);
    };

    const handleRemoveItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const handleSetItemField = <K extends keyof AddAccidentItemSchema>(
        index: number,
        field: K,
        value: AddAccidentItemSchema[K],
    ) => {
        const updated = data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('items', updated);
    };

    // --- Submit ---

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = addAccidentSchema.safeParse(data);

        if (!validate.success) {
            clearErrors();
            const formattedErrors: Record<string, string> = {};
            validate.error.issues.forEach((issue) => {
                const key = issue.path.join('.');
                formattedErrors[key] = issue.message;
            });
            setError(formattedErrors);

            return;
        }

        post(accidents.store().url, {
            onSuccess: () => {
                clearErrors();
                toast.success('Insiden berhasil dilaporkan', { position: 'top-center' });
                router.get(accidents.index().url);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal melaporkan insiden', { position: 'top-center' });
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
            handleSetOrderChange,
            handleFetchOutlet,
            handleFetchOrder,
            handleAddItem,
            handleRemoveItem,
            handleSetItemField,
        },
    };
}
