import { router } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { Activity, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModal } from '@/components/ui/modal';
import { ServiceItemsAdd } from './service-items-add';
import layanan from '@/routes/layanan';

interface ServiceItemsSearchProps {
    serviceName: string;
    serviceId: number;
    value: string;
}

export function ServiceItemsSearch({ serviceName, value, serviceId }: ServiceItemsSearchProps) {
    const modal = useModal();

    const [search, setSearch] = useState(value);
    const shouldDisableSearch = !value.length && !search.length;
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchParam = { search: search || undefined };
        router.get(layanan.show(serviceId).url, searchParam, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get(layanan.show(serviceId).url, {}, options);
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

    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSubmit} className="flex w-full max-w-2xl items-center gap-3">
                <Input
                    type="text"
                    placeholder={`Cari Price List ${serviceName}...`}
                    name="search"
                    value={search}
                    onChange={handleChange}
                />
                <div className="flex items-center gap-3">
                    <Activity mode={search ? 'visible' : 'hidden'}>
                        <Button variant="ghost" type="button" onClick={handleClear} className="cursor-pointer">
                            <X size={16} />
                        </Button>
                    </Activity>

                    <Button type="submit" disabled={shouldDisableSearch} className="cursor-pointer">
                        Cari
                    </Button>
                </div>
            </form>

            <Button onClick={handleAddServiceItem} variant="outline" className="w-full shrink-0 cursor-pointer sm:w-fit">
                <Plus size={16} />
                Tambah Price List
            </Button>
        </div>
    );
}
