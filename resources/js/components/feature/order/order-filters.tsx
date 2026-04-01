import { usePage } from '@inertiajs/react';
import { Calendar, Search, X } from 'lucide-react';
import { Activity, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useModal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrderFilters } from '@/hooks/feature/order/use-order-filters';
import type { OrderOption, OrderPageProps } from './order-data-section';

function OrderSearchForm() {
    const { filters } = usePage<OrderPageProps>().props;
    const { filterState, conditions, clearHandle, searchHandle } = useOrderFilters(filters);

    return (
        <form className="flex w-full items-center justify-between gap-3 lg:max-w-2xl" onSubmit={searchHandle.handleSubmit}>
            <Input
                type="text"
                placeholder="Cari pelanggan atau ID order..."
                name="search"
                className="flex-1"
                value={filterState.search}
                onChange={searchHandle.handleChange}
            />

            <div className="flex items-center gap-2">
                <Activity mode={filterState.search ? 'visible' : 'hidden'}>
                    <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="cursor-pointer"
                        onClick={clearHandle.handleClearSearch}
                    >
                        <X size={16} />
                    </Button>
                </Activity>

                <Button type="submit" disabled={conditions.shouldDisableSearch} className="cursor-pointer">
                    <Search size={16} />
                    Cari
                </Button>
            </div>
        </form>
    );
}

interface OrderDateFilterModalContentProps {
    initialState: { start_date: string; end_date: string };
    onFilterDate: (start_date: string, end_date: string) => void;
}

function OrderDateFilterModalContent({ initialState, onFilterDate }: OrderDateFilterModalContentProps) {
    const modal = useModal();
    const [formData, setFormData] = useState(initialState);

    const isEmpty = (v: string) => v.trim() === '';

    const isOneEmpty =
        (isEmpty(formData.start_date) && !isEmpty(formData.end_date)) ||
        (!isEmpty(formData.start_date) && isEmpty(formData.end_date));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearDate = (name: string) => () => {
        setFormData((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onFilterDate(formData.start_date, formData.end_date);
        modal.close('order-date-filter');
    };

    return (
        <form className="mt-8 w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="start_date">
                            Tanggal Mulai <span className="text-destructive">*</span>
                        </FieldLabel>
                        <div className="flex items-center gap-3">
                            <Input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />

                            <Activity mode={formData.start_date ? 'visible' : 'hidden'}>
                                <Button type="button" variant="ghost" onClick={handleClearDate('start_date')}>
                                    <X size={16} />
                                </Button>
                            </Activity>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="end_date">
                            Tanggal Selesai <span className="text-destructive">*</span>
                        </FieldLabel>

                        <div className="flex items-center gap-3">
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />

                            <Activity mode={formData.end_date ? 'visible' : 'hidden'}>
                                <Button type="button" variant="ghost" onClick={handleClearDate('end_date')}>
                                    <X size={16} />
                                </Button>
                            </Activity>
                        </div>
                    </Field>

                    <div className="ml-auto flex gap-4">
                        <Button type="button" variant="outline" onClick={() => modal.close('order-date-filter')}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isOneEmpty}>
                            Simpan
                        </Button>
                    </div>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

function OrderDateFilter() {
    const modal = useModal();
    const { filters } = usePage<OrderPageProps>().props;
    const { filterState, filterHandle } = useOrderFilters(filters);

    const handleModal = () => {
        modal.open({
            id: 'order-date-filter',
            title: 'Filter Berdasarkan Tanggal',
            description: 'Pilih rentang tanggal untuk memfilter pesanan.',
            content: (
                <OrderDateFilterModalContent
                    initialState={{
                        start_date: filterState.start_date,
                        end_date: filterState.end_date,
                    }}
                    onFilterDate={filterHandle.handleFilterDate}
                />
            ),
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    return (
        <Button className="cursor-pointer" variant="outline" onClick={handleModal} type="button">
            <Calendar size={16} />
        </Button>
    );
}

function OrderStatusFilter() {
    const { filters, orderStatusOptions } = usePage<OrderPageProps>().props;
    const { filterState, filterHandle } = useOrderFilters(filters);

    return (
        <Select value={filterState.status} onValueChange={filterHandle.handleFilterStatus}>
            <SelectTrigger className="w-full min-w-28 cursor-pointer">
                <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                {orderStatusOptions.map((opt: OrderOption) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function OrderPaymentFilter() {
    const { filters, paymentMethodOptions } = usePage<OrderPageProps>().props;
    const { filterState, filterHandle } = useOrderFilters(filters);

    return (
        <div className="flex w-full items-center gap-3">
            <Select value={filterState.payment_method} onValueChange={filterHandle.handleFilterPaymentMethod}>
                <SelectTrigger className="w-full min-w-28 cursor-pointer">
                    <SelectValue placeholder="Metode Pembayaran" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">Semua Metode Pembayaran</SelectItem>
                    {paymentMethodOptions.map((opt: OrderOption) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <OrderDateFilter />
        </div>
    );
}

export function OrderFilters() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <OrderSearchForm />
            <div className="flex flex-wrap gap-3 md:flex-nowrap">
                <OrderStatusFilter />
                <OrderPaymentFilter />
            </div>
        </div>
    );
}
