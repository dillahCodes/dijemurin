import { usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    Play,
    ShieldAlert,
    ShoppingBag,
    Store,
    Timer,
    Users,
} from 'lucide-react';
import type { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';
import { formatPrice } from '@/helper/formatted-price';
import { AccidentStatusEnglish } from '@/types/feature/accident/accident';
import { OrderDateTypeEnglish, OrderStatusEnglish, OrderTimeStatusEnglish } from '@/types/feature/order/order';
import { OutletStatusOption } from '@/types/feature/outlet/outlet';
import { UserRole, UserStatus } from '@/types/feature/user/user';
import accidentRoutes from '@/routes/accidents';
import layanan from '@/routes/layanan';
import orderRoutes from '@/routes/order';
import outlet from '@/routes/outlet';
import pengguna from '@/routes/pengguna';

const formatLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getLocalDashboardDateRange = () => {
    const today = new Date();

    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
        todayStr: formatLocalDateString(today),
        startMonthStr: formatLocalDateString(startMonth),
        endMonthStr: formatLocalDateString(endMonth),
    };
};

export function useSummaryCardGrid() {
    const { dashboardRole, stats, auth } = usePage<DashboardPageProps>().props;
    const { todayStr, startMonthStr, endMonthStr } = getLocalDashboardDateRange();

    const getCardGroups = () => {
        // Standard color configurations
        const slateColors = {
            iconColor: 'text-slate-600 dark:text-slate-400',
            iconBg: 'bg-slate-600/10 dark:bg-slate-400/10',
            accentColor: 'bg-slate-600 dark:bg-slate-400',
        };

        const emeraldColors = {
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
        };

        const roseColors = {
            iconColor: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
            accentColor: 'bg-rose-600 dark:bg-rose-400',
        };

        switch (dashboardRole) {
            case UserRole.SUPER_ADMIN:
                return {
                    actionCards: [
                        {
                            title: 'Sedang Diproses',
                            count: stats.processingOrdersAllOutlets ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Siap Diambil',
                            count: stats.readyOrdersAllOutlets ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Hampir Terlambat',
                            count: stats.almostOverdueOrdersAllOutlets ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({
                                query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE },
                            }).url,
                        },
                        {
                            title: 'Order Terlambat',
                            count: stats.overdueOrdersAllOutlets ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                        {
                            title: 'Insiden Aktif',
                            count: stats.activeAccidentsAllOutlets ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...roseColors,
                            href: accidentRoutes.index({
                                query: {
                                    status: [AccidentStatusEnglish.PENDING, AccidentStatusEnglish.INVESTIGATING],
                                },
                            }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Bersih Bulan Ini',
                            count: stats.thisMonthNetRevenueAllOutlets ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            ...emeraldColors,
                            description: `Kotor: ${formatPrice(stats.thisMonthRevenueAllOutlets ?? 0)} | Kerugian: -${formatPrice(stats.resolvedAccidentLossThisMonthAllOutlets ?? 0)}`,
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Pendapatan Hari Ini',
                            count: stats.todayRevenueAllOutlets ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            ...slateColors,
                            description: 'Semua outlet',
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Order Bulan Ini',
                            count: stats.thisMonthOrdersAllOutlets ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            ...slateColors,
                            description: `Total aktif | Dibatalkan: ${stats.cancelledThisMonthAllOutlets ?? 0}`,
                            href: orderRoutes.index({
                                query: {
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                    status: [
                                        OrderStatusEnglish.PENDING,
                                        OrderStatusEnglish.PROCESS,
                                        OrderStatusEnglish.DONE,
                                        OrderStatusEnglish.PICKED_UP,
                                    ],
                                },
                            }).url,
                        },
                        {
                            title: 'Order Hari Ini',
                            count: stats.todayOrdersAllOutlets ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            ...slateColors,
                            description: `Total aktif | Dibatalkan: ${stats.cancelledTodayAllOutlets ?? 0}`,
                            href: orderRoutes.index({
                                query: {
                                    startDate: todayStr,
                                    endDate: todayStr,
                                    status: [
                                        OrderStatusEnglish.PENDING,
                                        OrderStatusEnglish.PROCESS,
                                        OrderStatusEnglish.DONE,
                                        OrderStatusEnglish.PICKED_UP,
                                    ],
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [
                        {
                            title: 'Outlet Aktif',
                            count: stats.activeOutlets ?? 0,
                            icon: Store,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Saat ini',
                            href: outlet.index({ query: { status: OutletStatusOption.ACTIVE } }).url,
                        },
                        {
                            title: 'Pengguna Aktif',
                            count: stats.activeUsers ?? 0,
                            icon: Users,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Semua outlet',
                            href: pengguna.index({ query: { status: UserStatus.ACTIVE } }).url,
                        },
                    ],
                };

            case UserRole.ADMIN:
                return {
                    actionCards: [
                        {
                            title: 'Antrean Baru (Kasir)',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PENDING } }).url,
                        },
                        {
                            title: 'Sedang Diproses (Operator)',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Siap Diambil (di Kasir)',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Hampir Terlambat (Operator)',
                            count: stats.almostOverdueOrders ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE } }).url,
                        },
                        {
                            title: 'Order Terlambat (Operator)',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                        {
                            title: 'Insiden Aktif',
                            count: stats.activeAccidents ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...roseColors,
                            href: accidentRoutes.index({
                                query: {
                                    status: [AccidentStatusEnglish.PENDING, AccidentStatusEnglish.INVESTIGATING],
                                },
                            }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Bersih Bulan Ini',
                            count: stats.netRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            ...emeraldColors,
                            description: `Kotor: ${formatPrice(stats.monthRevenue ?? 0)} | Kerugian: -${formatPrice(stats.resolvedAccidentLossThisMonth ?? 0)}`,
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Pendapatan Hari Ini',
                            count: stats.todayRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            ...slateColors,
                            description: 'Outlet ini',
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Order Hari Ini',
                            count: stats.todayOrders ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            ...slateColors,
                            description: `Total aktif | Dibatalkan: ${stats.cancelledToday ?? 0}`,
                            href: orderRoutes.index({ query: { startDate: todayStr, endDate: todayStr } }).url,
                        },
                        {
                            title: 'Selesai Hari Ini (Operator)',
                            count: stats.completedToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Sudah selesai hari ini',
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Sudah Diambil Hari Ini (Kasir)',
                            count: stats.pickedUpToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Diserahkan ke pelanggan',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.PICKED_UP,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [
                        {
                            title: 'Karyawan Aktif',
                            count: stats.employeeCount ?? 0,
                            icon: Users,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Outlet ini',
                            href: pengguna.index().url,
                        },
                    ],
                };

            case UserRole.CASHIER:
                return {
                    actionCards: [
                        {
                            title: 'Antrean Baru (Belum Diproses)',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.PENDING },
                            }).url,
                        },
                        {
                            title: 'Sedang Diproses (di Operator)',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.PROCESS },
                            }).url,
                        },
                        {
                            title: 'Siap Diambil (Selesai)',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.DONE },
                            }).url,
                        },
                        {
                            title: 'Order Terlambat (Operator)',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                        {
                            title: 'Insiden Aktif',
                            count: stats.activeAccidents ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...roseColors,
                            href: accidentRoutes.index({
                                query: {
                                    status: [AccidentStatusEnglish.PENDING, AccidentStatusEnglish.INVESTIGATING],
                                },
                            }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Hari Ini',
                            count: stats.todayRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            ...slateColors,
                            description: `Cash: ${formatPrice(stats.cashRevenue ?? 0)} | QRIS: ${formatPrice(stats.qrisRevenue ?? 0)}`,
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Order Hari Ini',
                            count: stats.todayOrders ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            ...slateColors,
                            description: `Total aktif | Dibatalkan: ${stats.cancelledToday ?? 0}`,
                            href: orderRoutes.index({ query: { startDate: todayStr, endDate: todayStr } }).url,
                        },
                        {
                            title: 'Layanan Aktif',
                            count: stats.activeServices ?? 0,
                            icon: Store,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Outlet ini',
                            href: layanan.index().url,
                        },
                        {
                            title: 'Insiden Saya Laporkan',
                            count: stats.myReportedAccidents ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Laporan saya',
                            href: accidentRoutes.index({
                                query: { reporterId: auth.user?.id },
                            }).url,
                        },
                        {
                            title: 'Insiden Selesai Bulan Ini',
                            count: stats.resolvedAccidentsThisMonth ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Outlet ini',
                            href: accidentRoutes.index({
                                query: {
                                    status: AccidentStatusEnglish.RESOLVED,
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [],
                };

            case UserRole.OPERATOR:
                return {
                    actionCards: [
                        {
                            title: 'Antrean Baru (dari Kasir)',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PENDING } }).url,
                        },
                        {
                            title: 'Sedang Diproses',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            ...slateColors,
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Hampir Terlambat',
                            count: stats.almostOverdueOrders ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE } }).url,
                        },
                        {
                            title: 'Order Terlambat',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            ...roseColors,
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                        {
                            title: 'Insiden Aktif',
                            count: stats.activeAccidents ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...roseColors,
                            href: accidentRoutes.index({
                                query: {
                                    status: [AccidentStatusEnglish.PENDING, AccidentStatusEnglish.INVESTIGATING],
                                },
                            }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Selesai Hari Ini',
                            count: stats.completedToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Order selesai hari ini',
                            href: orderRoutes.index({
                                query: {
                                    status: [OrderStatusEnglish.DONE, OrderStatusEnglish.PICKED_UP],
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Menunggu Diambil (di Kasir)',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Selesai tapi belum diambil',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Sudah Diambil Hari Ini (Kasir)',
                            count: stats.pickedUpToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Diserahkan ke pelanggan',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.PICKED_UP,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Insiden Saya Laporkan',
                            count: stats.myReportedAccidents ?? 0,
                            icon: ShieldAlert,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Laporan saya',
                            href: accidentRoutes.index({
                                query: { reporterId: auth.user?.id },
                            }).url,
                        },
                        {
                            title: 'Insiden Selesai Bulan Ini',
                            count: stats.resolvedAccidentsThisMonth ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            ...slateColors,
                            description: 'Outlet ini',
                            href: accidentRoutes.index({
                                query: {
                                    status: AccidentStatusEnglish.RESOLVED,
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [],
                };

            default:
                return { actionCards: [], summaryCards: [], overviewCards: [] };
        }
    };

    const { actionCards, summaryCards, overviewCards } = getCardGroups();

    return {
        actionCards,
        summaryCards,
        overviewCards,
    };
}
