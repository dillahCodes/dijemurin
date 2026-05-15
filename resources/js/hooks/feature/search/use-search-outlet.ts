import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { router } from '@inertiajs/react';

interface UseSearchOutletParams {
    url: string;
}

export function useSearchOutlet({ url }: UseSearchOutletParams) {
    const handleFetchComboboxOutlet = useDebouncedCallback((value: string) => {
        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outlets'] };

        if (value.length < 3) {
            router.get(url, { outletSearch: undefined, outletIdSelected: undefined }, fetchConfig);
            return;
        }

        router.get(url, { outletSearch: value }, fetchConfig);
    }, 300);

    const handleSelectOutlet = (outlet: Outlet) => {
        const fetchConfig = { preserveState: true, preserveScroll: true, only: ['outletSelected'] };
        router.get(url, { outletIdSelected: outlet.id, outletSearch: undefined }, fetchConfig);
    };

    return {
        handleFetchComboboxOutlet,
        handleSelectOutlet,
    };
}
