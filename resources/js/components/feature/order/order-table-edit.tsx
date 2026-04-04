import { TriangleAlert } from 'lucide-react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrderEdit } from '@/hooks/feature/order/use-order-edit';
import type { Order } from '@/types/feature/order';
import type { OrderOption } from './order-data-section';

interface OrderTableEditProps {
    order: Order;
    orderStatusOptions: OrderOption[];
}

export function OrderTableEdit({ order, orderStatusOptions }: OrderTableEditProps) {
    const {
        processing,
        handleCloseModal,
        handleStatusChange,
        shouldDisableSaveButton,
        handleSubmit,
        statusValue,
        shouldDisableStatusSelect,
        shouldShowWarning,
    } = useOrderEdit(order);

    return (
        <form className="mt-8 flex flex-col gap-8" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select value={statusValue} onValueChange={handleStatusChange} disabled={shouldDisableStatusSelect}>
                            <SelectTrigger id="status" className="w-full cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent className="z-1000">
                                {orderStatusOptions.map((opt: OrderOption) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Activity mode={shouldShowWarning ? 'visible' : 'hidden'}>
                            <FieldDescription className="flex gap-1 text-xs text-yellow-600">
                                <TriangleAlert className="size-4" />
                                <span>
                                    Status tidak bisa diubah kembali jika sudah{' '}
                                    <span className="font-semibold italic">diambil</span> atau{' '}
                                    <span className="font-semibold italic">dibatalkan</span>
                                </span>
                            </FieldDescription>
                        </Activity>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleCloseModal}>
                    Batal
                </Button>
                <Button disabled={shouldDisableSaveButton} type="submit">
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
        </form>
    );
}
