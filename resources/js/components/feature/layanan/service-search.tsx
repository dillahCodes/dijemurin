import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Activity, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ServiceSearchProps {
    value: string;
}

export function ServiceSearch({ value }: ServiceSearchProps) {
    const [search, setSearch] = useState(value);
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/layanan', { search: search || undefined }, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get('/layanan', {}, options);
    };

    return (
        <form onSubmit={handleSubmit} className="flex max-w-2xl items-center gap-3">
            <Input type="text" placeholder="Cari layanan..." name="search" value={search} onChange={handleChange} />
            <div className="flex items-center gap-3">
                <Activity mode={search ? 'visible' : 'hidden'}>
                    <Button variant="ghost" type="button" onClick={handleClear} className="cursor-pointer">
                        <X size={16} />
                    </Button>
                </Activity>
                <Button type="submit" className="cursor-pointer">
                    Cari
                </Button>
            </div>
        </form>
    );
}
