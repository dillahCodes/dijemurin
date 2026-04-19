import { User, UserRole } from '../user/user';

export interface Outlet {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string | null;
    status: { label: OutletStatusOptionIndonesian; value: OutletStatusOption };
    role_count: {
        [UserRole.ADMIN]: number;
        [UserRole.CASHIER]: number;
        [UserRole.OPERATOR]: number;
    };
    created_at: string;
    updated_at: string;
}

export interface OutletDetail extends Omit<Outlet, 'role_count'> {
    users: User[];
}

export enum OutletStatusOption {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum OutletStatusOptionIndonesian {
    ACTIVE = 'Aktif',
    INACTIVE = 'Tidak Aktif',
}
