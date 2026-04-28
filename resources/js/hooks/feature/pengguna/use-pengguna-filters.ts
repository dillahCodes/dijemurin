import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PenggunaFilterPageProps, PenggunaSectionProps } from '@/components/feature/pengguna/pengguna-section';
import { createUndefinedObject } from '@/helper/create-undefined-object';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import pengguna from '@/routes/pengguna';
import type { Outlet } from '@/types/feature/outlet/outlet';

export function usePenggunaFilters() {
    const { filters } = usePage<PenggunaSectionProps>().props;
    const [searchParam, setSearchParam] = useState<PenggunaFilterPageProps>(filters);
    const [resetKey, setResetKey] = useState(0);

    const handleFetchComboboxOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outlets'] };
        router.get(pengguna.index().url, { outletSearch: value }, fetchConfig);
    }, 300);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['users', 'outlets', 'outletSelected'] };
        router.get(pengguna.index().url, searchParam, fetchConfig);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleSelectOutlet = (outlet: Outlet) => {
        setSearchParam((prev) => ({ ...prev, outletIdSelected: outlet.id, outletSearch: outlet.name }));
    };

    const handleFilterRoleStatus = (role: string, status: string) => {
        const roleValue = role === 'all' ? undefined : role;
        const statusValue = status === 'all' ? undefined : status;

        setSearchParam((prev) => ({ ...prev, role: roleValue ?? '', status: statusValue ?? '' }));

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['users', 'outlets', 'outletSelected'] };
        router.get(pengguna.index().url, { ...searchParam, role: roleValue, status: statusValue }, fetchConfig);
    };

    const handleClearSearch = () => {
        const searchParamsKeys = ['search', 'role', 'status', 'outletIdSelected', 'outletSearch'];
        const searchParams = createUndefinedObject(searchParamsKeys);

        setSearchParam(searchParams);
        setResetKey((prev) => prev + 1);

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['users', 'outlets', 'outletSelected'] };
        router.get(pengguna.index().url, searchParams, fetchConfig);
    };

    const conditions = {
        shouldDisableSearch: !searchParam.search && !searchParam.outletIdSelected,
    };

    return {
        data: {
            filterState: searchParam,
            resetKey,
            conditions,
        },
        handlers: {
            searchHandle: { handleSubmit, handleChange: handleSearchChange },
            filterHandle: { handleFilterRoleStatus },
            comboboxHandle: { handleFetchComboboxOutlet, handleSelectOutlet },
            clearHandle: { handleClearSearch },
        },
    };
}
