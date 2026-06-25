import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';
import { usePage } from '@inertiajs/react';

export function useCashierCharts() {
    const { chartTodayHourlyOrders, chartTodayPaymentMethods } = usePage<DashboardPageProps>().props;

    const todayHourlyOrders = chartTodayHourlyOrders ?? [];
    const todayPaymentMethods = chartTodayPaymentMethods ?? [];

    return {
        todayHourlyOrders,
        todayPaymentMethods,
    };
}
