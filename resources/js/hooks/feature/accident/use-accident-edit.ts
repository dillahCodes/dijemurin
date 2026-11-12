import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { EditAccidentSchema, EditAccidentItemSchema } from '@/schema/feature/accident/edit-accident-schema';
import { editAccidentSchema } from '@/schema/feature/accident/edit-accident-schema';
import type { Accident } from '@/types/feature/accident/accident';
import accidents from '@/routes/accidents';

type EditItemField = keyof EditAccidentItemSchema;
type EditItemValue = EditAccidentItemSchema[EditItemField];

const generateInitialState = (accident: Accident): EditAccidentSchema => ({
    description: accident.description || '',
    status: accident.status.value,
    items: (accident.items || []).map((item) => ({
        id: item.id,
        type: item.type.value,
        item_details: item.item_details || '',
        description: item.description,
        compensation_type: item.compensation_type?.value,
        compensation_amount: item.compensation_amount || 0,
    })),
});

export function useAccidentEdit(accident: Accident) {
    const initialData = generateInitialState(accident);
    const { setData, patch, processing, errors, clearErrors, data, setError } = useForm<EditAccidentSchema>(initialData);

    const handleCancel = () => {
        router.get(accidents.show(accident.id).url);
    };

    const handleSetItemField = (index: number, field: EditItemField, value: EditItemValue) => {
        const updated = data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('items', updated);
    };

    const handleSetItemFields = (index: number, values: Partial<(typeof data.items)[number]>) => {
        const updated = data.items.map((item, i) => (i === index ? { ...item, ...values } : item));
        setData('items', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = editAccidentSchema.safeParse(data);

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

        patch(accidents.update(accident.id).url, {
            onSuccess: () => {
                clearErrors();
                toast.success('Laporan insiden berhasil diperbarui', { position: 'top-center' });
            },
            onError: (errs) => {
                const firstError = Object.values(errs)[0];
                toast.error(firstError || 'Gagal memperbarui laporan insiden', { position: 'top-center' });
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
            handleSetItemField,
            handleSetItemFields,
        },
    };
}
