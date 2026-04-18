export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    role: { label: UserRoleIndonesian; value: UserRole };
    status: { label: UserStatusIndonesian; value: UserStatus };
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
}

export enum UserRoleIndonesian {
    SUPER_ADMIN = 'Super Admin',
    ADMIN = 'Admin',
    CASHIER = 'Kasir',
    OPERATOR = 'Operator',
}

export type UserTransitionRules = Record<UserRole, UserRole[]>;
