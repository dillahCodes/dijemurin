import { usePage } from '@inertiajs/react';
import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';

export function useSuperAdminCharts() {
    const { chartMonthRevenueTrend, chartMonthOrderStatuses } = usePage<DashboardPageProps>().props;

    const revenueTrendData = chartMonthRevenueTrend ?? [];
    const orderStatusData = chartMonthOrderStatuses ?? [];

    const totalMonthRevenue = revenueTrendData.reduce((acc, item) => acc + item.total, 0);

    return {
        revenueTrendData,
        orderStatusData,
        totalMonthRevenue,
    };
}
