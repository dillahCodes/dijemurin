import { router, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/helper/formatted-price';
import { indoToEnglishStatuses } from '@/helper/indo-to-english-statuses';
import { useAppearance } from '@/hooks/use-appearance';
import type { OrderStatusEnglish } from '@/types/feature/order/order';
import { OrderStatusIndonesian } from '@/types/feature/order/order';
import type { DashboardSectionProps } from './dashboard-section';
import order from '@/routes/order';

export type RevenueDataChart = {
    name: string;
    total: number;
};

export type OrderStatusDataChart = {
    label: { name: OrderStatusIndonesian; value: OrderStatusEnglish };
    value: number;
};

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const BAR_CHART_CONFIG = {
    colors: {
        revenueBar: { light: '#6366f1', dark: '#818cf8' },
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
    },
} as const;

const PIE_CHART_STATUS_CONFIG: Record<OrderStatusIndonesian, { light: string; dark: string }> = {
    [OrderStatusIndonesian.PENDING]: { light: '#64748b', dark: '#94a3b8' }, // secondary (slate)
    [OrderStatusIndonesian.DONE]: { light: '#10b981', dark: '#34d399' }, // emerald
    [OrderStatusIndonesian.PROCESS]: { light: '#eab308', dark: '#facc15' }, // yellow
    [OrderStatusIndonesian.CANCELLED]: { light: '#ef4444', dark: '#f87171' }, // destructive (red)
    [OrderStatusIndonesian.PICKED_UP]: { light: '#3b82f6', dark: '#60a5fa' }, // blue
};

const PIE_CHART_CONFIG = {
    colors: {
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
        pieFallback: { light: '#a1a1aa', dark: '#e4e4e7' },
        status: PIE_CHART_STATUS_CONFIG,
    },
} as const;

/**
 * sub components
 */

interface RevenueBarChartProps {
    data: RevenueDataChart[];
    height: number;
    isDark: boolean;
}

function RevenueBarChart({ data, height, isDark }: RevenueBarChartProps) {
    const TICK_COLOR = isDark ? BAR_CHART_CONFIG.colors.tick.dark : BAR_CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? BAR_CHART_CONFIG.colors.tooltipBg.dark : BAR_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? BAR_CHART_CONFIG.colors.tooltipText.dark : BAR_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? BAR_CHART_CONFIG.colors.border.dark : BAR_CHART_CONFIG.colors.border.light;

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TICK_COLOR }} dy={10} />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: TICK_COLOR }}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                />
                <Tooltip
                    formatter={(value: TooltipValue) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                />
                <Bar
                    dataKey="total"
                    fill={isDark ? BAR_CHART_CONFIG.colors.revenueBar.dark : BAR_CHART_CONFIG.colors.revenueBar.light}
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

interface OrderStatusPieChartProps {
    data: OrderStatusDataChart[];
    height: number;
    isDark: boolean;
}

function OrderStatusPieChart({ data, height, isDark }: OrderStatusPieChartProps) {
    const TOOLTIP_BG = isDark ? PIE_CHART_CONFIG.colors.tooltipBg.dark : PIE_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? PIE_CHART_CONFIG.colors.tooltipText.dark : PIE_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? PIE_CHART_CONFIG.colors.border.dark : PIE_CHART_CONFIG.colors.border.light;

    const chartData = data.map((entry) => {
        const color = PIE_CHART_CONFIG.colors.status[entry.label.name];
        const fallback = isDark ? PIE_CHART_CONFIG.colors.pieFallback.dark : PIE_CHART_CONFIG.colors.pieFallback.light;
        const fill = color ? (isDark ? color.dark : color.light) : fallback;

        return { ...entry, name: entry.label.name, fill };
    });

    const handleClickLegend = (value: string) => () => {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        router.get(order.index().url, {
            start_date: `${startOfMonth.getFullYear()}-${startOfMonth.getMonth() + 1}-${startOfMonth.getDate()}`,
            end_date: `${endOfMonth.getFullYear()}-${endOfMonth.getMonth() + 1}-${endOfMonth.getDate()}`,
            status: indoToEnglishStatuses[value],
        });
    };

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="70%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                />
                <Tooltip
                    formatter={(value: TooltipValue) => [typeof value === 'object' ? String(value) : value, 'Total']}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                />
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                        <span style={{ color: TOOLTIP_TEXT }} onClick={handleClickLegend(value)} className="cursor-pointer">
                            {value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

function RevenueChartCard() {
    const { chartWeekRevenue } = usePage<DashboardSectionProps>().props;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalRevenueWeek = chartWeekRevenue.reduce((acc, item) => acc + item.total, 0);

    return (
        <Card className="col-span-1 flex min-h-fit flex-col lg:col-span-4">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Pendapatan 7 Hari Terakhir</CardTitle>
                <CardDescription>Total minggu ini mencapai {formatPrice(totalRevenueWeek)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <RevenueBarChart data={chartWeekRevenue} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}

function OrderStatusChartCard() {
    const { chartMonthStatuses } = usePage<DashboardSectionProps>().props;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Card className="col-span-1 flex min-h-fit flex-col lg:col-span-3">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Status Pesanan</CardTitle>
                <CardDescription>Distribusi status pesanan bulan ini</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <OrderStatusPieChart data={chartMonthStatuses} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}

/**
 * main component
 */

export function ChartsGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <RevenueChartCard />
            <OrderStatusChartCard />
        </div>
    );
}
