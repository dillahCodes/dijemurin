import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { usePenggunaTambah } from '@/hooks/feature/pengguna/use-pengguna-tambah';

export function PenggunaTambahForm() {
    const { setData, errors, clearErrors, handleSubmit, processing, handleCancel } = usePenggunaTambah();

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama <span className="text-destructive">*</span>
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

                    <Field data-invalid={!!errors.email}>
                        <FieldLabel htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                clearErrors('email');
                            }}
                            id="email"
                            type="text"
                            placeholder="Contoh: budi@gmail.com"
                        />
                        <Activity mode={errors.email ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" variant="outline" disabled={processing} onClick={handleCancel}>
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
