export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    role: { label: UserRoleIndonesian; value: UserRole };
    status: { label: UserStatusIndonesian; value: UserStatus };
    outlet?: { id: number; name: string };
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum UserStatusIndonesian {
    ACTIVE = 'Aktif',
    INACTIVE = 'Tidak Aktif',
    SUSPENDED = 'Ditangguhkan',
}

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CASHIER = 'cashier',
    OPERATOR = 'operator',
    GHOST = 'ghost',
}

export enum UserRoleIndonesian {
    SUPER_ADMIN = 'Super Admin',
    ADMIN = 'Admin',
    CASHIER = 'Kasir',
    OPERATOR = 'Operator',
    GHOST = 'Belum Memiliki Role',
}

export type UserTransitionRules = Record<UserRole, UserRole[]>;
