import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiSelectListBox } from '@/components/ui/multi-select-list-box';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOutletEdit } from '@/hooks/feature/outlet/use-outlet-edit';
import { OutletStatus } from '@/types/feature/outlet/outlet';
import { InfoIcon } from 'lucide-react';
import { Activity } from 'react';

export function OutletEditForm() {
    const {
        data,
        setData,
        errors,
        clearErrors,
        adminSelected,
        handleAdminChange,
        cashiersSelected,
        handleCashiersChange,
        handleFetchUser,
        operatorsSelected,
        handleOperatorsChange,
        outletStatusOptions,
        handleStatusChange,
        options,
        handleSubmit,
    } = useOutletEdit();

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.name}
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Contoh: Outlet Cabang Utama"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                        />
                        <Activity mode={errors.name ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.name}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.address}>
                        <FieldLabel htmlFor="address">
                            Alamat <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.address}
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Contoh: Jalan Sudirman No. 123"
                            value={data.address}
                            onChange={(e) => {
                                setData('address', e.target.value);
                                clearErrors('address');
                            }}
                        />
                        <Activity mode={errors.address ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.address}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            aria-invalid={!!errors.email}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Contoh: outlet.pusat@gmail.com"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                clearErrors('email');
                            }}
                        />
                        <Activity mode={errors.email ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.phone}>
                        <FieldLabel htmlFor="phone">Telepon</FieldLabel>
                        <Input
                            aria-invalid={!!errors.phone}
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Contoh: 08123456789"
                            value={data.phone}
                            onChange={(e) => {
                                setData('phone', e.target.value);
                                clearErrors('phone');
                            }}
                        />
                        <Activity mode={errors.phone ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.phone}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.status}>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select value={data.status} onValueChange={handleStatusChange}>
                            <SelectTrigger id="status" className="w-full cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent className="z-1000">
                                {outletStatusOptions.map((opt: OutletStatus) => (
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

                    <Field data-invalid={!!errors.admin}>
                        <FieldLabel htmlFor="admin">
                            Admin <span className="text-destructive">*</span>
                        </FieldLabel>

                        <MultiSelectListBox
                            options={options}
                            selected={adminSelected}
                            onChange={handleAdminChange}
                            inputProps={{
                                id: 'admin',
                                name: 'admin',
                                placeholder: 'Cari pengguna untuk posisi admin...',
                            }}
                            onInputChange={handleFetchUser}
                        />

                        <Activity mode={errors.admin ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.admin}</FieldDescription>
                        </Activity>

                        <Activity mode={errors.admin ? 'hidden' : 'visible'}>
                            <FieldDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <InfoIcon className="size-3" />
                                <span>
                                    Hanya bisa memilih <strong>pengguna tanpa role</strong> dan{' '}
                                    <strong>belum ditempatkan di outlet</strong>
                                </span>
                            </FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.cashiers}>
                        <FieldLabel htmlFor="cashiers">Kasir</FieldLabel>

                        <MultiSelectListBox
                            options={options}
                            selected={cashiersSelected}
                            onChange={handleCashiersChange}
                            inputProps={{
                                id: 'cashiers',
                                name: 'cashiers',
                                placeholder: 'Cari pengguna untuk posisi kasir...',
                            }}
                            onInputChange={handleFetchUser}
                        />

                        <Activity mode={errors.cashiers ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.cashiers}</FieldDescription>
                        </Activity>

                        <Activity mode={errors.cashiers ? 'hidden' : 'visible'}>
                            <FieldDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <InfoIcon className="size-3" />
                                <span>
                                    Hanya bisa memilih <strong>pengguna tanpa role</strong> dan{' '}
                                    <strong>belum ditempatkan di outlet</strong>
                                </span>
                            </FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.operators}>
                        <FieldLabel htmlFor="operators">Operator</FieldLabel>
                        <MultiSelectListBox
                            options={options}
                            selected={operatorsSelected}
                            onChange={handleOperatorsChange}
                            inputProps={{
                                id: 'operators',
                                name: 'operators',
                                placeholder: 'Cari pengguna untuk posisi operator...',
                            }}
                            onInputChange={handleFetchUser}
                        />
                        <Activity mode={errors.operators ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.operators}</FieldDescription>
                        </Activity>

                        <Activity mode={errors.operators ? 'hidden' : 'visible'}>
                            <FieldDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <InfoIcon className="size-3" />
                                <span>
                                    Hanya bisa memilih <strong>pengguna tanpa role</strong> dan{' '}
                                    <strong>belum ditempatkan di outlet</strong>
                                </span>
                            </FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                        <Button type="submit">Simpan</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
