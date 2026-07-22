import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { AccidentFilterPageProps, AccidentPageProps } from '@/components/feature/accident/accident-data-section';
import { createUndefinedObject } from '@/helper/create-undefined-object';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import type { Outlet } from '@/types/feature/outlet/outlet';

const FILTER_KEYS: (keyof AccidentFilterPageProps)[] = [
    'search',
    'status',
    'type',
    'startDate',
    'endDate',
    'dateType',
    'outletIdSelected',
    'outletSearch',
    'reporterId',
];

const FETCH_COMMON = {
    preserveState: true,
    preserveScroll: true,
};

const FETCH_ONLY_ACCIDENTS = {
    ...FETCH_COMMON,
    only: ['accidents', 'outlets', 'outletSelected'],
};

const FETCH_ONLY_OUTLETS = {
    ...FETCH_COMMON,
    only: ['outlets'],
};

const FETCH_ONLY_ALL = {
    ...FETCH_COMMON,
    only: [
        'accidentStatusOptions',
        'accidentTypeOptions',
        'compensationTypeOptions',
        'accidentDateTypeOptions',
        'filters',
        'accidents',
        'outlets',
        'outletSelected',
    ],
};

type DateFilter = Pick<AccidentFilterPageProps, 'startDate' | 'endDate'>;

function normalizeSelectValue(value: string) {
    return value === 'all' ? undefined : value;
}

function normalizeInputValue(value: string) {
    const trimmedValue = value.trim();

    return trimmedValue === '' ? undefined : trimmedValue;
}

function validateDateFilter({ startDate, endDate }: DateFilter) {
    const hasStartDate = !!startDate;
    const hasEndDate = !!endDate;

    if (hasStartDate && !hasEndDate) {
        toast.error('Tanggal selesai wajib diisi jika tanggal mulai sudah diisi.');

        return false;
    }

    if (!hasStartDate && hasEndDate) {
        toast.error('Tanggal mulai wajib diisi jika tanggal selesai sudah diisi.');

        return false;
    }

    return true;
}

export function useAccidentFilters() {
    const { filters } = usePage<AccidentPageProps>().props;

    const [filterState, setFilterState] = useState<AccidentFilterPageProps>(filters);
    const [resetKey, setResetKey] = useState(0);

    const filterStateRef = useRef(filterState);

    useEffect(() => {
        filterStateRef.current = filterState;
    }, [filterState]);

    const shouldDisableSearch = !filterState.search && !filterState.outletIdSelected;

    const updateFilterState = (params: Partial<AccidentFilterPageProps>) => {
        setFilterState((prev) => ({
            ...prev,
            ...params,
        }));
    };

    const getCurrentFilters = (params: Partial<AccidentFilterPageProps> = {}): AccidentFilterPageProps => ({
        ...filters,
        ...filterStateRef.current,
        ...params,
    });

    const fetchAccidents = (params: AccidentFilterPageProps) => {
        router.get('/accidents', params, FETCH_ONLY_ACCIDENTS);
    };

    const fetchOutlets = (params: AccidentFilterPageProps) => {
        router.get('/accidents', params, FETCH_ONLY_OUTLETS);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilterState({ search: e.target.value });
    };

    const handleFetchComboboxOutlet = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        updateFilterState({ outletIdSelected: undefined });

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

    const handleSubmitSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetchAccidents(getCurrentFilters());
    };

    const handleSubmitModalFilters = (
        e: React.SubmitEvent<HTMLFormElement>,
        modalFilters: Partial<AccidentFilterPageProps>,
    ) => {
        e.preventDefault();

        const nextFilters = getCurrentFilters(modalFilters);
        const isValidDate = validateDateFilter(nextFilters);

        if (!isValidDate) {
            return;
        }

        setFilterState(nextFilters);
        fetchAccidents(nextFilters);
    };

    const handleClearSearch = () => {
        const clearedFilters = getCurrentFilters({
            search: undefined,
            outletIdSelected: undefined,
            outletSearch: undefined,
        });

        setFilterState(clearedFilters);
        setResetKey((prev) => prev + 1);

        router.get('/accidents', clearedFilters, FETCH_ONLY_ALL);
    };

    const handleClearAllFilters = () => {
        const emptyFilters = createUndefinedObject(FILTER_KEYS);

        setFilterState(emptyFilters);
        setResetKey((prev) => prev + 1);

        router.get('/accidents', emptyFilters, FETCH_ONLY_ALL);
    };

    return {
        data: {
            filterState,
            resetKey,
            conditions: {
                shouldDisableSearch,
            },
        },
        utils: {
            normalizeSelectValue,
            normalizeInputValue,
        },
        handlers: {
            searchHandle: {
                handleSearchChange,
                handleSubmitSearch,
                handleClearSearch,
            },
            outletHandle: {
                handleFetchComboboxOutlet,
                handleSelectOutlet,
            },
            modalHandle: {
                handleSubmitModalFilters,
            },
            clearHandle: {
                handleClearSearch,
                handleClearAllFilters,
            },
        },
    };
}
