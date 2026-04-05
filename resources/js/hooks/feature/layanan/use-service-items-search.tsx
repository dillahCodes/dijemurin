import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ServiceItemsAdd } from '@/components/feature/layanan/service-items-add';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';

export interface ServiceItemsSearchProps {
    serviceName: string;
    serviceId: number;
    value: string;
}

const apiSearchServiceItems = (serviceId: number, search: string, options: any) => {
    const searchParam = { search: search || undefined };
    router.get(layanan.show(serviceId).url, searchParam, options);
};

const apiClearServiceItemsSearch = (serviceId: number, options: any) => {
    router.get(layanan.show(serviceId).url, {}, options);
};

export function useServiceItemsSearch({ serviceId, value }: ServiceItemsSearchProps) {
    const modal = useModal();

    const [search, setSearch] = useState(value);
    const shouldDisableSearch = !value?.length && !search?.length;
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        apiSearchServiceItems(serviceId, search, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        apiClearServiceItemsSearch(serviceId, options);
    };

    const handleAddServiceItem = () => {
        modal.open({
            id: 'modal-add-price-list',
            title: 'Tambah Price List',
            description: 'Isi form untuk menambah price list.',
            withCancelButton: false,
            withConfirmButton: false,
            content: <ServiceItemsAdd service_id={serviceId} />,
        });
    };

    return { search, shouldDisableSearch, handleSubmit, handleChange, handleClear, handleAddServiceItem };
}
