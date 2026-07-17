import { usePage } from '@inertiajs/react';
import { Activity } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice, parseRawPrice } from '@/helper/formatted-price';
import { RoleHelper } from '@/helper/role-helper';
import { useAccidentEdit } from '@/hooks/feature/accident/use-accident-edit';
import type {
    Accident,
    AccidentStatusEnglish,
    AccidentTransitionRules,
    AccidentTypeOption,
} from '@/types/feature/accident/accident';
import { AccidentCompensationTypeEnglish } from '@/types/feature/accident/accident';
import { UserRole } from '@/types/feature/user/user';
import type { AccidentEditSectionProps } from './accident-edit-section';

interface OptionItem {
    label: string;
    value: string;
}

interface AccidentEditFormProps {
    accident: Accident;
    accidentTypeOptions: AccidentTypeOption[];
    accidentStatusOptions: OptionItem[];
    compensationTypeOptions: OptionItem[];
    accidentTransitionRules: AccidentTransitionRules;
}

export function AccidentEditForm({
    accident,
    accidentTypeOptions,
    accidentStatusOptions,
    compensationTypeOptions,
    accidentTransitionRules,
}: AccidentEditFormProps) {
    const { auth } = usePage<AccidentEditSectionProps>().props;
    const { form, handlers } = useAccidentEdit(accident);
    const { data, errors, processing, setData } = form;
    const { handleSubmit, handleCancel, handleSetItemField, handleSetItemFields } = handlers;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);
    const isAdmin = RoleHelper.hasRole(auth.user, UserRole.ADMIN);
    const isAuthorizedToManageStatus = isSuperAdmin || isAdmin;

    const userRole = auth.user.role;
    const allowedNextStatuses = accidentTransitionRules[userRole]?.[accident.status.value] || [];

    const isStatusDisabled = (value: string) => {
        if (value === accident.status.value) {
            return false;
        }

        return !allowedNextStatuses.includes(value as AccidentStatusEnglish);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FieldSet>
                <FieldGroup>
                    {/* Read-Only Info Laporan */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel>Kode Pesanan</FieldLabel>
                            <Input value={accident.order_code || ''} disabled className="bg-muted" />
                        </Field>
                        <Field>
                            <FieldLabel>Nama Pelanggan</FieldLabel>
                            <Input value={accident.customer_name || ''} disabled className="bg-muted" />
                        </Field>
                    </div>

                    {/* Deskripsi Umum Laporan */}
                    <Field data-invalid={!!errors.description}>
                        <FieldLabel htmlFor="description">Catatan Laporan Tambahan (Opsional)</FieldLabel>
                        <Textarea
                            id="description"
                            placeholder="Catatan tambahan mengenai insiden secara keseluruhan..."
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <Activity mode={errors.description ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.description}</FieldDescription>
                        </Activity>
                    </Field>

                    {/* Status Laporan untuk Admin / Super Admin */}
                    <Activity mode={isAuthorizedToManageStatus ? 'visible' : 'hidden'}>
                        <Field data-invalid={!!errors.status}>
                            <FieldLabel htmlFor="status">Status Laporan</FieldLabel>
                            <Select value={data.status as string} onValueChange={(val) => setData('status', val as string)}>
                                <SelectTrigger id="status" className="w-full cursor-pointer">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent className="z-50">
                                    {accidentStatusOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} disabled={isStatusDisabled(opt.value)}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Activity mode={errors.status ? 'visible' : 'hidden'}>
                                <FieldDescription className="text-destructive">{errors.status}</FieldDescription>
                            </Activity>
                        </Field>
                    </Activity>
                </FieldGroup>
            </FieldSet>

            {/* List Detail Kerusakan Item */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold">Daftar Item Kerusakan</h3>
                {data.items.map((item, index) => {
                    const originalItem = (accident.items || []).find((oi) => oi.id === item.id);

                    const itemErrors = errors as Record<string, string>;
                    const typeError = itemErrors[`items.${index}.type`];
                    const itemDetailsError = itemErrors[`items.${index}.item_details`];
                    const descriptionError = itemErrors[`items.${index}.description`];
                    const compensationTypeError = itemErrors[`items.${index}.compensation_type`];
                    const compensationAmountError = itemErrors[`items.${index}.compensation_amount`];

                    return (
                        <div key={item.id} className="relative flex flex-col gap-6 rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-sm font-medium text-muted-foreground">Item #{index + 1}</span>
                            </div>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel>Item Layanan</FieldLabel>
                                    <Input value={originalItem?.order_item_name || ''} disabled className="bg-muted" />
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field data-invalid={!!typeError}>
                                        <FieldLabel htmlFor={`type_${index}`}>Jenis Insiden</FieldLabel>
                                        <Select
                                            value={item.type}
                                            onValueChange={(val) => handleSetItemField(index, 'type', val as any)}
                                        >
                                            <SelectTrigger id={`type_${index}`} className="w-full cursor-pointer">
                                                <SelectValue placeholder="Pilih jenis insiden" />
                                            </SelectTrigger>
                                            <SelectContent className="z-50">
                                                {accidentTypeOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Activity mode={typeError ? 'visible' : 'hidden'}>
                                            <FieldDescription className="text-destructive">{typeError}</FieldDescription>
                                        </Activity>
                                    </Field>

                                    <Field data-invalid={!!itemDetailsError}>
                                        <FieldLabel htmlFor={`item_details_${index}`}>Detail Item (Opsional)</FieldLabel>
                                        <Input
                                            id={`item_details_${index}`}
                                            placeholder="Contoh: Warna merah, ukuran L, dll."
                                            value={item.item_details || ''}
                                            onChange={(e) => handleSetItemField(index, 'item_details', e.target.value)}
                                        />
                                        <Activity mode={itemDetailsError ? 'visible' : 'hidden'}>
                                            <FieldDescription className="text-destructive">
                                                {itemDetailsError}
                                            </FieldDescription>
                                        </Activity>
                                    </Field>
                                </div>

                                <Field data-invalid={!!descriptionError}>
                                    <FieldLabel htmlFor={`description_${index}`}>Kronologi Kerusakan</FieldLabel>
                                    <Textarea
                                        id={`description_${index}`}
                                        placeholder="Kronologi rinci mengenai item ini..."
                                        value={item.description}
                                        onChange={(e) => handleSetItemField(index, 'description', e.target.value)}
                                    />
                                    <Activity mode={descriptionError ? 'visible' : 'hidden'}>
                                        <FieldDescription className="text-destructive">{descriptionError}</FieldDescription>
                                    </Activity>
                                </Field>

                                {/* Kompensasi per-item untuk Admin / Super Admin */}
                                <Activity mode={isAuthorizedToManageStatus ? 'visible' : 'hidden'}>
                                    <div className="mt-2 grid gap-4 border-t pt-4 sm:grid-cols-2">
                                        <Field data-invalid={!!compensationTypeError}>
                                            <FieldLabel htmlFor={`compensation_type_${index}`}>Jenis Kompensasi</FieldLabel>
                                            <Select
                                                defaultValue={item.compensation_type as AccidentCompensationTypeEnglish}
                                                onValueChange={(val) => {
                                                    const isNoneSelected = [AccidentCompensationTypeEnglish.NONE].includes(
                                                        val as AccidentCompensationTypeEnglish,
                                                    );

                                                    handleSetItemFields(index, {
                                                        compensation_type: val as AccidentCompensationTypeEnglish,
                                                        compensation_amount: isNoneSelected ? 0 : item.compensation_amount,
                                                    });
                                                }}
                                            >
                                                <SelectTrigger
                                                    id={`compensation_type_${index}`}
                                                    className="w-full cursor-pointer"
                                                >
                                                    <SelectValue placeholder="Pilih jenis kompensasi" />
                                                </SelectTrigger>
                                                <SelectContent className="z-50">
                                                    {compensationTypeOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Activity mode={compensationTypeError ? 'visible' : 'hidden'}>
                                                <FieldDescription className="text-destructive">
                                                    {compensationTypeError}
                                                </FieldDescription>
                                            </Activity>
                                        </Field>

                                        <Field data-invalid={!!compensationAmountError}>
                                            <FieldLabel htmlFor={`compensation_amount_${index}`}>
                                                Estimasi Kerugian/Kompensasi
                                            </FieldLabel>
                                            <Input
                                                id={`compensation_amount_${index}`}
                                                type="text"
                                                placeholder={
                                                    item.compensation_type === 'none'
                                                        ? 'Tidak ada kerugian'
                                                        : 'Masukkan estimasi kerugian...'
                                                }
                                                value={formatPrice(item.compensation_amount || 0)}
                                                disabled={item.compensation_type === 'none' || !item.compensation_type}
                                                onChange={(e) =>
                                                    handleSetItemField(
                                                        index,
                                                        'compensation_amount',
                                                        parseRawPrice(e.target.value),
                                                    )
                                                }
                                            />
                                            <Activity mode={compensationAmountError ? 'visible' : 'hidden'}>
                                                <FieldDescription className="text-destructive">
                                                    {compensationAmountError}
                                                </FieldDescription>
                                            </Activity>
                                        </Field>
                                    </div>
                                </Activity>
                            </FieldGroup>
                        </div>
                    );
                })}
            </div>

            {/* Aksi Form */}
            <FieldSet>
                <FieldGroup>
                    <Field orientation="responsive" className="ml-auto">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
