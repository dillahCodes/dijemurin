import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, FileText, LayoutGrid, ShoppingBag, Store, Users, WashingMachine } from 'lucide-react';
import AppLogo from '@/components/layout/app-logo';
import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
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
import type { NavItem } from '@/types';
import { UserRole } from '@/types/feature/user/user';
import { dashboard, laporan } from '@/routes';
import accidents from '@/routes/accidents';
import layanan from '@/routes/layanan';
import order from '@/routes/order';
import outlet from '@/routes/outlet';
import pengguna from '@/routes/pengguna';

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
        title: 'Insiden',
        href: accidents.index(),
        icon: AlertTriangle,
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER, UserRole.OPERATOR],
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
        role: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CASHIER, UserRole.OPERATOR],
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
