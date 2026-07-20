import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ServicePageProps } from '@/components/feature/layanan/service-section';
import { useCart } from '@/context/feature/cart/cart-context';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import layanan from '@/routes/layanan';
import type { Outlet } from '@/types/feature/outlet/outlet';

export function useServiceOutletPicker() {
    const { outlets } = usePage<ServicePageProps>().props;

    const { dispatch, state } = useCart();
    const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
    const isDifferentOutlet = state.outlet_id !== selectedOutlet?.id;

    const handleFetchOutlets = useDebouncedCallback((value: string) => {
        if (value.length < 3) {
            return;
        }

        const params = { outletSearch: value };
        const config = { preserveState: true, preserveScroll: true, only: ['outlets'] };

        router.get(layanan.index().url, params, config);
    }, 300);

    const handleSelectOutlet = (outlet: Outlet) => {
        setSelectedOutlet(outlet);
    };

    const handleConfirm = () => {
        if (!selectedOutlet) {
            return;
        }

        if (isDifferentOutlet) {
            dispatch({ type: 'CLEAR' });
        }

        dispatch({ type: 'SET_OUTLET_ID', payload: selectedOutlet.id });
        router.get(layanan.index().url, { outletIdSelected: selectedOutlet.id });
    };

    return {
        data: {
            outlets: outlets?.data ?? [],
            selectedOutlet,
        },
        handlers: {
            handleFetchOutlets,
            handleSelectOutlet,
            handleConfirm,
        },
    };
}
