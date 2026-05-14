import { router, usePage } from '@inertiajs/react';
import { Filter, Plus, Search, X } from 'lucide-react';
import { Activity, useState, createContext, useContext } from 'react';
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
import { useModal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleHelper } from '@/helper/role-helper';
import { usePenggunaFilters } from '@/hooks/feature/pengguna/use-pengguna-filters';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { User } from '@/types/feature/user/user';
import { UserRole } from '@/types/feature/user/user';
import type { PenggunaSectionProps } from './pengguna-section';
import pengguna from '@/routes/pengguna';

type PenggunaFilterProps = ReturnType<typeof usePenggunaFilters>;

const PenggunaFilterContext = createContext<PenggunaFilterProps | null>(null);

function usePenggunaFilterContext() {
    const context = useContext(PenggunaFilterContext);
    if (!context) {
        throw new Error('usePenggunaFilterContext must be used within a PenggunaFilterContext.Provider');
    }
    return context;
}

function PenggunaSearchForm() {
    const { data, handlers } = usePenggunaFilterContext();

    return (
        <form className="flex w-full items-center gap-3 lg:max-w-2xl" onSubmit={handlers.searchHandle.handleSubmit}>
            <PenggunaRoleStatusFilter />

            <div className="w-full sm:w-[250px] lg:w-[280px]">
                <Input
                    type="text"
                    placeholder="Cari nama atau email..."
                    name="search"
                    className="w-full"
                    value={data.filterState.search || ''}
                    onChange={handlers.searchHandle.handleChange}
                />
            </div>

            <PenggunaOutletFilter />

            <div className="flex items-center gap-2">
                <Activity mode={data.filterState.search || data.filterState.outletIdSelected ? 'visible' : 'hidden'}>
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
        </form>
    );
}

function PenggunaOutletFilter() {
    const { handlers } = usePenggunaFilterContext();
    const { auth, outlets, outletSelected } = usePage<PenggunaSectionProps>().props;
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!hasSuperAdmin) {
        return null;
    }

    return (
        <div className="w-full sm:w-[250px] lg:w-[280px]">
            <Combobox
                key={outletSelected?.data?.id}
                defaultValue={outletSelected?.data?.name}
                name="outlet_id"
                items={outlets?.data}
            >
                <ComboboxInput
                    placeholder="Cari Outlet..."
                    onChange={(e) => handlers.comboboxHandle.handleFetchComboboxOutlet(e.target.value)}
                />
                <ComboboxContent>
                    <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>
                    <ComboboxList>
                        {outlets?.data?.map((item: Outlet) => (
                            <ComboboxItem
                                key={item.id}
                                value={item.name}
                                onClick={() => handlers.comboboxHandle.handleSelectOutlet(item)}
                            >
                                {item.name}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

interface PenggunaFilterModalContentProps {
    initialState: { role: string; status: string };
    options: { roleOptions: User['role'][]; statusOptions: User['status'][] };
    onFilter: (role: string, status: string) => void;
}

function PenggunaFilterModalContent({ initialState, options, onFilter }: PenggunaFilterModalContentProps) {
    const modal = useModal();
    const [formData, setFormData] = useState(initialState);
    const { roleOptions: userRoleOptions, statusOptions: userStatusOptions } = options;

    const handleRoleChange = (val: string) => setFormData((prev) => ({ ...prev, role: val }));
    const handleStatusChange = (val: string) => setFormData((prev) => ({ ...prev, status: val }));

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onFilter(formData.role, formData.status);
        modal.close('filter-user');
    };

    return (
        <form className="mt-8 w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Role</FieldLabel>
                        <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-full min-w-28 cursor-pointer">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent className="z-1000">
                                <SelectItem value="all">Semua role</SelectItem>
                                {userRoleOptions.map((opt: User['role']) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select value={formData.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full min-w-28 cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="z-1000">
                                <SelectItem value="all">Semua status</SelectItem>
                                {userStatusOptions.map((opt: User['status']) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="ml-auto flex gap-4">
                        <Button type="button" variant="outline" onClick={() => modal.close('filter-user')}>
                            Batal
                        </Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

function PenggunaAdd() {
    const handleGoToAddForm = () => {
        router.get(pengguna.create().url);
    };

    return (
        <Button onClick={handleGoToAddForm} className="flex-1 cursor-pointer">
            <Plus size={16} />
            Tambah Pengguna
        </Button>
    );
}

function PenggunaRoleStatusFilter() {
    const { data, handlers } = usePenggunaFilterContext();
    const modal = useModal();
    const { userRoleOptions, userStatusOptions } = usePage<PenggunaSectionProps>().props;
    const { role = 'all', status = 'all' } = data.filterState;

    const handleOpenModal = () => {
        modal.open({
            id: 'filter-user',
            title: 'Filter Pengguna',
            withCancelButton: false,
            withConfirmButton: false,
            content: (
                <PenggunaFilterModalContent
                    initialState={{ role, status }}
                    options={{ roleOptions: userRoleOptions, statusOptions: userStatusOptions }}
                    onFilter={(role, status) => handlers.filterHandle.handleFilterRoleStatus(role, status)}
                />
            ),
        });
    };

    return (
        <Button className="cursor-pointer" variant="outline" onClick={handleOpenModal} type="button">
            <Filter size={16} />
        </Button>
    );
}

export function PenggunaFilters() {
    const filterHook = usePenggunaFilters();

    return (
        <PenggunaFilterContext.Provider value={filterHook}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <PenggunaSearchForm />

                <div className="flex w-full gap-3 lg:max-w-72">
                    <PenggunaAdd />
                </div>
            </div>
        </PenggunaFilterContext.Provider>
    );
}
