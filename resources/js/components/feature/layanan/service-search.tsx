import { Plus, X } from 'lucide-react';
import { Activity } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServiceSearch } from '@/hooks/feature/layanan/use-service-search';
import type { ServiceSearchProps } from '@/hooks/feature/layanan/use-service-search';

export function ServiceSearch(props: ServiceSearchProps) {
    const { search, shouldDisableSearch, handleSubmit, handleChange, handleClear, handleAddService } =
        useServiceSearch(props);

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
