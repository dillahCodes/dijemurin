import { useCart } from '@/context/feature/cart/cart-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart } from 'lucide-react';
import { Activity } from 'react';
import { CartStepOne } from './feature/cart/cart-step-one';
import { CartStepTwo } from './feature/cart/cart-step-two';
import { Avatar, AvatarBadge, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useDrawer } from './ui/drawer';

function useDrawerCart() {
    const isMobile = useIsMobile();
    const drawer = useDrawer();
    const { dispatch } = useCart();

    const handleCloseModal = () => {
        dispatch({ type: 'SET_CHECKOUT_STEP', payload: 1 });
        drawer.close('order-cart');
    };

    const handleOpen = () => {
        const baseConfig = {
            content: <DrawerContent onClose={handleCloseModal} />,
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

    return { handleOpen, handleCloseModal };
}

function DrawerContent({ onClose }: { onClose: () => void }) {
    const { state } = useCart();

    return (
        <Card className="flex min-h-full flex-1 flex-col border-none p-4! shadow-none">
            <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-0!">
                <div className="flex flex-col gap-1.5">
                    <CardTitle>Buat Pesanan</CardTitle>
                    <CardDescription>
                        {state.checkout_step === 1 ? 'Kelola item layanan Anda' : 'Lengkapi form untuk membuat pesanan'}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="mt-4 flex min-h-0 flex-1 flex-col justify-between overflow-hidden border-none p-0!">
                <Activity mode={state.checkout_step === 1 ? 'visible' : 'hidden'}>
                    <CartStepOne onCancel={onClose} />
                </Activity>
                <Activity mode={state.checkout_step === 2 ? 'visible' : 'hidden'}>
                    <CartStepTwo onCancel={onClose} />
                </Activity>
            </CardContent>
        </Card>
    );
}

export function AppSidebarCart() {
    const { handleOpen } = useDrawerCart();
    const { state } = useCart();
    const totalItems = state.service_items.length;

    return (
        <Avatar className="size-10 cursor-pointer" onClick={handleOpen}>
            <AvatarFallback>
                <ShoppingCart className="size-5" />
            </AvatarFallback>

            <Activity mode={totalItems ? 'visible' : 'hidden'}>
                <AvatarBadge className="top-0! size-4! bg-destructive text-sm text-white">{totalItems}</AvatarBadge>
            </Activity>
        </Avatar>
    );
}
