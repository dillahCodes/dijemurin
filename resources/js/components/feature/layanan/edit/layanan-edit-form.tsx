import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RoleHelper } from '@/helper/role-helper';
import { useLayananEdit } from '@/hooks/feature/layanan/use-layanan-edit';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import { usePage } from '@inertiajs/react';
import { Activity } from 'react';
import type { LayananEditSectionProps } from './layanan-edit-section';

export function LayananEditForm() {
    const { form, handlers } = useLayananEdit();
    const { outlets, service, auth } = usePage<LayananEditSectionProps>().props;

    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);
    const outletsData = outlets.data;

    return (
        <form className="flex flex-col gap-6" onSubmit={handlers.handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!form.errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama Layanan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!form.errors.name}
                            required
                            tabIndex={1}
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Contoh: Laundry Karpet"
                            defaultValue={service.name}
                            onChange={(e) => {
                                form.setData('name', e.target.value);
                                form.clearErrors('name');
                            }}
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
                            required
                            tabIndex={2}
                            name="description"
                            id="description"
                            type="text"
                            placeholder="Contoh: Jasa cuci karpet"
                            defaultValue={service.description}
                            onChange={(e) => {
                                form.setData('description', e.target.value);
                                form.clearErrors('description');
                            }}
                        />
                        <Activity mode={form.errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.description}</FieldDescription>
                        </Activity>
                    </Field>

                    <Activity mode={hasSuperAdmin ? 'visible' : 'hidden'}>
                        <Field data-invalid={!!form.errors.outlet_id}>
                            <FieldLabel htmlFor="outlet_id">
                                Outlet <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Combobox
                                name="outlet_id"
                                defaultValue={service.outlet.name}
                                items={outletsData}
                                onInputValueChange={handlers.handleFetchOutlet}
                            >
                                <ComboboxInput placeholder="Pilih Outlet" showClear />
                                <ComboboxContent>
                                    <Activity mode={!!outletsData.length ? 'visible' : 'hidden'}>
                                        <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>
                                    </Activity>
                                    <ComboboxList>
                                        {outletsData.map((item: Outlet) => (
                                            <ComboboxItem
                                                key={item.id}
                                                value={item.name}
                                                onClick={handlers.handleSetOutletChange(item.id)}
                                            >
                                                {item.name}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <Activity mode={form.errors.outlet_id ? 'visible' : 'hidden'}>
                                <FieldDescription className="text-destructive">{form.errors.outlet_id}</FieldDescription>
                            </Activity>
                        </Field>
                    </Activity>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" onClick={handlers.handleCancel} variant="outline" disabled={form.processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'memperbarui...' : 'Simpan Perubahan'}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
