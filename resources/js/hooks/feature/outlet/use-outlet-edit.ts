import { OutletEditSectionProps } from '@/components/feature/outlet/edit/outlet-edit-section';
import { useModal } from '@/components/ui/modal';
import { MultipleOption } from '@/components/ui/multi-select-list-box';
import { UserHelper } from '@/helper/users-helper';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import outlet from '@/routes/outlet';
import { editOutletSchema, EditOutletSchema } from '@/schema/feature/outlet/edit-outlet-schema';
import { OutletDetail, OutletStatus } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

function generateInitialState(outletDetail: OutletDetail): EditOutletSchema {
    return {
        name: outletDetail.name,
        address: outletDetail.address,
        email: outletDetail.email,
        phone: outletDetail.phone,
        admin: UserHelper.findUserRole(outletDetail.users, UserRole.ADMIN)?.id ?? 0,
        cashiers: UserHelper.filterUserRole(outletDetail.users, UserRole.CASHIER).map((user) => user.id) ?? [],
        operators: UserHelper.filterUserRole(outletDetail.users, UserRole.OPERATOR).map((user) => user.id) ?? [],
        status: outletDetail.status.value,
    };
}

export function useOutletEdit() {
    const modal = useModal();
    const { usersSearch, outletDetail, outletStatusOptions } = usePage<OutletEditSectionProps>().props;
    const initialState = generateInitialState(outletDetail.data);

    const { data, setData, errors, clearErrors, setError, patch, reset } = useForm<EditOutletSchema>(initialState);

    const options = usersSearch.data.map((user) => ({ value: user.id.toString(), label: user.name }));

    const adminSelectedInitialState = UserHelper.getUserOptionsByRole(outletDetail.data.users, UserRole.ADMIN);
    const cashierSelectedInitialState = UserHelper.getUserOptionsByRole(outletDetail.data.users, UserRole.CASHIER);
    const operatorSelectedInitialState = UserHelper.getUserOptionsByRole(outletDetail.data.users, UserRole.OPERATOR);

    const [adminSelected, setAdminSelected] = useState<MultipleOption[]>(adminSelectedInitialState);
    const [cashiersSelected, setCashiersSelected] = useState<MultipleOption[]>(cashierSelectedInitialState);
    const [operatorsSelected, setOperatorsSelected] = useState<MultipleOption[]>(operatorSelectedInitialState);

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

    const handleStatusChange = (value: string) => {
        setData('status', value as OutletStatus['value']);
        clearErrors('status');
    };

    const handleFetchUser = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['usersSearch'] };
        router.get(outlet.edit(outletDetail.data.id).url, { search: value }, fetchConfig);
    }, 300);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validate = editOutletSchema.safeParse(data);

        if (!validate.success) {
            const err = validate.error.flatten();
            setError(err.fieldErrors as Record<string, string[]>);
            return;
        }

        modal.open({
            id: 'submit-outlet-change',
            title: 'Simpan perubahan',
            description: 'Apakah anda yakin ingin menyimpan perubahan?',
            confirmContent: 'Simpan',
            cancelContent: 'Batal',

            onConfirm() {
                patch(outlet.edit(outletDetail.data.id).url, {
                    onSuccess: () => {
                        toast.success('Outlet berhasil diupdate');
                        reset();
                    },
                    
                    onError: (errors) => {
                        toast.error('Outlet gagal diupdate');
                        console.log({ errors });
                    },
                    preserveScroll: true,
                });
            },
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

        outletStatusOptions,
        handleStatusChange,

        handleFetchUser,
        handleSubmit,
    };
}
