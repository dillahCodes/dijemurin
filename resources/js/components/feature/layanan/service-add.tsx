import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useServiceAdd } from '@/hooks/feature/layanan/use-service-add';

export function ServiceAdd() {
    const { setData, processing, errors, clearErrors, handleCancel, handleSubmit } = useServiceAdd();

    return (
        <form onSubmit={handleSubmit} className="mt-8 w-full">
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
                            placeholder="Contoh: Laundry Karpet"
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
                            placeholder="Contoh: Jasa cuci karpet"
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
