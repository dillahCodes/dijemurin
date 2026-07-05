import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import type { OrderStatusEnglish, OrderStatusIndonesian } from '@/types/feature/order/order';
import { UserRole } from '@/types/feature/user/user';
import { AdminDashboardSection } from './admin/admin-dashboard-section';
import { CashierDashboardSection } from './cashier/cashier-dashboard-section';
import { OperatorDashboardSection } from './operator/operator-dashboard-section';
import { SuperAdminDashboardSection } from './superadmin/superadmin-dashboard-section';

// orders: LaravelPaginator<Order>;
// orderTransitionRules: OrderTransitionRules;
// orderStatusOptions: OrderOption[];

// chartWeekRevenue: RevenueDataChart[];
// chartMonthStatuses: OrderStatusDataChart[];

// todayRevenue: number;
// todayOrderCount: number;
// processOrderCount: number;
// doneOrderCount: number;

export type MonthRevenueTrendData = {
    name: string;
    total: number;
};

export type OrderMovementData = {
    name: string;
    order_masuk: number;
    order_selesai: number;
};

export type MonthOrderStatusData = {
    label: { name: OrderStatusIndonesian; value: OrderStatusEnglish };
    value: number;
};

export interface DashboardStats {
    // Super Admin
    todayRevenueAllOutlets?: number;
    todayOrdersAllOutlets?: number;
    activeOutlets?: number;
    activeUsers?: number;
    thisMonthRevenueAllOutlets?: number;
    thisMonthOrdersAllOutlets?: number;
    processingOrdersAllOutlets?: number;
    readyOrdersAllOutlets?: number;
    overdueOrdersAllOutlets?: number;
    almostOverdueOrdersAllOutlets?: number;
    cancelledTodayAllOutlets?: number;
    cancelledThisMonthAllOutlets?: number;

    // Admin
    todayRevenue?: number;
    todayOrders?: number;
    pendingOrders?: number;
    processOrders?: number;
    completedToday?: number;
    readyOrders?: number;
    employeeCount?: number;
    monthRevenue?: number;
    pickedUpToday?: number;
    cancelledToday?: number;

    // Cashier
    cashRevenue?: number;
    qrisRevenue?: number;
    activeServices?: number;

    // Operator
    overdueOrders?: number;
    almostOverdueOrders?: number;
}

export type HourlyOrderData = {
    hour: string;
    count: number;
};

export type PaymentMethodData = {
    label: { name: string; value: string };
    value: number;
};

export type ProcessedVsCompletedData = {
    hour: string;
    diproses: number;
    selesai: number;
};

export type DashboardPageProps = {
    dashboardRole: string;
    stats: DashboardStats;
    chartMonthRevenueTrend?: MonthRevenueTrendData[];
    chartMonthOrderStatuses?: MonthOrderStatusData[];
    chartRevenueTrend?: MonthRevenueTrendData[];
    chartOrderMovement?: OrderMovementData[];
    chartTodayHourlyOrders?: HourlyOrderData[];
    chartTodayPaymentMethods?: PaymentMethodData[];
    chartTodayHourlyProcessedVsCompleted?: ProcessedVsCompletedData[];
};

const DASHBOARD_ROLE_CONTENT: Partial<Record<UserRole, ReactNode>> = {
    [UserRole.SUPER_ADMIN]: <SuperAdminDashboardSection />,
    [UserRole.ADMIN]: <AdminDashboardSection />,
    [UserRole.CASHIER]: <CashierDashboardSection />,
    [UserRole.OPERATOR]: <OperatorDashboardSection />,
};

export function DashboardSection() {
    const { auth } = usePage().props;
    const role = auth.user?.role as UserRole;

    const Section = (role ? DASHBOARD_ROLE_CONTENT[role] : null) as ReactNode;

    return <>{Section}</>;
}

// <ChartsGrid />
// <RecentOrdersSection />
