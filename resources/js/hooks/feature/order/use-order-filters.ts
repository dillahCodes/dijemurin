import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { OrderFilterPageProps } from '@/components/feature/order/order-data-section';
import order from '@/routes/order';

type FilterValue = string | undefined;

const isEmpty = (value: FilterValue) => value === '' || value === undefined;

const cleanQuery = (params: Record<string, FilterValue>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredEmtyparams = Object.entries(params).filter(([_key, value]) => !isEmpty(value));

    return Object.fromEntries(filteredEmtyparams);
};

export function useOrderFilters(initialValues: OrderFilterPageProps) {
    const [filterState, setFilterState] = useState(initialValues);

    const options = { preserveState: true, replace: true };

    const setQuery = (params: Record<string, FilterValue>) => {
        const merged = { ...initialValues, ...params };
        const cleaned = cleanQuery(merged);
        router.get(order.index().url, cleaned, options);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setQuery({ search: filterState.search || undefined });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterState((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleClearSearch = () => {
        setFilterState((prev) => ({ ...prev, search: '' }));
        setQuery({ search: undefined });
    };

    const handleFilterStatus = (status: string) => {
        const value = status === 'all' ? undefined : status;

        setFilterState((prev) => ({ ...prev, status: value ?? '' }));
        setQuery({ status: value });
    };

    const handleFilterPaymentMethod = (paymentMethod: string) => {
        const value = paymentMethod === 'all' ? undefined : paymentMethod;

        setFilterState((prev) => ({ ...prev, payment_method: value ?? '' }));
        setQuery({ payment_method: value });
    };

    const handleFilterDate = (start_date: string, end_date: string) => {
        setFilterState((prev) => ({ ...prev, start_date: start_date, end_date: end_date }));
        setQuery({ start_date: start_date || undefined, end_date: end_date || undefined });
    };

    const shouldDisableSearch = !filterState.search.length && !initialValues.search;

    return {
        filterState,
        conditions: { shouldDisableSearch },

        searchHandle: {
            handleSubmit,
            handleChange,
        },

        filterHandle: {
            handleFilterStatus,
            handleFilterPaymentMethod,
            handleFilterDate,
        },

        clearHandle: {
            handleClearSearch,
        },
    };
}
