import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrderEdit } from '@/hooks/feature/order/use-order-edit';
import { Order } from '@/types/feature/order';
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
    } = useOrderEdit(order);

    return (
        <form className="mt-8 flex flex-col gap-8" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select value={statusValue} onValueChange={handleStatusChange} disabled={shouldDisableStatusSelect}>
                            <SelectTrigger className="w-full cursor-pointer">
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
