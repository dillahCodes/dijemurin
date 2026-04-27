import { usePage } from '@inertiajs/react';
import { Activity } from 'react';
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
import { useLayananTambah } from '@/hooks/feature/layanan/use-layanan-tambah';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { LayananTambahSectionProps } from './layanan-tambah-section';
import { RoleHelper } from '@/helper/role-helper';
import { UserRole } from '@/types/feature/user/user';

export function LayananTambahForm() {
    const { outlets, auth } = usePage<LayananTambahSectionProps>().props;
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    const defaultOutletId = hasSuperAdmin ? undefined : (auth.user.outlet_id as number | null);
    const { form, handlers } = useLayananTambah(defaultOutletId);
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
                            <Combobox name="outlet_id" items={outletsData} onInputValueChange={handlers.handleFetchOutlet}>
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
                            {form.processing ? 'menyimpan...' : 'Simpan'}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
