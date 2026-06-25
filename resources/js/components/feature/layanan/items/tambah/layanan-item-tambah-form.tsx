import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/helper/formatted-price';
import { useLayananItemTambah } from '@/hooks/feature/layanan/use-layanan-item-tambah';
import { TimeField } from '../time-field';

export function LayananItemTambahForm() {
    const { form, handlers } = useLayananItemTambah();

    return (
        <form onSubmit={handlers.handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!form.errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama Layanan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!form.errors.name}
                            onChange={(e) => {
                                form.setData('name', e.target.value);
                                form.clearErrors('name');
                            }}
                            id="name"
                            type="text"
                            placeholder="Contoh: Laundry 4 Jam Selesai"
                        />
                        <Activity mode={form.errors.name ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.name}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!form.errors.description}>
                        <FieldLabel htmlFor="description">
                            Deskripsi <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!form.errors.description}
                            onChange={(e) => {
                                form.setData('description', e.target.value);
                                form.clearErrors('description');
                            }}
                            id="description"
                            type="text"
                            placeholder="Contoh: Cuci Kering + Setrika + Packing"
                        />
                        <Activity mode={form.errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.description}</FieldDescription>
                        </Activity>
                    </Field>

                    <TimeField
                        valueNumber={form.data.time_number}
                        valueType={form.data.time_type}
                        errorNumber={form.errors.time_number}
                        errorType={form.errors.time_type}
                        onChangeNumber={(val) => {
                            form.setData('time_number', val);
                            form.clearErrors('time_number');
                        }}
                        onChangeType={(val) => {
                            form.setData('time_type', val);
                            form.clearErrors('time_type');
                        }}
                    />

                    <Field data-invalid={!!form.errors.price}>
                        <FieldLabel htmlFor="price">
                            Harga <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            aria-invalid={!!form.errors.price}
                            type="text"
                            inputMode="numeric"
                            placeholder="50.000"
                            value={formatPrice(form.data.price)}
                            onChange={(event) => {
                                const rawValue = event.target.value.replace(/\D/g, '');
                                form.setData('price', Number(rawValue));
                                form.clearErrors('price');
                            }}
                        />
                        <Activity mode={form.errors.price ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.price}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!form.errors.unit}>
                        <FieldLabel htmlFor="unit">
                            Satuan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!form.errors.unit}
                            onChange={(e) => {
                                form.setData('unit', e.target.value);
                                form.clearErrors('unit');
                            }}
                            id="unit"
                            type="text"
                            placeholder="Contoh: Kg"
                        />
                        <Activity mode={form.errors.unit ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.unit}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" variant="outline" onClick={handlers.handleCancel} disabled={form.processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'menyimpan...' : 'Simpan'}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
