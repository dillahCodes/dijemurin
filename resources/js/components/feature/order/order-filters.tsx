import { usePage } from '@inertiajs/react';
import { Filter, RotateCcw, Search, Store, X } from 'lucide-react';
import { Activity, createContext, useContext, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from '@/components/ui/combobox';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useModal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleHelper } from '@/helper/role-helper';
import { useOrderFilters } from '@/hooks/feature/order/use-order-filters';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import type { OrderFilterPageProps, OrderOption, OrderPageProps } from './order-data-section';

type OrderFilterContextType = ReturnType<typeof useOrderFilters>;
type OrderDateFilterName = 'startDate' | 'endDate';

type OrderModalFilterState = Pick<
    OrderFilterPageProps,
    'status' | 'paymentMethod' | 'startDate' | 'endDate' | 'timeStatus' | 'dateType'
>;

const ORDER_FILTER_MODAL_ID = 'order-filter';

const EMPTY_MODAL_FILTERS: OrderModalFilterState = {
    status: undefined,
    paymentMethod: undefined,
    startDate: undefined,
    endDate: undefined,
    timeStatus: undefined,
    dateType: undefined,
};

const OrderFilterContext = createContext<OrderFilterContextType | null>(null);

function useOrderFilterContext() {
    const context = useContext(OrderFilterContext);

    if (!context) {
        throw new Error('useOrderFilterContext must be used within OrderFilterContext.Provider');
    }

    return context;
}

function getInitialModalFilters(filterState: OrderFilterContextType['data']['filterState']): OrderModalFilterState {
    return {
        status: filterState.status,
        paymentMethod: filterState.paymentMethod,
        startDate: filterState.startDate,
        endDate: filterState.endDate,
        timeStatus: filterState.timeStatus,
        dateType: filterState.dateType,
    };
}

function getActiveModalFilterCount(filterState: OrderFilterContextType['data']['filterState']) {
    const { status, paymentMethod, startDate, endDate, timeStatus, dateType } = filterState;

    const hasStatus = Array.isArray(status) ? status.length > 0 : !!status;

    return [hasStatus, paymentMethod, startDate, endDate, timeStatus, dateType].filter(Boolean).length;
}

function hasActiveModalFilters(filterState: OrderModalFilterState) {
    const { status, paymentMethod, startDate, endDate, timeStatus, dateType } = filterState;
    const hasStatus = Array.isArray(status) ? status.length > 0 : !!status;

    return !!hasStatus || !!paymentMethod || !!startDate || !!endDate || !!timeStatus || !!dateType;
}

interface OrderFilterSelectFieldProps {
    label: string;
    value?: string;
    placeholder: string;
    allLabel: string;
    options: OrderOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
}

function OrderFilterSelectField({
    label,
    value,
    placeholder,
    allLabel,
    options,
    onChange,
    disabled,
}: OrderFilterSelectFieldProps) {
    return (
        <Field className="gap-2">
            <FieldLabel className="text-sm font-medium">{label}</FieldLabel>

            <Select value={value ?? 'all'} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className="h-10 w-full cursor-pointer">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className="z-1000">
                    <SelectItem value="all">{allLabel}</SelectItem>

                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

interface OrderDateFieldProps {
    id: OrderDateFilterName;
    label: string;
    value?: string;
    onChange: (name: OrderDateFilterName, value: string) => void;
    onClear: (name: OrderDateFilterName) => void;
}

function OrderDateField({ id, label, value, onChange, onClear }: OrderDateFieldProps) {
    return (
        <Field className="gap-2">
            <FieldLabel htmlFor={id} className="text-sm font-medium">
                {label}
            </FieldLabel>

            <div className="flex items-center gap-2">
                <Input
                    id={id}
                    name={id}
                    type="date"
                    value={value ?? ''}
                    className="h-10"
                    onChange={(e) => onChange(id, e.target.value)}
                />

                <Activity mode={value ? 'visible' : 'hidden'}>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 cursor-pointer"
                        aria-label={`Hapus ${label}`}
                        onClick={() => onClear(id)}
                    >
                        <X size={16} />
                    </Button>
                </Activity>
            </div>
        </Field>
    );
}

interface OrderStatusComboboxFieldProps {
    options: OrderOption[];
    value: string[];
    onChange: (values: string[]) => void;
}

function OrderStatusComboboxField({ options, value, onChange }: OrderStatusComboboxFieldProps) {
    const anchor = useComboboxAnchor();
    const [open, setOpen] = useState(false);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const filterStatusItem = useMemo(() => {
        return (itemValue: string, query: string) => {
            const option = options.find((opt) => opt.value === itemValue);
            const label = option ? option.label : itemValue;

            return label.toLowerCase().includes(query.toLowerCase());
        };
    }, [options]);

    return (
        <Field className="gap-2" ref={setContainer}>
            <FieldLabel className="text-sm font-medium">Status Pesanan</FieldLabel>

            <Combobox
                multiple
                autoHighlight
                items={options.map((opt) => opt.value)}
                value={value}
                onValueChange={onChange}
                open={open}
                onOpenChange={setOpen}
                filter={filterStatusItem}
            >
                <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                        {(values) => (
                            <>
                                {values.map((val: string) => {
                                    const option = options.find((opt) => opt.value === val);

                                    return <ComboboxChip key={val}>{option ? option.label : val}</ComboboxChip>;
                                })}
                                <ComboboxChipsInput placeholder="Pilih status..." onFocus={() => setOpen(true)} />
                            </>
                        )}
                    </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor} container={container ?? undefined}>
                    <ComboboxEmpty>Status tidak ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                        {(item) => {
                            const option = options.find((opt) => opt.value === item);

                            return (
                                <ComboboxItem key={item} value={item}>
                                    {option ? option.label : item}
                                </ComboboxItem>
                            );
                        }}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </Field>
    );
}

interface OrderFilterModalContentProps {
    orderFilter: OrderFilterContextType;
    orderStatusOptions: OrderOption[];
    orderTimeStatusOptions: OrderOption[];
    orderDateTypeOptions: OrderOption[];
    paymentMethodOptions: OrderOption[];
}

function OrderFilterModalContent({
    orderFilter,
    orderStatusOptions,
    orderTimeStatusOptions,
    orderDateTypeOptions,
    paymentMethodOptions,
}: OrderFilterModalContentProps) {
    const modal = useModal();
    const { data, utils, handlers } = orderFilter;

    const [modalFilters, setModalFilters] = useState<OrderModalFilterState>(() => getInitialModalFilters(data.filterState));

    const hasModalFilters = hasActiveModalFilters(modalFilters);

    const selectedStatusArray = useMemo(() => {
        if (!modalFilters.status) {
            return [];
        }

        if (Array.isArray(modalFilters.status)) {
            return modalFilters.status;
        }

        return [modalFilters.status];
    }, [modalFilters.status]);

    const handleSelectStatus = (values: string[]) => {
        setModalFilters((prev) => ({
            ...prev,
            status: values.length > 0 ? values : undefined,
        }));
    };

    const handleSelectPayment = (value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            paymentMethod: utils.normalizeSelectValue(value),
        }));
    };

    const handleSelectTimeStatus = (value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            timeStatus: utils.normalizeSelectValue(value),
        }));
    };

    const handleSelectDateType = (value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            dateType: utils.normalizeSelectValue(value),
        }));
    };

    const handleSetDate = (name: OrderDateFilterName, value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            [name]: utils.normalizeInputValue(value),
        }));
    };

    const handleClearDate = (name: OrderDateFilterName) => {
        setModalFilters((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleResetModalFilters = () => {
        setModalFilters(EMPTY_MODAL_FILTERS);
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        handlers.modalHandle.handleSubmitModalFilters(e, modalFilters);
    };

    return (
        <form className="mt-6 w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup className="gap-5">
                    <div className="flex flex-col gap-6">
                        <OrderStatusComboboxField
                            options={orderStatusOptions}
                            value={selectedStatusArray}
                            onChange={handleSelectStatus}
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <OrderFilterSelectField
                                label="Metode Pembayaran"
                                value={modalFilters.paymentMethod}
                                placeholder="Semua metode"
                                allLabel="Semua Metode Pembayaran"
                                options={paymentMethodOptions}
                                onChange={handleSelectPayment}
                            />

                            <OrderFilterSelectField
                                label="Batas Waktu"
                                value={modalFilters.timeStatus}
                                placeholder="Semua batas waktu"
                                allLabel="Semua Batas Waktu"
                                options={orderTimeStatusOptions}
                                onChange={handleSelectTimeStatus}
                            />
                        </div>

                        <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-muted/10 p-4 dark:bg-muted/5">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-foreground">Rentang Tanggal</span>
                                <span className="text-[11px] text-muted-foreground">
                                    Tentukan rentang tanggal filter dan jenis pencocokan tanggalnya.
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <OrderDateField
                                    id="startDate"
                                    label="Tanggal Mulai"
                                    value={modalFilters.startDate}
                                    onChange={handleSetDate}
                                    onClear={handleClearDate}
                                />

                                <OrderDateField
                                    id="endDate"
                                    label="Tanggal Selesai"
                                    value={modalFilters.endDate}
                                    onChange={handleSetDate}
                                    onClear={handleClearDate}
                                />
                            </div>

                            <OrderFilterSelectField
                                label="Jenis Tanggal"
                                value={modalFilters.dateType}
                                placeholder="Pesanan Dibuat"
                                allLabel="Semua Jenis Tanggal"
                                options={orderDateTypeOptions}
                                onChange={handleSelectDateType}
                                disabled={!modalFilters.startDate || !modalFilters.endDate}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            className="cursor-pointer justify-center sm:justify-start"
                            disabled={!hasModalFilters}
                            onClick={handleResetModalFilters}
                        >
                            <RotateCcw size={16} />
                            Reset
                        </Button>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => modal.close(ORDER_FILTER_MODAL_ID)}
                            >
                                Batal
                            </Button>

                            <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={() => modal.close(ORDER_FILTER_MODAL_ID)}
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

function OrderFilterButton() {
    const modal = useModal();
    const orderFilter = useOrderFilterContext();
    const { orderStatusOptions, orderTimeStatusOptions, orderDateTypeOptions, paymentMethodOptions } =
        usePage<OrderPageProps>().props;

    const activeFilterCount = getActiveModalFilterCount(orderFilter.data.filterState);

    const handleOpenModal = () => {
        modal.open({
            id: ORDER_FILTER_MODAL_ID,
            title: 'Filter Pesanan',
            description: 'Saring pesanan berdasarkan status, metode pembayaran, dan rentang tanggal.',
            content: (
                <OrderFilterModalContent
                    orderFilter={orderFilter}
                    orderStatusOptions={orderStatusOptions}
                    orderTimeStatusOptions={orderTimeStatusOptions}
                    orderDateTypeOptions={orderDateTypeOptions}
                    paymentMethodOptions={paymentMethodOptions}
                />
            ),
            withCancelButton: false,
            withConfirmButton: false,
        });
    };

    return (
        <Button className="relative cursor-pointer" variant="outline" type="button" onClick={handleOpenModal}>
            <Filter size={16} />

            <Activity mode={activeFilterCount > 0 ? 'visible' : 'hidden'}>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                </span>
            </Activity>
        </Button>
    );
}

function OrderSearchInput() {
    const { data, handlers } = useOrderFilterContext();

    return (
        <InputGroup className="flex-1">
            <InputGroupAddon align="inline-start">
                <InputGroupText>
                    <Search size={16} />
                </InputGroupText>
            </InputGroupAddon>

            <InputGroupInput
                type="text"
                name="search"
                placeholder="Cari pelanggan atau ID order..."
                value={data.filterState.search ?? ''}
                onChange={handlers.searchHandle.handleSearchChange}
            />
        </InputGroup>
    );
}

function OrderOutletFilter() {
    const { handlers } = useOrderFilterContext();
    const { outlets, outletSelected, auth } = usePage<OrderPageProps>().props;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <div className="w-full flex-1 sm:w-[250px] sm:flex-initial lg:w-[280px]">
            <Combobox
                key={outletSelected?.data?.id}
                name="outlet_id"
                items={outlets?.data}
                defaultValue={outletSelected?.data?.name}
            >
                <ComboboxInput
                    placeholder="Cari Outlet..."
                    onChange={(e) => handlers.outletHandle.handleFetchComboboxOutlet(e.target.value)}
                >
                    <InputGroupAddon align="inline-start">
                        <InputGroupText>
                            <Store size={16} />
                        </InputGroupText>
                    </InputGroupAddon>
                </ComboboxInput>

                <ComboboxContent>
                    <ComboboxEmpty>Tidak ada outlet.</ComboboxEmpty>

                    <ComboboxList>
                        {outlets?.data?.map((outlet: Outlet) => (
                            <ComboboxItem
                                key={outlet.id}
                                value={outlet.name}
                                onClick={() => handlers.outletHandle.handleSelectOutlet(outlet)}
                            >
                                {outlet.name}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

function OrderSearchActions() {
    const { data, handlers } = useOrderFilterContext();

    const hasSearchFilter = !!data.filterState.search || !!data.filterState.outletIdSelected;

    return (
        <div className="flex items-center gap-3">
            <Activity mode={hasSearchFilter ? 'visible' : 'hidden'}>
                <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    className="shrink-0 cursor-pointer"
                    onClick={handlers.clearHandle.handleClearSearch}
                >
                    <X size={16} />
                </Button>
            </Activity>

            <Button type="submit" disabled={data.conditions.shouldDisableSearch} className="shrink-0 cursor-pointer">
                <Search size={16} />
                Cari
            </Button>
        </div>
    );
}

function OrderFilterForm() {
    const { data, handlers } = useOrderFilterContext();
    const { auth } = usePage<OrderPageProps>().props;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <form key={data.resetKey} onSubmit={handlers.searchHandle.handleSubmitSearch} className="w-full lg:max-w-2xl">
            <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <OrderFilterButton />
                        <OrderSearchInput />
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <OrderOutletFilter />
                        <OrderSearchActions />
                    </div>
                </div>
            </Activity>

            <Activity mode={isSuperAdmin ? 'hidden' : 'visible'}>
                <div className="flex w-full items-center gap-3">
                    <OrderFilterButton />
                    <OrderSearchInput />
                    <OrderSearchActions />
                </div>
            </Activity>
        </form>
    );
}

export function OrderFilters() {
    const orderFilter = useOrderFilters();

    return (
        <OrderFilterContext.Provider value={orderFilter}>
            <OrderFilterForm />
        </OrderFilterContext.Provider>
    );
}
