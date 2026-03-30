import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/helper/formatted-price';
import { useServiceItemsEdit } from '@/hooks/feature/layanan/use-service-items-edit';
import type { ServiceItemsEditProps } from '@/hooks/feature/layanan/use-service-items-edit';

export function ServiceItemsEdit(props: ServiceItemsEditProps) {
    const { data, setData, processing, errors, clearErrors, handleCancel, handleSubmit } = useServiceItemsEdit(props);

    return (
        <form onSubmit={handleSubmit} className="mt-8 max-h-[40dvh] w-full overflow-y-auto">
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">Nama Layanan</FieldLabel>
                        <Input
                            aria-invalid={!!errors.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                            id="name"
                            type="text"
                            placeholder="Contoh: Setrika 4 Jam Selesai"
                            defaultValue={data.name}
                        />
                        <Activity mode={errors.name ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.name}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.description}>
                        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                        <Input
                            aria-invalid={!!errors.description}
                            onChange={(e) => {
                                setData('description', e.target.value);
                                clearErrors('description');
                            }}
                            id="description"
                            type="text"
                            placeholder="Contoh: Setrika, dan Packing"
                            defaultValue={data.description}
                        />
                        <Activity mode={errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.description}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.time}>
                        <FieldLabel htmlFor="time">Waktu Pengerjaan</FieldLabel>
                        <Input
                            aria-invalid={!!errors.time}
                            onChange={(e) => {
                                setData('time', e.target.value);
                                clearErrors('time');
                            }}
                            id="time"
                            type="text"
                            placeholder="Contoh: 4 Jam"
                            defaultValue={data.time}
                        />
                        <Activity mode={errors.time ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.time}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.price}>
                        <FieldLabel htmlFor="price">Harga</FieldLabel>

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
                        <FieldLabel htmlFor="unit">Satuan</FieldLabel>
                        <Input
                            aria-invalid={!!errors.unit}
                            onChange={(e) => {
                                setData('unit', e.target.value);
                                clearErrors('unit');
                            }}
                            id="unit"
                            type="text"
                            placeholder="Contoh: Kg"
                            defaultValue={data.unit}
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
