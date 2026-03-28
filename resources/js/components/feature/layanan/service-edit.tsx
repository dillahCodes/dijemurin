import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useModal } from '@/components/ui/modal';
import layanan from '@/routes/layanan';
import { useForm } from '@inertiajs/react';
import { Activity } from 'react';
import { toast } from 'sonner';

interface ServiceEditProps {
    serviceId: number;
    title: string;
    description: string;
}

export function ServiceEdit({ serviceId, title, description }: ServiceEditProps) {
    const modal = useModal();
    const { setData, patch, processing, errors, clearErrors } = useForm({ name: title, description: description });

    const handleCancel = () => {
        clearErrors();
        modal.close('modal-edit-service');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(layanan.update(serviceId).url, {
            onSuccess: () => {
                clearErrors();
                modal.close('modal-edit-service');
                toast.success('Layanan berhasil diupdate', { position: 'top-center' });
            },
            onError: () => {
                toast.error('Layanan gagal diupdate', { position: 'top-center' });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 w-full">
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
                            placeholder="Contoh: Laundry Karpet"
                            defaultValue={title}
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
                            placeholder="Contoh: Jasa cuci karpet"
                            defaultValue={description}
                        />
                        <Activity mode={errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.description}</FieldDescription>
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
