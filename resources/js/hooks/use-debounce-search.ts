import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useDebounceSearch(initialValue: string, url: string, debounceMs: number = 400) {
    const [search, setSearch] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(url, { search: search || undefined }, { preserveState: true, replace: true });
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [search, url, debounceMs]);

    return { search, setSearch };
}
