import { router, usePage } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { RoleHelper } from '@/helper/role-helper';
import { useServiceSearch } from '@/hooks/feature/layanan/use-service-search';
import layanan from '@/routes/layanan';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import type { ServicePageProps } from './service-section';

// 1. Local Types
interface ServiceOutletFilterProps {
    onFetchOutlet: (value: string) => void;
    onSetOutlet: (outlet: Outlet) => void;
    resetKey: number;
    localOutletIdSelected: number | undefined | null;
    localOutletSearch: string | undefined | null;
}

interface ServiceSearchActionsProps {
    search: string | undefined | null;
    outletIdSelected: number | undefined | null;
    shouldDisableSearch: boolean;
    onClear: () => void;
}

// 2. Sub-components
function ServiceOutletFilter({
    onFetchOutlet,
    onSetOutlet,
    resetKey,
    localOutletIdSelected,
    localOutletSearch,
}: ServiceOutletFilterProps) {
    const { outlets, auth, outletSelected } = usePage<ServicePageProps>().props;
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!hasSuperAdmin) {
        return null;
    }

    return (
        <div className="w-full sm:w-[250px] lg:w-[280px]">
            <Combobox
                key={`combo-${resetKey}-${localOutletIdSelected || 'empty-outlet'}`}
                defaultInputValue={localOutletIdSelected ? outletSelected?.data?.name || localOutletSearch || '' : ''}
                name="outlet_id"
                items={outlets?.data}
                onInputValueChange={onFetchOutlet}
            >
                <ComboboxInput placeholder="Cari Outlet..." />
                <ComboboxContent>
                    <Activity mode={outlets?.data?.length ? 'visible' : 'hidden'}>
                        <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>
                    </Activity>
                    <ComboboxList>
                        {outlets?.data?.map((item: Outlet) => (
                            <ComboboxItem key={item.id} value={item.name} onClick={() => onSetOutlet(item)}>
                                {item.name}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

function ServiceSearchActions({ search, outletIdSelected, shouldDisableSearch, onClear }: ServiceSearchActionsProps) {
    return (
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            <Activity mode={search || outletIdSelected ? 'visible' : 'hidden'}>
                <Button variant="ghost" type="button" onClick={onClear} className="cursor-pointer px-3">
                    <X size={16} />
                </Button>
            </Activity>

            <Button type="submit" disabled={shouldDisableSearch} className="w-full cursor-pointer sm:w-auto">
                Cari
            </Button>
        </div>
    );
}

function ServiceAddButton() {
    const handleGoToAddForm = () => {
        router.get(layanan.create().url);
    };

    return (
        <Button onClick={handleGoToAddForm} className="w-full cursor-pointer sm:w-auto">
            <Plus size={16} className="mr-2" />
            Tambah Layanan
        </Button>
    );
}

// 3. Main Component
export function ServiceSearch() {
    const { handlers, data } = useServiceSearch();

    return (
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handlers.handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-[250px] lg:w-[280px]">
                    <Input
                        type="text"
                        placeholder="Cari layanan..."
                        name="search"
                        value={data.searchParam?.search || ''}
                        onChange={handlers.handleSearchChange}
                        className="w-full"
                    />
                </div>

                <ServiceOutletFilter
                    onFetchOutlet={handlers.handleFetchComboboxOutlet}
                    onSetOutlet={handlers.handleSelectOutlet}
                    resetKey={data.resetKey}
                    localOutletIdSelected={data.searchParam?.outletIdSelected}
                    localOutletSearch={data.searchParam?.outletSearch}
                />

                <ServiceSearchActions
                    search={data.searchParam?.search}
                    outletIdSelected={data.searchParam?.outletIdSelected}
                    shouldDisableSearch={data.shouldDisableSearch}
                    onClear={handlers.handleClear}
                />
            </form>

            <div className="w-full shrink-0 sm:w-auto">
                <ServiceAddButton />
            </div>
        </div>
    );
}
