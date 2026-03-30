import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ServiceAdd } from '@/components/feature/layanan/service-add';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

export interface ServiceSearchProps {
    value: string;
}

const apiSearchService = (search: string, options: any) => {
    router.get(layanan.index().url, { search: search || undefined }, options);
};

const apiClearSearch = (options: any) => {
    router.get(layanan.index().url, {}, options);
};

export function useServiceSearch({ value }: ServiceSearchProps) {
    const modal = useModal();

    const [search, setSearch] = useState(value);
    const shouldDisableSearch = !value.length && !search.length;
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        apiSearchService(search, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        apiClearSearch(options);
    };

    const handleAddService = () => {
        modal.open({
            id: 'modal-add-service',
            title: 'Tambah Layanan',
            description: 'Isi form untuk menambah layanan.',
            withCancelButton: false,
            withConfirmButton: false,
            content: <ServiceAdd />,
        });
    };

    return { search, shouldDisableSearch, handleSubmit, handleChange, handleClear, handleAddService };
}
