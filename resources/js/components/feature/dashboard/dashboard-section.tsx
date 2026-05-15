import { usePage } from '@inertiajs/react';
import { getGreeting } from '@/helper/get-greeting';
import type { LaravelPaginator } from '@/hooks/use-pagination';
import type { Order, OrderTransitionRules } from '@/types/feature/order';
import { UserRole } from '@/types/feature/user/user';
import type { OrderOption } from '../order/order-data-section';
import type { OrderStatusDataChart, RevenueDataChart } from './charts-grid';
import { ChartsGrid } from './charts-grid';
import { RecentOrdersSection } from './recent-orders-section';
import { SummaryCardGrid } from './summary-card-grid';

export type DashboardSectionProps = {
    orders: LaravelPaginator<Order>;
    orderTransitionRules: OrderTransitionRules;
    orderStatusOptions: OrderOption[];

    chartWeekRevenue: RevenueDataChart[];
    chartMonthStatuses: OrderStatusDataChart[];

    todayRevenue: number;
    todayOrderCount: number;
    processOrderCount: number;
    doneOrderCount: number;
};

export function DashboardSection() {
    const { auth } = usePage().props;
    const role = auth.user.role;
    const isAdminOrSuperAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;

    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            {isAdminOrSuperAdmin && (
                <div className="rounded-xl border border-sidebar-border bg-sidebar px-5 py-4">
                    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{getGreeting()}</p>
                    <h1 className="mt-1 text-xl font-semibold text-foreground">{auth.user.name} 👋</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Selamat datang kembali di dashboard{role === UserRole.SUPER_ADMIN ? ' Super Admin' : ''}.
                    </p>
                </div>
            )}
            <SummaryCardGrid />
            <ChartsGrid />
            <RecentOrdersSection />
        </section>
    );
}
