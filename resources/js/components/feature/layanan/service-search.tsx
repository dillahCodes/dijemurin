import { router } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { Activity, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';
import { ServiceAdd } from './service-add';

interface ServiceSearchProps {
    value: string;
}

export function ServiceSearch({ value }: ServiceSearchProps) {
    const modal = useModal();

    const [search, setSearch] = useState(value);
    const shouldDisableSearch = !value.length && !search.length;
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(layanan.index().url, { search: search || undefined }, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get(layanan.index().url, {}, options);
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

    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSubmit} className="flex w-full max-w-2xl items-center gap-3">
                <Input
                    type="text"
                    placeholder="Cari layanan..."
                    name="search"
                    value={search}
                    onChange={handleChange}
                    className="flex-1"
                />

                <div className="flex items-center gap-2">
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

            <Button onClick={handleAddService} variant="outline" className="w-full shrink-0 cursor-pointer sm:w-fit">
                <Plus size={16} />
                Tambah Layanan
            </Button>
        </div>
    );
}
