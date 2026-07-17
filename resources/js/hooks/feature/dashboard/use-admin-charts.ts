import { usePage } from '@inertiajs/react';
import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';

export function useAdminCharts() {
    const { chartRevenueTrend, chartOrderMovement } = usePage<DashboardPageProps>().props;

    const revenueTrendData = chartRevenueTrend ?? [];
    const orderMovementData = chartOrderMovement ?? [];

    const totalGrossRevenue = revenueTrendData.reduce((acc, item) => acc + item.grossRevenue, 0);
    const totalLoss = revenueTrendData.reduce((acc, item) => acc + item.loss, 0);
    const totalNetRevenue = totalGrossRevenue - totalLoss;

    return {
        revenueTrendData,
        orderMovementData,
        totalGrossRevenue,
        totalLoss,
        totalNetRevenue,
    };
}
