export interface User {
    id: 4;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    role: UserRole;
}

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CASHIER = 'cashier',
    OPERATOR = 'operator',
}
