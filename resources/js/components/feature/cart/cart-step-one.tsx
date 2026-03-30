import { ShoppingCart } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet, Field } from '@/components/ui/field';
import type { CartItemType } from '@/context/feature/cart/cart-context';
import { useCartStepOne } from '@/hooks/feature/cart/use-cart-step-one';
import { OrderItemCard } from './order-item-card';

function EmptyCart() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 pt-10 text-center text-muted-foreground">
            <ShoppingCart className="size-8 opacity-20" />
            <p className="text-sm">Belum ada layanan yang dipilih</p>
        </div>
    );
}

function OrderList({ items }: { items: CartItemType[] }) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
                <OrderItemCard key={idx} item={item} />
            ))}
        </div>
    );
}

export function CartStepOne({ onCancel }: { onCancel: () => void }) {
    const { items, hasItems, handleNext } = useCartStepOne(onCancel);

    return (
        <>
            <div className="relative flex h-auto min-h-0 w-full flex-1 flex-col py-3.5">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-background to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-background to-transparent" />

                <div className="no-scrollbar max-h-[45dvh] w-full flex-1 overflow-y-auto px-1">
                    <Activity mode={hasItems ? 'visible' : 'hidden'}>
                        <OrderList items={items} />
                    </Activity>

                    <Activity mode={hasItems ? 'hidden' : 'visible'}>
                        <EmptyCart />
                    </Activity>
                </div>
            </div>

            <form className="mt-auto flex w-full shrink-0 flex-col pt-4">
                <FieldSet>
                    <FieldGroup>
                        <Field orientation="horizontal" className="flex items-center gap-3">
                            <Button onClick={onCancel} type="button" variant="outline" className="flex-1 cursor-pointer">
                                Batal
                            </Button>
                            <Button
                                type="button"
                                disabled={!hasItems}
                                onClick={handleNext}
                                className="flex-1 cursor-pointer"
                            >
                                Lanjut
                            </Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </>
    );
}
