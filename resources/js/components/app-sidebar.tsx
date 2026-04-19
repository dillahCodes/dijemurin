import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useNavItems } from '@/hooks/use-nav-items';
import { dashboard, laporan } from '@/routes';
import layanan from '@/routes/layanan';
import order from '@/routes/order';
import outlet from '@/routes/outlet';
import pengguna from '@/routes/pengguna';
import type { NavItem } from '@/types';
import { UserRole } from '@/types/feature/user/user';
import { Link, usePage } from '@inertiajs/react';
import { FileText, LayoutGrid, ShoppingBag, Store, Users, WashingMachine } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER, UserRole.OPERATOR],
    },
    {
        title: 'Order',
        href: order.index(),
        icon: ShoppingBag,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER, UserRole.OPERATOR],
    },
    {
        title: 'Layanan',
        href: layanan.index(),
        icon: WashingMachine,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER],
    },
    {
        title: 'Pengguna',
        href: pengguna.index(),
        icon: Users,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    {
        title: 'Outlet',
        href: outlet.index(),
        icon: Store,
        role: [UserRole.SUPER_ADMIN],
    },
    {
        title: 'Laporan',
        href: laporan(),
        icon: FileText,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.user.role as UserRole;

    const navItems = useNavItems(role, mainNavItems);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
