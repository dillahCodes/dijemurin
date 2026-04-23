import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePenggunaEdit } from '@/hooks/feature/pengguna/use-pengguna-edit';
import { User } from '@/types/feature/user/user';
import { Activity } from 'react';

export function PenggunaEditForm() {
    const {
        errors,
        handleSubmit,
        processing,
        handleCancel,
        userStatusOptions,
        data,
        handleStatusChange,
        handleFieldChange,
    } = usePenggunaEdit();

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
                            onChange={handleFieldChange}
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
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
                            onChange={handleFieldChange}
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="Contoh: budi@gmail.com"
                        />
                        <Activity mode={errors.email ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.status}>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select value={data.status} onValueChange={handleStatusChange}>
                            <SelectTrigger id="status" className="w-full cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent className="z-1000">
                                {userStatusOptions.map((opt: User['status']) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Activity mode={errors.status ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.status}</FieldDescription>
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
