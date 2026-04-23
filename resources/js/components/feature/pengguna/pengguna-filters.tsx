import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePenggunaFilters } from '@/hooks/feature/pengguna/use-pengguna-filters';
import pengguna from '@/routes/pengguna';
import type { User } from '@/types/feature/user/user';
import { router, usePage } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { Activity } from 'react';
import type { PenggunaSectionProps } from './pengguna-section';

function PenggunaSearchForm() {
    const { filters } = usePage<PenggunaSectionProps>().props;
    const { filterState, conditions, clearHandle, searchHandle } = usePenggunaFilters(filters);

    return (
        <form className="flex w-full items-center justify-between gap-3 lg:max-w-2xl" onSubmit={searchHandle.handleSubmit}>
            <Input
                type="text"
                placeholder="Cari nama atau email..."
                name="search"
                className="flex-1"
                value={filterState.search}
                onChange={searchHandle.handleChange}
            />

            <div className="flex items-center gap-2">
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
        </form>
    );
}

function UserRoleFilter() {
    const { userRoleOptions, filters } = usePage<PenggunaSectionProps>().props;
    const { filterState, filterHandle } = usePenggunaFilters(filters);

    return (
        <Select value={filterState.role} onValueChange={filterHandle.handleFilterRole}>
            <SelectTrigger className="w-full min-w-28 cursor-pointer">
                <SelectValue placeholder="Role" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Semua role</SelectItem>
                {userRoleOptions.map((opt: User['role']) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function UserStatusFilter() {
    const { userStatusOptions, filters } = usePage<PenggunaSectionProps>().props;
    const { filterState, filterHandle } = usePenggunaFilters(filters);

    return (
        <Select value={filterState.status} onValueChange={filterHandle.handleFilterStatus}>
            <SelectTrigger className="w-full min-w-28 cursor-pointer">
                <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                {userStatusOptions.map((opt: User['status']) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function PenggunaAdd() {
    const handleGoToAddForm = () => {
        router.get(pengguna.create().url);
    };

    return (
        <Button onClick={handleGoToAddForm} className="w-full shrink-0 cursor-pointer md:w-fit">
            <Plus size={16} />
            Tambah Pengguna
        </Button>
    );
}

export function PenggunaFilters() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <PenggunaSearchForm />
            <div className="flex flex-wrap gap-3 md:flex-nowrap">
                <UserRoleFilter />
                <UserStatusFilter />
                <PenggunaAdd />
            </div>
        </div>
    );
}
