import type React from 'react';
import { useDrawer } from '@/components/ui/drawer';
import { useCart } from '@/context/feature/cart/cart-context';
import { useIsMobile } from '@/hooks/use-mobile';

export function useAppSidebarCart() {
    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const { state, dispatch } = useCart();
    const totalItems = state.service_items.length;

    const handleCloseModal = () => {
        dispatch({ type: 'SET_CHECKOUT_STEP', payload: 1 });
        drawer.close('order-cart');
    };

    const handleOpen = (content: React.ReactNode) => {
        const baseConfig = {
            content,
            onDrawerClose: () => {
                dispatch({ type: 'SET_CHECKOUT_STEP', payload: 1 });
            },
        };

        if (isMobile) {
            drawer.open({
                ...baseConfig,
                id: 'order-cart',
                wrapperClassName: 'rounded-t-sm h-dvh flex flex-col',
            });

            return;
        }

        drawer.open({
            ...baseConfig,
            id: 'order-cart',
            placement: 'right',
            wrapperClassName: 'rounded-l-md w-[45dvw] lg:w-[35dvw] xl:w-[30dvw] 2xl:w-[25dvw] flex flex-col',
        });
    };

    return { totalItems, handleOpen, handleCloseModal };
}
