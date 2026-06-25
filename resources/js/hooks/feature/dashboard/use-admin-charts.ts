import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';
import { usePage } from '@inertiajs/react';

export function useAdminCharts() {
    const { chartRevenueTrend, chartOrderMovement } = usePage<DashboardPageProps>().props;

    const revenueTrendData = chartRevenueTrend ?? [];
    const orderMovementData = chartOrderMovement ?? [];

    const totalMonthRevenue = revenueTrendData.reduce((acc, item) => acc + item.total, 0);

    return {
        revenueTrendData,
        orderMovementData,
        totalMonthRevenue,
    };
}
