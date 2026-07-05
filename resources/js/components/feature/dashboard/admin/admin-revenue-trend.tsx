import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/helper/formatted-price';
import { useAdminCharts } from '@/hooks/feature/dashboard/use-admin-charts';
import { useAppearance } from '@/hooks/use-appearance';
import type { MonthRevenueTrendData } from '../dashboard-section';

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const LINE_CHART_CONFIG = {
    colors: {
        line: { light: '#10b981', dark: '#34d399' },
        gradientStart: { light: 'rgba(16, 185, 129, 0.3)', dark: 'rgba(52, 211, 153, 0.3)' },
        gradientEnd: { light: 'rgba(16, 185, 129, 0.02)', dark: 'rgba(52, 211, 153, 0.02)' },
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
        dot: { light: '#10b981', dark: '#34d399' },
    },
} as const;

interface RevenueTrendAreaChartProps {
    data: MonthRevenueTrendData[];
    height: number;
    isDark: boolean;
}

function RevenueTrendAreaChart({ data, height, isDark }: RevenueTrendAreaChartProps) {
    const TICK = isDark ? LINE_CHART_CONFIG.colors.tick.dark : LINE_CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? LINE_CHART_CONFIG.colors.tooltipBg.dark : LINE_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? LINE_CHART_CONFIG.colors.tooltipText.dark : LINE_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? LINE_CHART_CONFIG.colors.border.dark : LINE_CHART_CONFIG.colors.border.light;
    const LINE_COLOR = isDark ? LINE_CHART_CONFIG.colors.line.dark : LINE_CHART_CONFIG.colors.line.light;
    const GRADIENT_START = isDark
        ? LINE_CHART_CONFIG.colors.gradientStart.dark
        : LINE_CHART_CONFIG.colors.gradientStart.light;
    const GRADIENT_END = isDark ? LINE_CHART_CONFIG.colors.gradientEnd.dark : LINE_CHART_CONFIG.colors.gradientEnd.light;

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GRADIENT_START} stopOpacity={1} />
                        <stop offset="100%" stopColor={GRADIENT_END} stopOpacity={1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: TICK }}
                    dy={10}
                    interval="preserveStartEnd"
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: TICK }}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                />
                <Tooltip
                    formatter={(value: TooltipValue) => [formatPrice(Number(value)), 'Pendapatan']}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke={LINE_COLOR}
                    strokeWidth={2.5}
                    fill="url(#adminRevenueGradient)"
                    dot={{ r: 3, fill: LINE_COLOR, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: LINE_COLOR, strokeWidth: 2, stroke: TOOLTIP_BG }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function AdminRevenueTrend() {
    const { revenueTrendData, totalMonthRevenue } = useAdminCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Card className="col-span-1 flex min-h-fit flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Tren Pendapatan Bulan Ini</CardTitle>
                <CardDescription>Total bulan ini mencapai {formatPrice(totalMonthRevenue)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <RevenueTrendAreaChart data={revenueTrendData} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
