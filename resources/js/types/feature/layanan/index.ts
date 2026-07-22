import type { Outlet } from '../outlet/outlet';

export interface Service {
    id: number;
    name: string;
    description: string;
    outlet_id: number;
    outlet?: Outlet;
    created_at: string;
    updated_at: string;
}

export interface ServiceDetail extends Service {
    outlet: Outlet;
}

export enum ServiceTimeType {
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
}

export enum ServiceTimeTypeIndonesian {
    MINUTE = 'menit',
    HOUR = 'jam',
    DAY = 'hari',
}

export interface ServiceItem {
    id: number;

    name: string;
    description: string;
    time_number: number;
    time_type: ServiceTimeType;
    price: number;
    unit: string;

    service_id: number;

    created_at: string;
    updated_at: string;
}
