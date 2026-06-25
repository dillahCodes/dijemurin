import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOutletFilters } from '@/hooks/feature/outlet/use-outlet-filters';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { usePage } from '@inertiajs/react';
import { NotepadText, Search, X } from 'lucide-react';
import { Activity } from 'react';
import type { OutletSectionProps } from './outlet-section';

function OutletStatusFilter() {
    const { outletStatusOptions, filters } = usePage<OutletSectionProps>().props;
    const { filterState, filterHandle } = useOutletFilters(filters);

    return (
        <Select value={filterState.status} onValueChange={filterHandle.handleFilterStatus}>
            <SelectTrigger className="w-full cursor-pointer md:w-[180px]">
                <NotepadText size={16} className="text-muted-foreground" />
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

function OutletSearchForm() {
    const { filters } = usePage<OutletSectionProps>().props;
    const { filterState, conditions, clearHandle, searchHandle } = useOutletFilters(filters);

    return (
        <form
            className="flex w-full flex-col gap-3 md:flex-row md:items-center lg:max-w-2xl"
            onSubmit={searchHandle.handleSubmit}
        >
            <div className="w-full md:flex-1">
                <InputGroup className="w-full">
                    <InputGroupAddon align="inline-start">
                        <InputGroupText>
                            <Search size={16} />
                        </InputGroupText>
                    </InputGroupAddon>

                    <InputGroupInput
                        type="text"
                        placeholder="Cari nama, alamat, email, atau nomor telepon outlet..."
                        name="search"
                        value={filterState.search}
                        onChange={searchHandle.handleChange}
                    />
                </InputGroup>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
                <OutletStatusFilter />

                <div className="ml-auto flex items-center gap-3 md:ml-0">
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

export function OutletFilters() {
    return <OutletSearchForm />;
}
