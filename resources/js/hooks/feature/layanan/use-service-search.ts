import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ServicePageProps } from '@/components/feature/layanan/service-section';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { Outlet } from '@/types/feature/outlet/outlet';
import layanan from '@/routes/layanan';

export function useServiceSearch() {
    const { filters } = usePage<ServicePageProps>().props;
    const [searchParam, setSearchParam] = useState<ServicePageProps['filters']>(filters);
    const [resetKey, setResetKey] = useState(0);

    const handleFetchComboboxOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outlets'] };
        router.get(layanan.index().url, { outletSearch: value }, fetchConfig);
    }, 300);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['services', 'outlets', 'outletSelected'] };
        router.get(layanan.index().url, searchParam, fetchConfig);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleSelectOutlet = (outlet: Outlet) => {
        setSearchParam((prev) => ({ ...prev, outletIdSelected: outlet.id, outletSearch: outlet.name }));
    };

    const handleClear = () => {
        const searchParams = { search: undefined, outletIdSelected: undefined, outletSearch: undefined };
        setSearchParam(searchParams);
        setResetKey((prev) => prev + 1);

        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['services', 'outlets', 'outletSelected'] };
        router.get(layanan.index().url, searchParams, fetchConfig);
    };

    const isAllEmpty = () => {
        return !searchParam?.search?.length && !searchParam?.outletIdSelected;
    };

    const shouldDisableSearch = isAllEmpty();

    return {
        data: {
            searchParam,
            shouldDisableSearch,
            resetKey,
        },

        handlers: {
            handleFetchComboboxOutlet,
            handleSubmit,
            handleSearchChange,
            handleSelectOutlet,
            handleClear,
        },
    };
}
