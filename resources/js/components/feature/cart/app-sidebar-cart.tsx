import { ShoppingCart } from 'lucide-react';
import { Activity } from 'react';

import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/feature/cart/cart-context';
import { useAppSidebarCart } from '@/hooks/feature/cart/use-app-sidebar-cart';

import { CartStepOne } from './cart-step-one';
import { CartStepTwo } from './cart-step-two';

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
    const { totalItems, handleOpen, handleCloseModal } = useAppSidebarCart();

    const openDrawer = () => {
        handleOpen(<DrawerContent onClose={handleCloseModal} />);
    };

    return (
        <Avatar className="size-10 cursor-pointer" onClick={openDrawer}>
            <AvatarFallback>
                <ShoppingCart className="size-5" />
            </AvatarFallback>

            <Activity mode={totalItems ? 'visible' : 'hidden'}>
                <AvatarBadge className="top-0! size-4! bg-destructive text-sm text-white">{totalItems}</AvatarBadge>
            </Activity>
        </Avatar>
    );
}
