import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const DEBOUNCEMS = 400;

export function useSearch(initialValue: string, url: string) {
    const [search, setSearch] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(url, { search: search || undefined }, { preserveState: true, replace: true });
        }, DEBOUNCEMS);

        return () => clearTimeout(timeout);
    }, [search, url]);

    return { search, setSearch };
}
