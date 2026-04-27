import { Plus, X } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServiceItemsSearch } from '@/hooks/feature/layanan/use-service-items-search';
import type { ServiceItemsSearchProps } from '@/hooks/feature/layanan/use-service-items-search';

export function ServiceItemsSearch(props: ServiceItemsSearchProps) {
    const { search, shouldDisableSearch, handleSubmit, handleChange, handleClear, handleGoToAddServiceItem } =
        useServiceItemsSearch(props);

    const { serviceName } = props;

    return (
        <div className="b flex flex-col items-center justify-between gap-4 sm:flex-row">
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

            <Button onClick={handleGoToAddServiceItem} className="w-full shrink-0 cursor-pointer sm:w-fit">
                <Plus size={16} />
                Tambah Price List
            </Button>
        </div>
    );
}
