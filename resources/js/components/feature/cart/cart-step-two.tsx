import { formatPrice } from '@/helper/formatted-price';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Activity } from 'react';
import { useCartStepTwo } from '@/hooks/feature/cart/use-cart-step-two';

export function CartStepTwo({ onCancel }: { onCancel: () => void }) {
    const {
        customerName,
        paymentMethod,
        paymentAmount,
        totalBayar,
        kembalian,
        disabledSubmitButton,
        handleSubmit,
        handleBack,
        setCustomerName,
        setPaymentMethod,
        setPaymentAmount
    } = useCartStepTwo(onCancel);

    return (
        <form onSubmit={handleSubmit} className="flex w-full shrink-0 flex-col flex-1 min-h-0 pt-2 pb-4 overflow-y-auto px-1">
            <FieldSet className="flex-1 flex flex-col">
                <FieldGroup className="flex flex-col flex-1">
                    <Field>
                        <FieldLabel htmlFor="costumer_name">
                            Nama Pelanggan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="costumer_name"
                            type="text"
                            className="text-sm sm:text-base"
                            placeholder="Contoh: Budi Santoso"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                            Metode Pembayaran <span className="text-destructive">*</span>
                        </FieldLabel>
                        <div className="flex gap-2">
                            {(['cash', 'qris'] as const).map((method) => (
                                <Button
                                    key={method}
                                    type="button"
                                    variant={paymentMethod === method ? 'default' : 'outline'}
                                    className="flex-1 capitalize"
                                    onClick={() => setPaymentMethod(method)}
                                >
                                    {method}
                                </Button>
                            ))}
                        </div>
                    </Field>

                    <Activity mode={paymentMethod === 'cash' ? 'visible' : 'hidden'}>
                        <Field>
                            <FieldLabel htmlFor="payment_amount">
                                Nominal pembayaran <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                id="payment_amount"
                                type="text"
                                className="text-sm sm:text-base"
                                inputMode="numeric"
                                placeholder="Rp. 0"
                                value={formatPrice(paymentAmount)}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                        </Field>
                    </Activity>

                    {/* Summary Section */}
                    <div className="flex flex-col items-center pt-2 text-sm mt-auto mb-4">
                        <div className="grid w-full max-w-[250px] grid-cols-[auto_auto] items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {[
                                { label: 'Nama Pelanggan', value: customerName || '-', show: true },
                                {
                                    label: 'Nominal Pembayaran',
                                    value: formatPrice(paymentAmount),
                                    show: paymentMethod === 'cash',
                                },
                                { label: 'total bayar', value: formatPrice(totalBayar), show: true },
                                {
                                    label: 'kembalian',
                                    value: formatPrice(kembalian > 0 ? kembalian : 0),
                                    show: paymentMethod === 'cash',
                                },
                            ].map((item, idx) => (
                                <Activity key={idx} mode={item.show ? 'visible' : 'hidden'}>
                                    <span className="text-right">{item.label}</span>
                                    <span className="text-left font-medium text-foreground">: {item.value}</span>
                                </Activity>
                            ))}
                        </div>
                    </div>

                    <Field orientation="horizontal" className="flex items-center gap-3 pt-4 border-t border-sidebar-border mt-auto shrink-0">
                        <Button onClick={handleBack} type="button" variant="outline" className="flex-1 cursor-pointer">
                            Kembali
                        </Button>
                        <Button type="submit" disabled={disabledSubmitButton} className="flex-1 cursor-pointer">
                            Tambah Pesanan
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
