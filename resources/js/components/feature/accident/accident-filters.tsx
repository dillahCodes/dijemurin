import { usePage } from '@inertiajs/react';
import { Filter, RotateCcw, Search, Store, X } from 'lucide-react';
import { Activity, createContext, useContext, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Field, FieldGroup, FieldLabel, FieldSet, FieldContent, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useModal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleHelper } from '@/helper/role-helper';
import { useAccidentFilters } from '@/hooks/feature/accident/use-accident-filters';
import type { AccidentStatusEnglish, AccidentTypeEnglish, AccidentDateTypeEnglish } from '@/types/feature/accident/accident';
import type { Outlet } from '@/types/feature/outlet/outlet';
import { UserRole } from '@/types/feature/user/user';
import type {
    AccidentPageProps,
    AccidentStatusOption,
    AccidentTypeOption,
    AccidentDateTypeOption,
} from './accident-data-section';

type AccidentFilterContextType = ReturnType<typeof useAccidentFilters>;

const ACCIDENT_FILTER_MODAL_ID = 'accident-filter';

type AccidentModalFilterState = Pick<
    ReturnType<typeof useAccidentFilters>['data']['filterState'],
    'status' | 'type' | 'startDate' | 'endDate' | 'dateType' | 'reporterId'
>;

const EMPTY_MODAL_FILTERS: AccidentModalFilterState = {
    status: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    dateType: undefined,
    reporterId: undefined,
};

const AccidentFilterContext = createContext<AccidentFilterContextType | null>(null);

function useAccidentFilterContext() {
    const context = useContext(AccidentFilterContext);

    if (!context) {
        throw new Error('useAccidentFilterContext must be used within AccidentFilterContext.Provider');
    }

    return context;
}

function getInitialModalFilters(filterState: AccidentFilterContextType['data']['filterState']): AccidentModalFilterState {
    return {
        status: filterState.status,
        type: filterState.type,
        startDate: filterState.startDate,
        endDate: filterState.endDate,
        dateType: filterState.dateType,
        reporterId: filterState.reporterId,
    };
}

function getActiveModalFilterCount(filterState: AccidentFilterContextType['data']['filterState']) {
    const { status, type, startDate, endDate, dateType, reporterId } = filterState;

    const hasStatus = Array.isArray(status) ? status.length > 0 : !!status;
    const hasType = Array.isArray(type) ? type.length > 0 : !!type;

    return [hasStatus, hasType, startDate, endDate, dateType, !!reporterId].filter(Boolean).length;
}

function hasActiveModalFilters(filterState: AccidentModalFilterState) {
    const { status, type, startDate, endDate, dateType, reporterId } = filterState;
    const hasStatus = Array.isArray(status) ? status.length > 0 : !!status;
    const hasType = Array.isArray(type) ? type.length > 0 : !!type;

    return !!hasStatus || !!hasType || !!startDate || !!endDate || !!dateType || !!reporterId;
}

interface AccidentFilterSelectFieldProps {
    label: string;
    value?: string;
    placeholder: string;
    allLabel: string;
    options: any[];
    onChange: (value: string) => void;
    disabled?: boolean;
}

function AccidentFilterSelectField({
    label,
    value,
    placeholder,
    allLabel,
    options,
    onChange,
    disabled,
}: AccidentFilterSelectFieldProps) {
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

interface AccidentDateFieldProps {
    id: 'startDate' | 'endDate';
    label: string;
    value?: string;
    onChange: (name: 'startDate' | 'endDate', value: string) => void;
    onClear: (name: 'startDate' | 'endDate') => void;
}

function AccidentDateField({ id, label, value, onChange, onClear }: AccidentDateFieldProps) {
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

interface AccidentStatusComboboxFieldProps {
    options: AccidentStatusOption[];
    value: string[];
    onChange: (values: string[]) => void;
}

function AccidentStatusComboboxField({ options, value, onChange }: AccidentStatusComboboxFieldProps) {
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
            <FieldLabel className="text-sm font-medium">Status Insiden</FieldLabel>

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

interface AccidentTypeComboboxFieldProps {
    options: AccidentTypeOption[];
    value: string[];
    onChange: (values: string[]) => void;
}

function AccidentTypeComboboxField({ options, value, onChange }: AccidentTypeComboboxFieldProps) {
    const anchor = useComboboxAnchor();
    const [open, setOpen] = useState(false);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const filterTypeItem = useMemo(() => {
        return (itemValue: string, query: string) => {
            const option = options.find((opt) => opt.value === itemValue);
            const label = option ? option.label : itemValue;

            return label.toLowerCase().includes(query.toLowerCase());
        };
    }, [options]);

    return (
        <Field className="gap-2" ref={setContainer}>
            <FieldLabel className="text-sm font-medium">Tipe Insiden</FieldLabel>

            <Combobox
                multiple
                autoHighlight
                items={options.map((opt) => opt.value)}
                value={value}
                onValueChange={onChange}
                open={open}
                onOpenChange={setOpen}
                filter={filterTypeItem}
            >
                <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                        {(values) => (
                            <>
                                {values.map((val: string) => {
                                    const option = options.find((opt) => opt.value === val);

                                    return <ComboboxChip key={val}>{option ? option.label : val}</ComboboxChip>;
                                })}
                                <ComboboxChipsInput placeholder="Pilih tipe..." onFocus={() => setOpen(true)} />
                            </>
                        )}
                    </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor} container={container ?? undefined}>
                    <ComboboxEmpty>Tipe tidak ditemukan.</ComboboxEmpty>
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

interface AccidentFilterModalContentProps {
    accidentFilter: AccidentFilterContextType;
    accidentStatusOptions: AccidentStatusOption[];
    accidentTypeOptions: AccidentTypeOption[];
    accidentDateTypeOptions: AccidentDateTypeOption[];
    userId?: number;
}

function AccidentFilterModalContent({
    accidentFilter,
    accidentStatusOptions,
    accidentTypeOptions,
    accidentDateTypeOptions,
    userId,
}: AccidentFilterModalContentProps) {
    const modal = useModal();
    const { data, utils, handlers } = accidentFilter;

    const initialStateModal = getInitialModalFilters(data.filterState);
    const [modalFilters, setModalFilters] = useState<AccidentModalFilterState>(initialStateModal);

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

    const selectedTypeArray = useMemo(() => {
        if (!modalFilters.type) {
            return [];
        }

        if (Array.isArray(modalFilters.type)) {
            return modalFilters.type;
        }

        return [modalFilters.type];
    }, [modalFilters.type]);

    const handleSelectStatus = (values: string[]) => {
        setModalFilters((prev) => ({
            ...prev,
            status: values.length > 0 ? (values as AccidentStatusEnglish[]) : undefined,
        }));
    };

    const handleSelectType = (values: string[]) => {
        setModalFilters((prev) => ({
            ...prev,
            type: values.length > 0 ? (values as AccidentTypeEnglish[]) : undefined,
        }));
    };

    const handleSelectDateType = (value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            dateType: utils.normalizeSelectValue(value) as AccidentDateTypeEnglish | undefined,
        }));
    };

    const handleSetDate = (name: 'startDate' | 'endDate', value: string) => {
        setModalFilters((prev) => ({
            ...prev,
            [name]: utils.normalizeInputValue(value),
        }));
    };

    const handleClearDate = (name: 'startDate' | 'endDate') => {
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
                        <AccidentStatusComboboxField
                            options={accidentStatusOptions}
                            value={selectedStatusArray}
                            onChange={handleSelectStatus}
                        />

                        <AccidentTypeComboboxField
                            options={accidentTypeOptions}
                            value={selectedTypeArray}
                            onChange={handleSelectType}
                        />

                        <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-muted/10 p-4 dark:bg-muted/5">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-foreground">Rentang Tanggal</span>
                                <span className="text-[11px] text-muted-foreground">
                                    Tentukan rentang tanggal filter dan jenis pencocokan tanggalnya.
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <AccidentDateField
                                    id="startDate"
                                    label="Tanggal Mulai"
                                    value={modalFilters.startDate}
                                    onChange={handleSetDate}
                                    onClear={handleClearDate}
                                />

                                <AccidentDateField
                                    id="endDate"
                                    label="Tanggal Selesai"
                                    value={modalFilters.endDate}
                                    onChange={handleSetDate}
                                    onClear={handleClearDate}
                                />
                            </div>

                            <AccidentFilterSelectField
                                label="Jenis Tanggal"
                                value={modalFilters.dateType}
                                placeholder="Insiden Dilaporkan"
                                allLabel="Semua Jenis Tanggal"
                                options={accidentDateTypeOptions}
                                onChange={handleSelectDateType}
                                disabled={!modalFilters.startDate || !modalFilters.endDate}
                            />
                        </div>

                        <Field orientation="horizontal" className="items-center gap-2.5">
                            <Checkbox
                                id="reporterId"
                                checked={!!modalFilters.reporterId}
                                onCheckedChange={(checked) => {
                                    setModalFilters((prev) => ({ ...prev, reporterId: checked ? userId : undefined }));
                                }}
                            />
                            <FieldContent>
                                <FieldLabel htmlFor="reporterId" className="cursor-pointer text-sm font-medium">
                                    Insiden yang Saya Laporkan
                                </FieldLabel>
                                <FieldDescription>Hanya tampilkan laporan insiden yang Anda buat sendiri.</FieldDescription>
                            </FieldContent>
                        </Field>
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
                                onClick={() => modal.close(ACCIDENT_FILTER_MODAL_ID)}
                            >
                                Batal
                            </Button>

                            <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={() => modal.close(ACCIDENT_FILTER_MODAL_ID)}
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

function AccidentFilterButton() {
    const modal = useModal();
    const accidentFilter = useAccidentFilterContext();
    const { accidentStatusOptions, accidentTypeOptions, accidentDateTypeOptions, auth } = usePage<AccidentPageProps>().props;

    const activeFilterCount = getActiveModalFilterCount(accidentFilter.data.filterState);

    const handleOpenModal = () => {
        modal.open({
            id: ACCIDENT_FILTER_MODAL_ID,
            title: 'Filter Laporan Insiden',
            description: 'Saring laporan insiden berdasarkan status, tipe, dan rentang tanggal.',
            content: (
                <AccidentFilterModalContent
                    accidentFilter={accidentFilter}
                    accidentStatusOptions={accidentStatusOptions}
                    accidentTypeOptions={accidentTypeOptions}
                    accidentDateTypeOptions={accidentDateTypeOptions}
                    userId={auth.user?.id}
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

function AccidentSearchInput() {
    const { data, handlers } = useAccidentFilterContext();

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
                placeholder="Cari nama pelanggan atau kode order..."
                value={data.filterState.search ?? ''}
                onChange={handlers.searchHandle.handleSearchChange}
            />
        </InputGroup>
    );
}

function AccidentOutletFilter() {
    const { handlers } = useAccidentFilterContext();
    const { outlets, outletSelected, auth } = usePage<AccidentPageProps>().props;

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

function AccidentSearchActions() {
    const { data, handlers } = useAccidentFilterContext();

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

function AccidentFilterForm() {
    const { data, handlers } = useAccidentFilterContext();
    const { auth } = usePage<AccidentPageProps>().props;

    const isSuperAdmin = RoleHelper.hasRole(auth.user, UserRole.SUPER_ADMIN);

    return (
        <form key={data.resetKey} onSubmit={handlers.searchHandle.handleSubmitSearch} className="w-full lg:max-w-2xl">
            <Activity mode={isSuperAdmin ? 'visible' : 'hidden'}>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <AccidentFilterButton />
                        <AccidentSearchInput />
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <AccidentOutletFilter />
                        <AccidentSearchActions />
                    </div>
                </div>
            </Activity>

            <Activity mode={isSuperAdmin ? 'hidden' : 'visible'}>
                <div className="flex w-full items-center gap-3">
                    <AccidentFilterButton />
                    <AccidentSearchInput />
                    <AccidentSearchActions />
                </div>
            </Activity>
        </form>
    );
}

export function AccidentFilters() {
    const accidentFilter = useAccidentFilters();

    return (
        <AccidentFilterContext.Provider value={accidentFilter}>
            <AccidentFilterForm />
        </AccidentFilterContext.Provider>
    );
}
