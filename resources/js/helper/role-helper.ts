import type { User } from '@/types';
import type { UserRole } from '@/types/feature/user/user';

export const RoleHelper = {
    hasRole: (user: User, role: UserRole): boolean => {
        return user.role === role;
    },

    hasRoles: (user: User, roles: UserRole[]): boolean => {
        return roles.includes(user.role);
    },
};
