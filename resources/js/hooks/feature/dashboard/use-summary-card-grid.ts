import { DashboardPageProps } from '@/components/feature/dashboard/dashboard-section';
import orderRoutes from '@/routes/order';
import outlet from '@/routes/outlet';
import pengguna from '@/routes/pengguna';
import { OrderDateTypeEnglish, OrderStatusEnglish, OrderTimeStatusEnglish } from '@/types/feature/order/order';
import { OutletStatusOption } from '@/types/feature/outlet/outlet';
import { UserRole, UserStatus } from '@/types/feature/user/user';
import { usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Package,
    Play,
    ShoppingBag,
    Store,
    Timer,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';

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
    const { dashboardRole, stats } = usePage<DashboardPageProps>().props;
    const { todayStr, startMonthStr, endMonthStr } = getLocalDashboardDateRange();

    const getCardGroups = () => {
        switch (dashboardRole) {
            case UserRole.SUPER_ADMIN:
                return {
                    actionCards: [
                        {
                            title: 'Sedang Diproses',
                            description: 'Operator (Semua)',
                            count: stats.processingOrdersAllOutlets ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            iconColor: 'text-purple-600 dark:text-purple-400',
                            iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
                            accentColor: 'bg-purple-600 dark:bg-purple-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Siap Diambil',
                            description: 'Kasir (Semua)',
                            count: stats.readyOrdersAllOutlets ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            iconColor: 'text-indigo-600 dark:text-indigo-400',
                            iconBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
                            accentColor: 'bg-indigo-600 dark:bg-indigo-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Hampir Terlambat',
                            description: 'Sisa waktu < 1 jam',
                            count: stats.almostOverdueOrdersAllOutlets ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            iconColor: 'text-orange-600 dark:text-orange-400',
                            iconBg: 'bg-orange-600/10 dark:bg-orange-400/10',
                            accentColor: 'bg-orange-600 dark:bg-orange-400',
                            href: orderRoutes.index({
                                query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE },
                            }).url,
                        },
                        {
                            title: 'Order Terlambat',
                            description: 'Semua outlet',
                            count: stats.overdueOrdersAllOutlets ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Hari Ini',
                            description: 'Semua outlet',
                            count: stats.todayRevenueAllOutlets ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
                            title: 'Pendapatan Bulan Ini',
                            description: 'Semua outlet',
                            count: stats.thisMonthRevenueAllOutlets ?? 0,
                            icon: TrendingUp,
                            type: 'currency' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
                            title: 'Order Hari Ini',
                            description: 'Semua outlet',
                            count: stats.todayOrdersAllOutlets ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            iconColor: 'text-blue-600 dark:text-blue-400',
                            iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
                            accentColor: 'bg-blue-600 dark:bg-blue-400',
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
                        {
                            title: 'Order Bulan Ini',
                            description: 'Semua outlet',
                            count: stats.thisMonthOrdersAllOutlets ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            iconColor: 'text-blue-600 dark:text-blue-400',
                            iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
                            accentColor: 'bg-blue-600 dark:bg-blue-400',
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
                            title: 'Dibatalkan Hari Ini',
                            description: 'Semua outlet',
                            count: stats.cancelledTodayAllOutlets ?? 0,
                            icon: XCircle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.CANCELLED,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                        {
                            title: 'Dibatalkan Bulan Ini',
                            description: 'Semua outlet',
                            count: stats.cancelledThisMonthAllOutlets ?? 0,
                            icon: XCircle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.CANCELLED,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: startMonthStr,
                                    endDate: endMonthStr,
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [
                        {
                            title: 'Outlet Aktif',
                            description: 'Saat ini',
                            count: stats.activeOutlets ?? 0,
                            icon: Store,
                            type: 'number' as const,
                            iconColor: 'text-slate-600 dark:text-slate-400',
                            iconBg: 'bg-slate-600/10 dark:bg-slate-400/10',
                            accentColor: 'bg-slate-600 dark:bg-slate-400',
                            href: outlet.index({ query: { status: OutletStatusOption.ACTIVE } }).url,
                        },
                        {
                            title: 'Pengguna Aktif',
                            description: 'Semua outlet',
                            count: stats.activeUsers ?? 0,
                            icon: Users,
                            type: 'number' as const,
                            iconColor: 'text-cyan-600 dark:text-cyan-400',
                            iconBg: 'bg-cyan-600/10 dark:bg-cyan-400/10',
                            accentColor: 'bg-cyan-600 dark:bg-cyan-400',
                            href: pengguna.index({ query: { status: UserStatus.ACTIVE } }).url,
                        },
                    ],
                };

            case UserRole.ADMIN:
                return {
                    actionCards: [
                        {
                            title: 'Antrean Baru (Kasir)',
                            description: 'Belum diproses',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            iconColor: 'text-amber-600 dark:text-amber-400',
                            iconBg: 'bg-amber-600/10 dark:bg-amber-400/10',
                            accentColor: 'bg-amber-600 dark:bg-amber-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PENDING } }).url,
                        },
                        {
                            title: 'Sedang Diproses (Operator)',
                            description: 'Sedang dikerjakan',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            iconColor: 'text-purple-600 dark:text-purple-400',
                            iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
                            accentColor: 'bg-purple-600 dark:bg-purple-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Siap Diambil (di Kasir)',
                            description: 'Menunggu pelanggan',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            iconColor: 'text-indigo-600 dark:text-indigo-400',
                            iconBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
                            accentColor: 'bg-indigo-600 dark:bg-indigo-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Hampir Terlambat (Operator)',
                            description: 'Sisa waktu < 1 jam',
                            count: stats.almostOverdueOrders ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            iconColor: 'text-orange-600 dark:text-orange-400',
                            iconBg: 'bg-orange-600/10 dark:bg-orange-400/10',
                            accentColor: 'bg-orange-600 dark:bg-orange-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE } }).url,
                        },
                        {
                            title: 'Order Terlambat (Operator)',
                            description: 'Batas waktu terlewati',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Hari Ini',
                            description: 'Outlet ini',
                            count: stats.todayRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
                            description: 'Outlet ini',
                            count: stats.todayOrders ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            iconColor: 'text-blue-600 dark:text-blue-400',
                            iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
                            accentColor: 'bg-blue-600 dark:bg-blue-400',
                            href: orderRoutes.index({ query: { startDate: todayStr, endDate: todayStr } }).url,
                        },
                        {
                            title: 'Selesai Hari Ini (Operator)',
                            description: 'Sudah selesai hari ini',
                            count: stats.completedToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            iconColor: 'text-teal-600 dark:text-teal-400',
                            iconBg: 'bg-teal-600/10 dark:bg-teal-400/10',
                            accentColor: 'bg-teal-600 dark:bg-teal-400',
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
                            description: 'Diserahkan ke pelanggan',
                            count: stats.pickedUpToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
                            title: 'Dibatalkan Hari Ini',
                            description: 'Outlet ini',
                            count: stats.cancelledToday ?? 0,
                            icon: XCircle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.CANCELLED,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                },
                            }).url,
                        },
                    ],
                    overviewCards: [],
                };

            case UserRole.CASHIER:
                return {
                    actionCards: [
                        {
                            title: 'Antrean Baru (Belum Diproses)',
                            description: 'Menunggu operator',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            iconColor: 'text-amber-600 dark:text-amber-400',
                            iconBg: 'bg-amber-600/10 dark:bg-amber-400/10',
                            accentColor: 'bg-amber-600 dark:bg-amber-400',
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.PENDING },
                            }).url,
                        },
                        {
                            title: 'Sedang Diproses (di Operator)',
                            description: 'Sedang dikerjakan',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            iconColor: 'text-purple-600 dark:text-purple-400',
                            iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
                            accentColor: 'bg-purple-600 dark:bg-purple-400',
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.PROCESS },
                            }).url,
                        },
                        {
                            title: 'Siap Diambil (Selesai)',
                            description: 'Menunggu pelanggan',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            iconColor: 'text-indigo-600 dark:text-indigo-400',
                            iconBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
                            accentColor: 'bg-indigo-600 dark:bg-indigo-400',
                            href: orderRoutes.index({
                                query: { status: OrderStatusEnglish.DONE },
                            }).url,
                        },
                        {
                            title: 'Order Terlambat (Operator)',
                            description: 'Prioritas follow-up',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Pendapatan Hari Ini',
                            description: 'Outlet ini',
                            count: stats.todayRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
                            title: 'Cash Hari Ini',
                            description: 'Pembayaran tunai',
                            count: stats.cashRevenue ?? 0,
                            icon: DollarSign,
                            type: 'currency' as const,
                            iconColor: 'text-amber-600 dark:text-amber-400',
                            iconBg: 'bg-amber-600/10 dark:bg-amber-400/10',
                            accentColor: 'bg-amber-600 dark:bg-amber-400',
                            href: orderRoutes.index({
                                query: {
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                    paymentMethod: 'cash',
                                },
                            }).url,
                        },
                        {
                            title: 'QRIS Hari Ini',
                            description: 'Pembayaran digital',
                            count: stats.qrisRevenue ?? 0,
                            icon: CreditCard,
                            type: 'currency' as const,
                            iconColor: 'text-indigo-600 dark:text-indigo-400',
                            iconBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
                            accentColor: 'bg-indigo-600 dark:bg-indigo-400',
                            href: orderRoutes.index({
                                query: {
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
                                    paymentMethod: 'qris',
                                },
                            }).url,
                        },
                        {
                            title: 'Order Hari Ini',
                            description: 'Outlet ini',
                            count: stats.todayOrders ?? 0,
                            icon: ShoppingBag,
                            type: 'number' as const,
                            iconColor: 'text-blue-600 dark:text-blue-400',
                            iconBg: 'bg-blue-600/10 dark:bg-blue-400/10',
                            accentColor: 'bg-blue-600 dark:bg-blue-400',
                            href: orderRoutes.index({ query: { startDate: todayStr, endDate: todayStr } }).url,
                        },
                        {
                            title: 'Dibatalkan Hari Ini',
                            description: 'Outlet ini',
                            count: stats.cancelledToday ?? 0,
                            icon: XCircle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({
                                query: {
                                    status: OrderStatusEnglish.CANCELLED,
                                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                                    startDate: todayStr,
                                    endDate: todayStr,
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
                            description: 'Belum diproses',
                            count: stats.pendingOrders ?? 0,
                            icon: Clock,
                            type: 'number' as const,
                            iconColor: 'text-amber-600 dark:text-amber-400',
                            iconBg: 'bg-amber-600/10 dark:bg-amber-400/10',
                            accentColor: 'bg-amber-600 dark:bg-amber-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PENDING } }).url,
                        },
                        {
                            title: 'Sedang Diproses',
                            description: 'Sedang dikerjakan',
                            count: stats.processOrders ?? 0,
                            icon: Play,
                            type: 'number' as const,
                            iconColor: 'text-purple-600 dark:text-purple-400',
                            iconBg: 'bg-purple-600/10 dark:bg-purple-400/10',
                            accentColor: 'bg-purple-600 dark:bg-purple-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.PROCESS } }).url,
                        },
                        {
                            title: 'Hampir Terlambat',
                            description: 'Sisa waktu < 1 jam',
                            count: stats.almostOverdueOrders ?? 0,
                            icon: Timer,
                            type: 'number' as const,
                            iconColor: 'text-orange-600 dark:text-orange-400',
                            iconBg: 'bg-orange-600/10 dark:bg-orange-400/10',
                            accentColor: 'bg-orange-600 dark:bg-orange-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.ALMOST_OVERDUE } }).url,
                        },
                        {
                            title: 'Order Terlambat',
                            description: 'Batas waktu terlewati',
                            count: stats.overdueOrders ?? 0,
                            icon: AlertTriangle,
                            type: 'number' as const,
                            iconColor: 'text-rose-600 dark:text-rose-400',
                            iconBg: 'bg-rose-600/10 dark:bg-rose-400/10',
                            accentColor: 'bg-rose-600 dark:bg-rose-400',
                            href: orderRoutes.index({ query: { timeStatus: OrderTimeStatusEnglish.OVERDUE } }).url,
                        },
                    ],
                    summaryCards: [
                        {
                            title: 'Selesai Hari Ini ',
                            description: 'Order selesai hari ini',
                            count: stats.completedToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            iconColor: 'text-teal-600 dark:text-teal-400',
                            iconBg: 'bg-teal-600/10 dark:bg-teal-400/10',
                            accentColor: 'bg-teal-600 dark:bg-teal-400',
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
                            description: 'Selesai tapi belum diambil',
                            count: stats.readyOrders ?? 0,
                            icon: Package,
                            type: 'number' as const,
                            iconColor: 'text-indigo-600 dark:text-indigo-400',
                            iconBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
                            accentColor: 'bg-indigo-600 dark:bg-indigo-400',
                            href: orderRoutes.index({ query: { status: OrderStatusEnglish.DONE } }).url,
                        },
                        {
                            title: 'Sudah Diambil Hari Ini (Kasir)',
                            description: 'Diserahkan ke pelanggan',
                            count: stats.pickedUpToday ?? 0,
                            icon: CheckCircle2,
                            type: 'number' as const,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            iconBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
                            accentColor: 'bg-emerald-600 dark:bg-emerald-400',
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
