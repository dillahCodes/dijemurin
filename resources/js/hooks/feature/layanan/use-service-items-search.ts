import { router } from '@inertiajs/react';
import { useState } from 'react';
import layanan from '@/routes/layanan';

export interface ServiceItemsSearchProps {
    serviceName: string;
    serviceId: number;
    value: string;
}

export function useServiceItemsSearch({ serviceId, value }: ServiceItemsSearchProps) {
    const [search, setSearch] = useState(value);
    const shouldDisableSearch = !value?.length && !search?.length;
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();
        router.get(layanan.items.index([serviceId]).url, { search: search }, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get(layanan.items.index([serviceId]).url, { search: undefined }, options);
    };

    const handleGoToAddServiceItem = () => {
        router.get(layanan.items.create([serviceId]).url);
    };

    return {
        search,
        shouldDisableSearch,
        handleSubmit,
        handleChange,
        handleClear,
        handleGoToAddServiceItem,
    };
}
