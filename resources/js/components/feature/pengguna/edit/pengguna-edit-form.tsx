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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleHelper } from '@/helper/role-helper';
import { usePenggunaEdit } from '@/hooks/feature/pengguna/use-pengguna-edit';
import { useSearchOutlet } from '@/hooks/feature/search/use-search-outlet';
import pengguna from '@/routes/pengguna';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { User } from '@/types/feature/user/user';
import { UserRole } from '@/types/feature/user/user';
import type { PenggunaEditPageProps } from './pengguna-edit-section';

export function PenggunaEditForm() {
    const { user, auth, outlets, userStatusOptions, userRoleOptions } = usePage<PenggunaEditPageProps>().props;

    const { form, handlers } = usePenggunaEdit();
    const { data, setData, errors, clearErrors, processing } = form;

    const { handleFetchComboboxOutlet } = useSearchOutlet({ url: pengguna.edit(user.data.id).url });
    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <form onSubmit={handlers.handleSubmit} className="w-full">
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.name}
                            onChange={handlers.handleFieldChange}
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
                            onChange={handlers.handleFieldChange}
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

                    <Field data-invalid={!!errors.role}>
                        <FieldLabel htmlFor="role">Role</FieldLabel>
                        <Select value={data.role} onValueChange={handlers.handleRoleChange}>
                            <SelectTrigger id="role" className="w-full cursor-pointer">
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>

                            <SelectContent className="z-1000">
                                {userRoleOptions.map((opt: User['role']) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Activity mode={errors.role ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.role}</FieldDescription>
                        </Activity>
                    </Field>

                    <Activity mode={hasSuperAdmin ? 'visible' : 'hidden'}>
                        <Field data-invalid={!!errors.outlet_id}>
                            <FieldLabel htmlFor="outlet">Outlet</FieldLabel>
                            <Combobox items={outlets?.data} defaultValue={user.data.outlet?.name} name="outlet_id">
                                <ComboboxInput
                                    placeholder="Cari Outlet..."
                                    id="outlet"
                                    onChange={(e) => {
                                        handleFetchComboboxOutlet(e.target.value);
                                        clearErrors('outlet_id');
                                    }}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>
                                    <ComboboxList>
                                        {outlets?.data?.map((item: Outlet) => (
                                            <ComboboxItem
                                                key={item.id}
                                                value={item.name}
                                                onClick={() => {
                                                    setData('outlet_id', item.id);
                                                    clearErrors('outlet_id');
                                                }}
                                            >
                                                {item.name}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>

                            <Activity mode={errors.outlet_id ? 'visible' : 'hidden'}>
                                <FieldDescription className="text-destructive">{errors.outlet_id}</FieldDescription>
                            </Activity>
                        </Field>
                    </Activity>

                    <Field data-invalid={!!errors.status}>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select value={data.status} onValueChange={handlers.handleStatusChange}>
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
                        <Button type="button" variant="outline" disabled={processing} onClick={handlers.handleCancel}>
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
