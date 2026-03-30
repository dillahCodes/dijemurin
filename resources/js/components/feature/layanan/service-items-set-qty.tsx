import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useCart } from '@/context/feature/cart/cart-context';
import { cartItemSchema } from '@/schema/feature/cart/cart-item-schema';
import type { ServiceItem } from '@/types/feature/layanan';
import { Weight } from 'lucide-react';
import { Activity, useState } from 'react';
import z from 'zod';

interface ServiceItemsSetQtyProps {
    item: ServiceItem;
    mode: 'SET_ITEM' | 'SET_QTY';
    defaultQty?: number;
    onCancel?: () => void;
    afterSubmit?: () => void;
}

type ErrorQty = string | null;

export function ServiceItemsSetQty({ item, defaultQty, onCancel, afterSubmit, mode }: ServiceItemsSetQtyProps) {
    const [error, setError] = useState<ErrorQty>(null);
    const { dispatch } = useCart();

    const handleCloseModal = () => {
        onCancel?.();
    };

    const handleChange = () => {
        if (error) setError(null);
    };

    const handleValidateQty = (qty: number) => {
        const result = cartItemSchema.safeParse({ qty });

        if (!result.success) {
            const zError = z.treeifyError(result.error);
            const firstError = zError.properties?.qty?.errors[0] ?? null;
            setError(firstError);

            return true;
        }

        return false;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const qty = Number(formData.get('qty'));

        const isError = handleValidateQty(qty);
        if (isError) return;

        const isSetItem = mode === 'SET_ITEM';
        isSetItem
            ? dispatch({ type: 'SET_ITEM', payload: { qty, data: item } })
            : dispatch({ type: 'SET_QTY', payload: { id: item.id, qty } });

        afterSubmit?.();
    };

    return (
        <form className="mt-8 flex h-full w-full flex-col" onSubmit={handleSubmit}>
            <FieldSet className="flex h-full flex-1 flex-col">
                <FieldGroup className="flex h-full flex-1 flex-col">
                    <Field data-invalid={!!error}>
                        <FieldLabel htmlFor="qty">
                            Kuantitas <span className="text-destructive">*</span>
                        </FieldLabel>

                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>
                                    <Weight />
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                placeholder="0.00"
                                id="qty"
                                name="qty"
                                inputMode="decimal"
                                defaultValue={defaultQty}
                                onChange={handleChange}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupText>{item.unit}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>

                        <Activity mode={error ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{error}</FieldDescription>
                        </Activity>

                        <Activity mode={!error ? 'visible' : 'hidden'}>
                            <FieldDescription>gunakan titik (.) untuk desimal, contoh: 2.5</FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'horizontal'} className="mt-auto justify-end pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            Batal
                        </Button>
                        <Button type="submit">{mode === 'SET_ITEM' ? 'Buat Pesanan' : 'Simpan'}</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
