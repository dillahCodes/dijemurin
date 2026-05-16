import { router, usePage } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOutletFilters } from '@/hooks/feature/outlet/use-outlet-filters';
import outlet from '@/routes/outlet';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { OutletSectionProps } from './outlet-section';

function OutletSearchForm() {
    const { filters } = usePage<OutletSectionProps>().props;
    const { filterState, conditions, clearHandle, searchHandle } = useOutletFilters(filters);

    return (
        <form
            className="flex w-full flex-col gap-3 md:flex-row md:items-center lg:max-w-2xl"
            onSubmit={searchHandle.handleSubmit}
        >
            <Input
                type="text"
                placeholder="Cari nama, alamat, email, atau nomor telepon outlet..."
                name="search"
                className="w-full md:flex-1"
                value={filterState.search}
                onChange={searchHandle.handleChange}
            />

            <div className="flex w-full items-center gap-2 md:w-auto">
                <OutletStatusFilter />

                <div className="ml-auto flex items-center gap-2 md:ml-0">
                    <Activity mode={filterState.search ? 'visible' : 'hidden'}>
                        <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            className="cursor-pointer"
                            onClick={clearHandle.handleClearSearch}
                            disabled={conditions.shouldDisableSearch}
                        >
                            <X size={16} />
                        </Button>
                    </Activity>

                    <Button type="submit" className="cursor-pointer" disabled={conditions.shouldDisableSearch}>
                        <Search size={16} />
                        Cari
                    </Button>
                </div>
            </div>
        </form>
    );
}

function OutletStatusFilter() {
    const { outletStatusOptions, filters } = usePage<OutletSectionProps>().props;
    const { filterState, filterHandle } = useOutletFilters(filters);

    return (
        <Select value={filterState.status} onValueChange={filterHandle.handleFilterStatus}>
            <SelectTrigger className="w-full cursor-pointer md:w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                {outletStatusOptions.map((opt: Outlet['status']) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function OutletAdd() {
    const handleGoToAdd = () => {
        router.get(outlet.create().url);
    };

    return (
        <Button className="w-full shrink-0 cursor-pointer md:w-fit" onClick={handleGoToAdd}>
            <Plus size={16} />
            Tambah Outlet
        </Button>
    );
}

export function OutletFilters() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <OutletSearchForm />
            <OutletAdd />
        </div>
    );
}
