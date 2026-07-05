import { router, usePage } from '@inertiajs/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { useRef, useState } from 'react';
import type { PenggunaFilterPageProps, PenggunaSectionProps } from '@/components/feature/pengguna/pengguna-section';
import { createUndefinedObject } from '@/helper/create-undefined-object';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import pengguna from '@/routes/pengguna';
import type { Outlet } from '@/types/feature/outlet/outlet';

const FILTER_KEYS: (keyof PenggunaFilterPageProps)[] = ['search', 'role', 'status', 'outletIdSelected', 'outletSearch'];

const FETCH_COMMON = { preserveState: true, preserveScroll: true };

const FETCH_ONLY_USERS = { ...FETCH_COMMON, only: ['users', 'outlets', 'outletSelected'] };

const FETCH_ONLY_OUTLETS = { ...FETCH_COMMON, only: ['outlets'] };

function normalizeFilterValue(value: string) {
    return value === 'all' ? undefined : value;
}

export function usePenggunaFilters() {
    const { filters } = usePage<PenggunaSectionProps>().props;

    const [filterState, setFilterState] = useState<PenggunaFilterPageProps>(filters);
    const [resetKey, setResetKey] = useState(0);

    const filterStateRef = useRef(filterState);
    filterStateRef.current = filterState;

    const shouldDisableSearch = !filterState.search && !filterState.outletIdSelected;

    const updateFilterState = (params: Partial<PenggunaFilterPageProps>) => {
        setFilterState((prev) => ({
            ...prev,
            ...params,
        }));
    };

    const getCurrentFilters = (params: Partial<PenggunaFilterPageProps> = {}): PenggunaFilterPageProps => ({
        ...filters,
        ...filterStateRef.current,
        ...params,
    });

    const fetchUsers = (params: PenggunaFilterPageProps) => {
        router.get(pengguna.index().url, params, FETCH_ONLY_USERS);
    };

    const fetchOutlets = (params: PenggunaFilterPageProps) => {
        router.get(pengguna.index().url, params, FETCH_ONLY_OUTLETS);
    };

    const handleFetchComboboxOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        updateFilterState({
            outletIdSelected: undefined,
            outletSearch: value,
        });

        fetchOutlets(
            getCurrentFilters({
                outletIdSelected: undefined,
                outletSearch: value,
            }),
        );
    }, 300);

    const handleSelectOutlet = (outlet: Outlet) => {
        updateFilterState({
            outletIdSelected: outlet.id,
            outletSearch: undefined,
        });
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateFilterState({
            search: e.target.value,
        });
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetchUsers(getCurrentFilters());
    };

    const handleFilterRoleStatus = (role: string, status: string) => {
        const nextFilters = getCurrentFilters({
            role: normalizeFilterValue(role),
            status: normalizeFilterValue(status),
        });

        setFilterState(nextFilters);
        fetchUsers(nextFilters);
    };

    const handleClearSearch = () => {
        const emptyFilters = createUndefinedObject(FILTER_KEYS);

        setFilterState(emptyFilters);
        setResetKey((prev) => prev + 1);

        fetchUsers(emptyFilters);
    };

    return {
        data: {
            filterState,
            resetKey,
            conditions: {
                shouldDisableSearch,
            },
        },
        handlers: {
            searchHandle: {
                handleSubmit,
                handleChange: handleSearchChange,
            },
            filterHandle: {
                handleFilterRoleStatus,
            },
            comboboxHandle: {
                handleFetchComboboxOutlet,
                handleSelectOutlet,
            },
            clearHandle: {
                handleClearSearch,
            },
        },
    };
}
