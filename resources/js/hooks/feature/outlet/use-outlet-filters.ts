import { OutletFilterPageProps } from '@/components/feature/outlet/outlet-section';
import outlet from '@/routes/outlet';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type FilterValue = string | undefined;

const isEmpty = (value: FilterValue) => value === '' || value === undefined;

const cleanQuery = (params: Record<string, FilterValue>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredEmtyparams = Object.entries(params).filter(([_key, value]) => !isEmpty(value));

    return Object.fromEntries(filteredEmtyparams);
};

export function useOutletFilters(initialValues: OutletFilterPageProps) {
    const [filterState, setFilterState] = useState(initialValues);

    const options = { preserveState: true, replace: true };

    const setQuery = (params: Record<string, FilterValue>) => {
        const merged = { ...initialValues, ...params };
        const cleaned = cleanQuery(merged);
        router.get(outlet.index().url, cleaned, options);
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

    const searchLength = filterState.search?.length ?? 0;
    const initialSearchLength = initialValues?.search?.length ?? 0;
    const shouldDisableSearch = !searchLength && !initialSearchLength;

    return {
        filterState,
        conditions: { shouldDisableSearch },
        searchHandle: { handleSubmit, handleChange },
        filterHandle: { handleFilterStatus },
        clearHandle: { handleClearSearch },
    };
}
