import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItemType } from '@/context/feature/cart/cart-context';
import { useCart } from '@/context/feature/cart/cart-context';
import { formatPrice } from '@/helper/formatted-price';
import { useCartEditItemQty } from '@/hooks/feature/cart/uce-cart-edit-item-qty';

interface OrderItemCardProps {
    item: CartItemType;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
    const { handleOpenModalEdit } = useCartEditItemQty({ item });
    const { dispatch } = useCart();

    const id = item.data.id;

    const handleRemove = () => {
        dispatch({ type: 'REMOVE_SERVICE_ITEM', payload: { id } });
    };

    return (
        <div className="flex items-center justify-between gap-8 border-b border-sidebar-border pb-2">
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="line-clamp-1 text-sm font-medium">{item.data.name}</span>
                <span className="text-xs text-muted-foreground">
                    {formatPrice(item.data.price)} x {item.qty} {item.data.unit}
                </span>
            </div>

            <span className="shrink-0 text-sm font-semibold">{formatPrice(item.data.price * item.qty)}</span>

            <div className="flex shrink-0 items-center gap-2">
                <Button
                    size="icon"
                    onClick={handleOpenModalEdit}
                    variant="outline"
                    type="button"
                    className="size-8 shrink-0"
                >
                    <Pencil className="size-4" />
                </Button>
                <Button
                    onClick={handleRemove}
                    size="icon"
                    variant="outline"
                    type="button"
                    className="size-8 shrink-0 text-destructive"
                >
                    <Trash className="size-4" />
                </Button>
            </div>
        </div>
    );
}
