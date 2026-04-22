import { OutletTambahSectionProps } from '@/components/feature/outlet/tambah/outlet-tambah-section';
import type { MultipleOption } from '@/components/ui/multi-select-list-box';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import outlet from '@/routes/outlet';
import { AddOutletSchema, addOutletSchema } from '@/schema/feature/outlet/add-outlet-schema';
import { router, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';

const initialState: AddOutletSchema = {
    name: '',
    address: '',
    email: '',
    phone: '',
    admin: 0,
    cashiers: [],
    operators: [],
};

export function useOutletTambah() {
    const { data, setData, errors, clearErrors, setError, post, reset } = useForm<AddOutletSchema>(initialState);

    const { users } = usePage<OutletTambahSectionProps>().props;
    const options = users.data.map((user) => ({ value: user.id.toString(), label: user.name }));

    const [adminSelected, setAdminSelected] = useState<MultipleOption[]>([]);
    const [cashiersSelected, setCashiersSelected] = useState<MultipleOption[]>([]);
    const [operatorsSelected, setOperatorsSelected] = useState<MultipleOption[]>([]);

    const handleAdminChange = (selected: MultipleOption[]) => {
        const latestSelection = selected.length ? [selected[selected.length - 1]] : [];
        setAdminSelected(latestSelection);

        const value = latestSelection[0]?.value || '';
        setData('admin', parseInt(value));
        clearErrors('admin');
    };

    const handleCashiersChange = (selected: MultipleOption[]) => {
        setCashiersSelected(selected);

        const cashierIds = selected.map((item) => parseInt(item.value));
        setData('cashiers', cashierIds);
        clearErrors('cashiers');
    };

    const handleOperatorsChange = (selected: MultipleOption[]) => {
        setOperatorsSelected(selected);

        const operatorIds = selected.map((item) => parseInt(item.value));
        setData('operators', operatorIds);
        clearErrors('operators');
    };

    const handleFetchUser = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['users'] };
        router.get(outlet.create().url, { search: value }, fetchConfig);
    }, 300);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = addOutletSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);
            return;
        }

        post(outlet.store().url, {
            onSuccess: () => reset(),
            onError: (errors) => console.log({ errors }),
            preserveScroll: true,
        });
    };

    return {
        data,
        setData,
        errors,
        clearErrors,
        options,

        adminSelected,
        handleAdminChange,

        cashiersSelected,
        handleCashiersChange,

        operatorsSelected,
        handleOperatorsChange,

        handleFetchUser,
        handleSubmit,
    };
}
