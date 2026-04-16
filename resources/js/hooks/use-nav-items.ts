import type { NavItem } from '@/types';
import type { UserRole } from '@/types/feature/user/user';

export function useNavItems(role: UserRole, navItems: NavItem[]): NavItem[] {
    const filteredItems = navItems.filter((item) => item.role.includes(role));

    return filteredItems;
}
