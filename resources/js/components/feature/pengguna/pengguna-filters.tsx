import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useModal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleHelper } from '@/helper/role-helper';
import { usePenggunaFilters } from '@/hooks/feature/pengguna/use-pengguna-filters';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { User } from '@/types/feature/user/user';
import { UserRole } from '@/types/feature/user/user';
import { usePage } from '@inertiajs/react';
import { Filter, RotateCcw, Search, Store, X } from 'lucide-react';
import { Activity, createContext, useContext, useState } from 'react';
import type { PenggunaSectionProps } from './pengguna-section';

type PenggunaFilterContextType = ReturnType<typeof usePenggunaFilters>;
type PenggunaFilterOption = User['role'] | User['status'];

interface PenggunaModalFilterState {
    role: string;
    status: string;
}

const PENGGUNA_FILTER_MODAL_ID = 'filter-user';

const EMPTY_PENGGUNA_MODAL_FILTERS: PenggunaModalFilterState = {
    role: 'all',
    status: 'all',
};

const PenggunaFilterContext = createContext<PenggunaFilterContextType | null>(null);

function usePenggunaFilterContext() {
    const context = useContext(PenggunaFilterContext);

    if (!context) {
        throw new Error('usePenggunaFilterContext must be used within PenggunaFilterContext.Provider');
    }

    return context;
}

function getActiveFilterCount(role?: string, status?: string) {
    return [role, status].filter((value) => value && value !== 'all').length;
}

function getInitialModalFilters(role?: string, status?: string): PenggunaModalFilterState {
    return {
        role: role || 'all',
        status: status || 'all',
    };
}

interface ActiveFilterBadgeProps {
    count: number;
}

function ActiveFilterBadge({ count }: ActiveFilterBadgeProps) {
    return (
        <Activity mode={count > 0 ? 'visible' : 'hidden'}>
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
            </span>
        </Activity>
    );
}

interface PenggunaSelectFilterFieldProps {
    label: string;
    value: string;
    placeholder: string;
    allLabel: string;
    options: PenggunaFilterOption[];
    onChange: (value: string) => void;
}

function PenggunaSelectFilterField({
    label,
    value,
    placeholder,
    allLabel,
    options,
    onChange,
}: PenggunaSelectFilterFieldProps) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full min-w-28 cursor-pointer">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className="z-1000">
                    <SelectItem value="all">{allLabel}</SelectItem>

                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

interface PenggunaFilterModalContentProps {
    role?: string;
    status?: string;
    userRoleOptions: User['role'][];
    userStatusOptions: User['status'][];
    onSubmit: (role: string, status: string) => void;
}

function PenggunaFilterModalContent({
    role,
    status,
    userRoleOptions,
    userStatusOptions,
    onSubmit,
}: PenggunaFilterModalContentProps) {
    const modal = useModal();

    const [formData, setFormData] = useState<PenggunaModalFilterState>(() => getInitialModalFilters(role, status));

    const hasActiveFilter = formData.role !== 'all' || formData.status !== 'all';

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }));
    };

    const handleReset = () => {
        setFormData(EMPTY_PENGGUNA_MODAL_FILTERS);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit(formData.role, formData.status);
        modal.close(PENGGUNA_FILTER_MODAL_ID);
    };

    return (
        <form className="mt-8 w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <PenggunaSelectFilterField
                        label="Role"
                        value={formData.role}
                        placeholder="Role"
                        allLabel="Semua role"
                        options={userRoleOptions}
                        onChange={handleRoleChange}
                    />

                    <PenggunaSelectFilterField
                        label="Status"
                        value={formData.status}
                        placeholder="Status"
                        allLabel="Semua status"
                        options={userStatusOptions}
                        onChange={handleStatusChange}
                    />

                    <div className="flex items-center justify-between gap-4">
                        <Button type="button" variant="ghost" disabled={!hasActiveFilter} onClick={handleReset}>
                            <RotateCcw size={16} />
                            Reset
                        </Button>

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => modal.close(PENGGUNA_FILTER_MODAL_ID)}>
                                Batal
                            </Button>

                            <Button type="submit">Simpan</Button>
                        </div>
                    </div>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

function PenggunaRoleStatusFilter() {
    const modal = useModal();
    const { data, handlers } = usePenggunaFilterContext();
    const { userRoleOptions, userStatusOptions } = usePage<PenggunaSectionProps>().props;

    const { role, status } = data.filterState;
    const activeFilterCount = getActiveFilterCount(role, status);

    const handleOpenModal = () => {
        modal.open({
            id: PENGGUNA_FILTER_MODAL_ID,
            title: 'Filter Pengguna',
            withCancelButton: false,
            withConfirmButton: false,
            content: (
                <PenggunaFilterModalContent
                    role={role}
                    status={status}
                    userRoleOptions={userRoleOptions}
                    userStatusOptions={userStatusOptions}
                    onSubmit={handlers.filterHandle.handleFilterRoleStatus}
                />
            ),
        });
    };

    return (
        <Button className="relative cursor-pointer" variant="outline" type="button" onClick={handleOpenModal}>
            <Filter size={16} />
            <ActiveFilterBadge count={activeFilterCount} />
        </Button>
    );
}

function PenggunaSearchInput() {
    const { data, handlers } = usePenggunaFilterContext();

    return (
        <div className="w-full flex-1 sm:w-[250px] sm:flex-initial lg:w-[280px]">
            <InputGroup className="w-full">
                <InputGroupAddon align="inline-start">
                    <InputGroupText>
                        <Search size={16} />
                    </InputGroupText>
                </InputGroupAddon>

                <InputGroupInput
                    type="text"
                    name="search"
                    placeholder="Cari nama atau email..."
                    value={data.filterState.search || ''}
                    onChange={handlers.searchHandle.handleChange}
                />
            </InputGroup>
        </div>
    );
}

function PenggunaOutletFilter() {
    const { handlers } = usePenggunaFilterContext();
    const { auth, outlets, outletSelected } = usePage<PenggunaSectionProps>().props;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <div className="w-full flex-1 sm:w-[250px] sm:flex-initial lg:w-[280px]">
            <Combobox
                key={outletSelected?.data?.id}
                name="outlet_id"
                items={outlets?.data}
                defaultValue={outletSelected?.data?.name}
            >
                <ComboboxInput
                    placeholder="Cari Outlet..."
                    onChange={(e) => handlers.comboboxHandle.handleFetchComboboxOutlet(e.target.value)}
                >
                    <InputGroupAddon align="inline-start">
                        <InputGroupText>
                            <Store size={16} />
                        </InputGroupText>
                    </InputGroupAddon>
                </ComboboxInput>

                <ComboboxContent>
                    <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>

                    <ComboboxList>
                        {outlets?.data?.map((outlet: Outlet) => (
                            <ComboboxItem
                                key={outlet.id}
                                value={outlet.name}
                                onClick={() => handlers.comboboxHandle.handleSelectOutlet(outlet)}
                            >
                                {outlet.name}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

function PenggunaSearchActions() {
    const { data, handlers } = usePenggunaFilterContext();

    const hasSearchFilter = !!data.filterState.search || !!data.filterState.outletIdSelected;

    return (
        <div className="flex items-center gap-3">
            <Activity mode={hasSearchFilter ? 'visible' : 'hidden'}>
                <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    className="cursor-pointer"
                    onClick={handlers.clearHandle.handleClearSearch}
                    disabled={data.conditions.shouldDisableSearch}
                >
                    <X size={16} />
                </Button>
            </Activity>

            <Button type="submit" className="cursor-pointer" disabled={data.conditions.shouldDisableSearch}>
                <Search size={16} />
                Cari
            </Button>
        </div>
    );
}

function PenggunaSearchForm() {
    const { data, handlers } = usePenggunaFilterContext();
    const { auth } = usePage<PenggunaSectionProps>().props;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <form key={data.resetKey} className="w-full lg:max-w-2xl" onSubmit={handlers.searchHandle.handleSubmit}>
            <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <PenggunaRoleStatusFilter />
                        <PenggunaSearchInput />
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <PenggunaOutletFilter />
                        <PenggunaSearchActions />
                    </div>
                </div>
            </Activity>

            <Activity mode={isSuperAdmin ? 'hidden' : 'visible'}>
                <div className="flex w-full items-center gap-3">
                    <PenggunaRoleStatusFilter />
                    <PenggunaSearchInput />
                    <PenggunaSearchActions />
                </div>
            </Activity>
        </form>
    );
}

export function PenggunaFilters() {
    const filterHook = usePenggunaFilters();

    return (
        <PenggunaFilterContext.Provider value={filterHook}>
            <PenggunaSearchForm />
        </PenggunaFilterContext.Provider>
    );
}
