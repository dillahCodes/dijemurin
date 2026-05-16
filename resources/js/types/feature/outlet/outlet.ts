import type { User } from '../user/user';

export interface Outlet {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    picture: string | null;
    status: OutletStatus;
    created_at: string;
    updated_at: string;
}

export interface OutletDetail extends Outlet {
    users: User[];
}

export interface OutletStatus {
    label: OutletStatusOptionIndonesian;
    value: OutletStatusOption;
}

export enum OutletStatusOption {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum OutletStatusOptionIndonesian {
    ACTIVE = 'Aktif',
    INACTIVE = 'Tidak Aktif',
}
