import { usePage } from '@inertiajs/react';
import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';

export function useSuperAdminCharts() {
    const { chartMonthRevenueTrend, chartMonthOrderStatuses } = usePage<DashboardPageProps>().props;

    const revenueTrendData = chartMonthRevenueTrend ?? [];
    const orderStatusData = chartMonthOrderStatuses ?? [];

    const totalGrossRevenue = revenueTrendData.reduce((acc, item) => acc + item.grossRevenue, 0);
    const totalLoss = revenueTrendData.reduce((acc, item) => acc + item.loss, 0);
    const totalNetRevenue = totalGrossRevenue - totalLoss;

    return {
        revenueTrendData,
        orderStatusData,
        totalGrossRevenue,
        totalLoss,
        totalNetRevenue,
    };
}
