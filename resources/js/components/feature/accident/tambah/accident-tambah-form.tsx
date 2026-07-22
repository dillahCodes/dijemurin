import { usePage } from '@inertiajs/react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { RoleHelper } from '@/helper/role-helper';
import { useAccidentTambah } from '@/hooks/feature/accident/use-accident-tambah';
import type { AccidentTypeEnglish, OrderItemComboboxItem } from '@/types/feature/accident/accident';
import { OrderStatusEnglish } from '@/types/feature/order/order';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import type { AccidentTambahSectionProps } from './accident-tambah-section';

export function AccidentTambahForm() {
    const { outlets, outletSelected, orders, orderItems, accidentTypeOptions, auth } =
        usePage<AccidentTambahSectionProps>().props;

    const hasSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);
    const initialOutletId = outletSelected?.data?.id ?? null;
    const { form, handlers } = useAccidentTambah(initialOutletId);

    const outletsData = outlets?.data || [];
    const ordersData = orders?.data || [];
    const orderItemsData: OrderItemComboboxItem[] = orderItems?.data || [];

    // Kumpulkan order_item_id yang sudah dipilih di baris lain
    const selectedItemIds = form.data.items.map((item) => item.order_item_id).filter(Boolean);

    // Kumpulkan error messages terkait array items untuk ditampilkan di warning box
    const objectItemsErrors = Object.entries(form.errors)
        .filter(([key]) => key.startsWith('items'))
        .map(([, msg]) => msg);

    const itemErrorMessages = Array.from(new Set(objectItemsErrors));

    return (
        <form className="flex flex-col gap-6" onSubmit={handlers.handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    {/* Outlet Selection */}
                    <Activity mode={hasSuperAdmin ? 'visible' : 'hidden'}>
                        <Field data-invalid={!!form.errors.outlet_id}>
                            <FieldLabel htmlFor="outlet_id">
                                Outlet <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Combobox name="outlet_id" items={outletsData} onInputValueChange={handlers.handleFetchOutlet}>
                                <ComboboxInput placeholder="Pilih Outlet" showClear />
                                <ComboboxContent>
                                    <Activity mode={outletsData.length ? 'visible' : 'hidden'}>
                                        <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>
                                    </Activity>
                                    <ComboboxList>
                                        {outletsData.map((item: Outlet) => (
                                            <ComboboxItem
                                                key={item.id}
                                                value={item.name}
                                                onClick={() => handlers.handleSetOutletChange(item.id)}
                                            >
                                                {item.name}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <Activity mode={hasSuperAdmin ? 'hidden' : 'visible'}>
                                <Input id="outlet_id" type="text" value={outletSelected?.data?.name ?? ''} disabled />
                            </Activity>
                            <Activity mode={form.errors.outlet_id ? 'visible' : 'hidden'}>
                                <FieldDescription className="text-destructive">{form.errors.outlet_id}</FieldDescription>
                            </Activity>
                        </Field>
                    </Activity>

                    {/* Order Selection */}
                    <Field data-invalid={!!form.errors.order_id}>
                        <FieldLabel htmlFor="order_id">
                            Pesanan <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Combobox
                            name="order_id"
                            items={ordersData}
                            onInputValueChange={handlers.handleFetchOrder}
                            disabled={!form.data.outlet_id}
                        >
                            <ComboboxInput placeholder="Cari No. Pesanan / Nama..." showClear />
                            <ComboboxContent>
                                <Activity mode={!ordersData.length ? 'visible' : 'hidden'}>
                                    <ComboboxEmpty>Tidak ada pesanan.</ComboboxEmpty>
                                </Activity>
                                <ComboboxList>
                                    {ordersData.map((item) => {
                                        const isStatusInvalid = [
                                            OrderStatusEnglish.PENDING,
                                            OrderStatusEnglish.CANCELLED,
                                        ].includes(item.status.value);

                                        return (
                                            <ComboboxItem
                                                key={item.id}
                                                value={item.label}
                                                disabled={isStatusInvalid}
                                                onClick={() => !isStatusInvalid && handlers.handleSetOrderChange(item.id)}
                                            >
                                                {item.label}
                                            </ComboboxItem>
                                        );
                                    })}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <FieldDescription className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <span>
                                <span className="font-semibold">Informasi:</span> Laporan insiden hanya berlaku untuk pesanan
                                berstatus <strong>Diproses</strong>, <strong>Selesai</strong>, atau <strong>Diambil</strong>.
                            </span>
                        </FieldDescription>
                        <Activity mode={form.errors.order_id ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{form.errors.order_id}</FieldDescription>
                        </Activity>
                    </Field>

                    {/* Catatan Umum Laporan (Opsional) */}
                    <Field>
                        <FieldLabel htmlFor="description">Catatan Umum Laporan (Opsional)</FieldLabel>
                        <Textarea
                            id="description"
                            placeholder="Catatan umum untuk laporan insiden ini (opsional)..."
                            value={form.data.description || ''}
                            onChange={(e) => {
                                form.setData('description', e.target.value);
                            }}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            {/* --- Daftar Item Kerusakan --- */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                        Daftar Item Kerusakan <span className="text-destructive">*</span>
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlers.handleAddItem}
                        disabled={!form.data.order_id}
                    >
                        <Plus className="mr-1 size-4" />
                        Tambah Item
                    </Button>
                </div>

                {/* Warning Alert Box untuk Validasi Error Item Kerusakan */}
                <Activity mode={itemErrorMessages.length > 0 ? 'visible' : 'hidden'}>
                    <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive dark:border-destructive/30 dark:bg-destructive/10">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <div>
                            <span className="font-semibold">Wajib diisi / diperbaiki:</span>
                            <ul className="mt-1 list-inside list-disc space-y-0.5 font-medium">
                                {itemErrorMessages.map((msg, idx) => (
                                    <li key={idx}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Activity>

                {form.data.items.map((item, index) => {
                    const itemErrors = form.errors as Record<string, string>;
                    const orderItemError = itemErrors[`items.${index}.order_item_id`];
                    const typeError = itemErrors[`items.${index}.type`];
                    const descriptionError = itemErrors[`items.${index}.description`];
                    const itemDetailsError = itemErrors[`items.${index}.item_details`];

                    // Filter out items sudah dipilih di baris lain
                    const availableItems = orderItemsData.filter(
                        (oi) => oi.id === item.order_item_id || !selectedItemIds.includes(oi.id),
                    );

                    return (
                        <div key={index} className="relative rounded-lg border bg-card p-4 shadow-sm">
                            {/* Nomor baris & Tombol Hapus */}
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Item #{index + 1}</span>
                                <Activity mode={form.data.items.length > 1 ? 'visible' : 'hidden'}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-destructive hover:text-destructive"
                                        onClick={() => handlers.handleRemoveItem(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </Activity>
                            </div>

                            <FieldGroup>
                                {/* Pilih Item Pesanan */}
                                <Field data-invalid={!!orderItemError}>
                                    <FieldLabel htmlFor={`order_item_id_${index}`}>
                                        Item Pesanan <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Select
                                        disabled={!form.data.order_id}
                                        value={item.order_item_id ? String(item.order_item_id) : undefined}
                                        onValueChange={(val) =>
                                            handlers.handleSetItemField(index, 'order_item_id', Number(val))
                                        }
                                    >
                                        <SelectTrigger id={`order_item_id_${index}`} className="w-full cursor-pointer">
                                            <SelectValue placeholder="Pilih Item Pesanan" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50">
                                            {availableItems.map((oi) => (
                                                <SelectItem key={oi.id} value={String(oi.id)}>
                                                    {oi.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Activity mode={orderItemError ? 'visible' : 'hidden'}>
                                        <FieldDescription className="text-destructive">{orderItemError}</FieldDescription>
                                    </Activity>
                                </Field>

                                {/* Jenis Insiden */}
                                <Field data-invalid={!!typeError}>
                                    <FieldLabel htmlFor={`type_${index}`}>
                                        Jenis Insiden <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Select
                                        value={item.type}
                                        onValueChange={(val) =>
                                            handlers.handleSetItemField(index, 'type', val as AccidentTypeEnglish)
                                        }
                                    >
                                        <SelectTrigger id={`type_${index}`} className="w-full cursor-pointer">
                                            <SelectValue placeholder="Pilih Jenis Insiden" />
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

                                {/* Detail Item (Opsional) */}
                                <Field data-invalid={!!itemDetailsError}>
                                    <FieldLabel htmlFor={`item_details_${index}`}>Detail Item (Opsional)</FieldLabel>
                                    <Input
                                        id={`item_details_${index}`}
                                        type="text"
                                        placeholder="Contoh: Baju warna biru robek bagian lengan"
                                        value={item.item_details || ''}
                                        onChange={(e) => handlers.handleSetItemField(index, 'item_details', e.target.value)}
                                    />
                                    <Activity mode={itemDetailsError ? 'visible' : 'hidden'}>
                                        <FieldDescription className="text-destructive">{itemDetailsError}</FieldDescription>
                                    </Activity>
                                </Field>

                                {/* Kronologi Kerusakan */}
                                <Field data-invalid={!!descriptionError}>
                                    <FieldLabel htmlFor={`description_${index}`}>
                                        Kronologi Kerusakan <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Textarea
                                        id={`description_${index}`}
                                        placeholder="Jelaskan secara detail mengenai kerusakan barang ini..."
                                        value={item.description}
                                        onChange={(e) => handlers.handleSetItemField(index, 'description', e.target.value)}
                                    />
                                    <Activity mode={descriptionError ? 'visible' : 'hidden'}>
                                        <FieldDescription className="text-destructive">{descriptionError}</FieldDescription>
                                    </Activity>
                                </Field>
                            </FieldGroup>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <FieldSet>
                <FieldGroup>
                    <Field orientation="responsive" className="ml-auto">
                        <Button type="button" onClick={handlers.handleCancel} variant="outline" disabled={form.processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Activity mode={form.processing ? 'visible' : 'hidden'}>Menyimpan...</Activity>
                            <Activity mode={form.processing ? 'hidden' : 'visible'}>Laporkan Insiden</Activity>
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
