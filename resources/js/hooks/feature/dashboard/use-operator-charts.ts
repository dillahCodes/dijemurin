import { usePage } from '@inertiajs/react';
import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';

export function useOperatorCharts() {
    const { chartTodayHourlyProcessedVsCompleted, stats } = usePage<DashboardPageProps>().props;

    const processedVsCompletedData = chartTodayHourlyProcessedVsCompleted ?? [];
    const almostOverdueCount = stats?.almostOverdueOrders ?? 0;
    const overdueCount = stats?.overdueOrders ?? 0;

    return {
        processedVsCompletedData,
        almostOverdueCount,
        overdueCount,
    };
}
