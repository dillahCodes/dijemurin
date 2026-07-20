import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { OrderFilterPageProps, OrderPageProps } from '@/components/feature/order/order-data-section';
import { createUndefinedObject } from '@/helper/create-undefined-object';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import order from '@/routes/order';
import type { Outlet } from '@/types/feature/outlet/outlet';

const FILTER_KEYS: (keyof OrderFilterPageProps)[] = [
    'search',
    'status',
    'paymentMethod',
    'startDate',
    'endDate',
    'timeStatus',
    'dateType',
    'outletIdSelected',
    'outletSearch',
];

const FETCH_COMMON = {
    preserveState: true,
    preserveScroll: true,
};

const FETCH_ONLY_ORDERS = {
    ...FETCH_COMMON,
    only: ['orders', 'outlets', 'outletSelected'],
};

const FETCH_ONLY_OUTLETS = {
    ...FETCH_COMMON,
    only: ['outlets'],
};

const FETCH_ONLY_ALL = {
    ...FETCH_COMMON,
    only: [
        'orderStatusOptions',
        'orderTimeStatusOptions',
        'orderDateTypeOptions',
        'paymentMethodOptions',
        'orderTransitionRules',
        'filters',
        'orders',
        'outlets',
        'outletSelected',
    ],
};

type DateFilter = Pick<OrderFilterPageProps, 'startDate' | 'endDate'>;

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

export function useOrderFilters() {
    const { filters } = usePage<OrderPageProps>().props;

    const [filterState, setFilterState] = useState<OrderFilterPageProps>(filters);
    const [resetKey, setResetKey] = useState(0);

    const filterStateRef = useRef(filterState);

    useEffect(() => {
        filterStateRef.current = filterState;
    }, [filterState]);

    const shouldDisableSearch = !filterState.search && !filterState.outletIdSelected;

    const updateFilterState = (params: Partial<OrderFilterPageProps>) => {
        setFilterState((prev) => ({
            ...prev,
            ...params,
        }));
    };

    const getCurrentFilters = (params: Partial<OrderFilterPageProps> = {}): OrderFilterPageProps => ({
        ...filters,
        ...filterStateRef.current,
        ...params,
    });

    const fetchOrders = (params: OrderFilterPageProps) => {
        router.get(order.index().url, params, FETCH_ONLY_ORDERS);
    };

    const fetchOutlets = (params: OrderFilterPageProps) => {
        router.get(order.index().url, params, FETCH_ONLY_OUTLETS);
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

        fetchOrders(getCurrentFilters());
    };

    const handleSubmitModalFilters = (
        e: React.SubmitEvent<HTMLFormElement>,
        modalFilters: Partial<OrderFilterPageProps>,
    ) => {
        e.preventDefault();

        const nextFilters = getCurrentFilters(modalFilters);
        const isValidDate = validateDateFilter(nextFilters);

        if (!isValidDate) {
            return;
        }

        setFilterState(nextFilters);
        fetchOrders(nextFilters);
    };

    const handleClearSearch = () => {
        const clearedFilters = getCurrentFilters({
            search: undefined,
            outletIdSelected: undefined,
            outletSearch: undefined,
        });

        setFilterState(clearedFilters);
        setResetKey((prev) => prev + 1);

        router.get(order.index().url, clearedFilters, FETCH_ONLY_ALL);
    };

    const handleClearAllFilters = () => {
        const emptyFilters = createUndefinedObject(FILTER_KEYS);

        setFilterState(emptyFilters);
        setResetKey((prev) => prev + 1);

        router.get(order.index().url, emptyFilters, FETCH_ONLY_ALL);
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
