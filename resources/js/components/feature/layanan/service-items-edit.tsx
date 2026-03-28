import { useForm } from '@inertiajs/react';
import { Activity } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useModal } from '@/components/ui/modal';
import { formatPrice } from '@/helper/formatted-price';
import layanan from '@/routes/layanan';

interface DefaultData {
    name: string;
    description: string;
    time: string;
    price: number;
    unit: string;
}

interface ServiceItemsEditProps {
    service_id: number;
    service_item_id: number;
    defaultData: DefaultData;
}

export function ServiceItemsEdit({ service_id, service_item_id, defaultData }: ServiceItemsEditProps) {
    const modal = useModal();
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        name: defaultData.name,
        description: defaultData.description,
        time: defaultData.time,
        price: defaultData.price,
        unit: defaultData.unit,
        service_id,
    });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-edit-service-item');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(layanan.items.update([service_id, service_item_id]).url, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-edit-service-item');
                toast.success('Price list berhasil diupdate', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Gagal mengupdate price list', { position: 'top-center' });
            },
        });
    };

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
                            defaultValue={data.price}
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
