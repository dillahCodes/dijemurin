import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Accident } from '@/types/feature/accident/accident';
import type {
    AccidentTypeEnglish,
    AccidentTypeIndonesian,
    AccidentStatusEnglish,
    AccidentStatusIndonesian,
    AccidentCompensationTypeEnglish,
    AccidentCompensationTypeIndonesian,
    AccidentDateTypeEnglish,
    AccidentDateTypeIndonesian,
} from '@/types/feature/accident/accident';
import type { Outlet } from '@/types/feature/outlet/outlet';
import type { ApiResponse } from '@/types/response';
import { AccidentDataHeader } from './accident-data-header';
import { AccidentFilters } from './accident-filters';
import { AccidentTable } from './accident-table';
import { AccidentTablePagination } from './accident-table-pagination';

export type AccidentStatusOption = {
    label: AccidentStatusIndonesian;
    value: AccidentStatusEnglish;
};

export type AccidentTypeOption = {
    label: AccidentTypeIndonesian;
    value: AccidentTypeEnglish;
};

export type AccidentCompensationTypeOption = {
    label: AccidentCompensationTypeIndonesian;
    value: AccidentCompensationTypeEnglish;
};

export type AccidentDateTypeOption = {
    label: AccidentDateTypeIndonesian;
    value: AccidentDateTypeEnglish;
};

export type AccidentFilterPageProps = {
    search?: string;
    status?: AccidentStatusEnglish | AccidentStatusEnglish[];
    type?: AccidentTypeEnglish | AccidentTypeEnglish[];
    startDate?: string;
    endDate?: string;
    dateType?: AccidentDateTypeEnglish;
    outletIdSelected?: number;
    outletSearch?: string;
    reporterId?: number;
};

export type AccidentPageProps = {
    accidents: LaravelPaginator<Accident>;
    filters: AccidentFilterPageProps;
    accidentStatusOptions: AccidentStatusOption[];
    accidentTypeOptions: AccidentTypeOption[];
    compensationTypeOptions: AccidentCompensationTypeOption[];
    accidentDateTypeOptions: AccidentDateTypeOption[];
    outlets?: LaravelPaginator<Outlet>;
    outletSelected?: ApiResponse<Outlet>;
};

export function AccidentDataSection() {
    return (
        <div className="flex flex-col gap-6">
            <AccidentDataHeader />
            <AccidentFilters />
            <div className="rounded-md border">
                <AccidentTable />
            </div>
            <AccidentTablePagination />
        </div>
    );
}
