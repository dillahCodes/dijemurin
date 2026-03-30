import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/helper/formatted-price';
import { useServiceItemsAdd } from '@/hooks/feature/layanan/use-service-items-add';
import type { ServiceItemsAddProps } from '@/hooks/feature/layanan/use-service-items-add';

export function ServiceItemsAdd(props: ServiceItemsAddProps) {
    const { data, setData, processing, errors, clearErrors, handleCancel, handleSubmit } = useServiceItemsAdd(props);

    return (
        <form onSubmit={handleSubmit} className="mt-8 max-h-[40dvh] w-full overflow-y-auto">
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama Layanan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                            id="name"
                            type="text"
                            placeholder="Contoh: Laundry 4 Jam Selesai"
                        />
                        <Activity mode={errors.name ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.name}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.description}>
                        <FieldLabel htmlFor="description">
                            Deskripsi <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.description}
                            onChange={(e) => {
                                setData('description', e.target.value);
                                clearErrors('description');
                            }}
                            id="description"
                            type="text"
                            placeholder="Contoh: Cuci Kering + Setrika + Packing"
                        />
                        <Activity mode={errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.description}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.time}>
                        <FieldLabel htmlFor="time">
                            Waktu Pengerjaan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.time}
                            onChange={(e) => {
                                setData('time', e.target.value);
                                clearErrors('time');
                            }}
                            id="time"
                            type="text"
                            placeholder="Contoh: 4 Jam"
                        />
                        <Activity mode={errors.time ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.time}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.price}>
                        <FieldLabel htmlFor="price">
                            Harga <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            aria-invalid={!!errors.price}
                            type="text"
                            inputMode="numeric"
                            placeholder="50.000"
                            value={formatPrice(data.price)}
                            onChange={(event) => {
                                const rawValue = event.target.value.replace(/\D/g, '');
                                setData('price', Number(rawValue));
                                clearErrors('price');
                            }}
                        />
                        <Activity mode={errors.price ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.price}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.unit}>
                        <FieldLabel htmlFor="unit">
                            Satuan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.unit}
                            onChange={(e) => {
                                setData('unit', e.target.value);
                                clearErrors('unit');
                            }}
                            id="unit"
                            type="text"
                            placeholder="Contoh: Kg"
                        />
                        <Activity mode={errors.unit ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.unit}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'menyimpan...' : 'Simpan'}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
