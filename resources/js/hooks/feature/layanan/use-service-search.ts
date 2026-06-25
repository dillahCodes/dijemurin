import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ServicePageProps } from '@/components/feature/layanan/service-section';
import layanan from '@/routes/layanan';

export function useServiceSearch() {
    const { filters } = usePage<ServicePageProps>().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Preserve outletIdSelected so the outlet context is not lost
        const params = { search: search, outletIdSelected: filters.outletIdSelected };
        const config = { preserveState: true, preserveScroll: true, only: ['services'] };

        router.get(layanan.index().url, params, config);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');

        // Preserve outletIdSelected — outlet context must not be cleared here
        const params = { search: undefined, outletIdSelected: filters.outletIdSelected };
        const config = { preserveState: true, preserveScroll: true, only: ['services'] };

        router.get(layanan.index().url, params, config);
    };

    const shouldDisableSearch = !search?.length;

    return {
        data: {
            search,
            shouldDisableSearch,
        },

        handlers: {
            handleSubmit,
            handleSearchChange,
            handleClear,
        },
    };
}
