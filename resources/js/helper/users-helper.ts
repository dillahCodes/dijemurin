import type { MultipleOption } from '@/components/ui/multi-select-list-box';
import type { User, UserRole } from '@/types/feature/user/user';

export const UserHelper = {
    findUserRole(user: User[], role: UserRole) {
        return user.find((user) => user.role.value === role);
    },

    filterUserRole(user: User[], role: UserRole) {
        return user.filter((user) => user.role.value === role);
    },

    getUserIds(user: User[]): number[] {
        return user.map((user) => user.id);
    },

    getUserOptions(user: User[]): MultipleOption[] {
        return user.map((user) => ({ value: user.id.toString(), label: user.name }));
    },

    getUserOptionsByRole(user: User[], role: UserRole): MultipleOption[] {
        return user
            .filter((user) => user.role.value === role)
            .map((user) => ({ value: user.id.toString(), label: user.name }));
    },
};
