import { router } from '@inertiajs/react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { indoToEnglishStatuses } from '@/helper/indo-to-english-statuses';
import { useSuperAdminCharts } from '@/hooks/feature/dashboard/use-superadmin-charts';
import { useAppearance } from '@/hooks/use-appearance';
import order from '@/routes/order';
import { OrderStatusIndonesian } from '@/types/feature/order/order';
import type { MonthOrderStatusData } from '../dashboard-section';

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const PIE_CHART_STATUS_CONFIG: Record<OrderStatusIndonesian, { light: string; dark: string }> = {
    [OrderStatusIndonesian.PENDING]: { light: '#64748b', dark: '#94a3b8' },
    [OrderStatusIndonesian.DONE]: { light: '#10b981', dark: '#34d399' },
    [OrderStatusIndonesian.PROCESS]: { light: '#eab308', dark: '#facc15' },
    [OrderStatusIndonesian.CANCELLED]: { light: '#ef4444', dark: '#f87171' },
    [OrderStatusIndonesian.PICKED_UP]: { light: '#3b82f6', dark: '#60a5fa' },
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

interface StatusPieChartProps {
    data: MonthOrderStatusData[];
    height: number;
    isDark: boolean;
}

function StatusPieChart({ data, height, isDark }: StatusPieChartProps) {
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

/**
 * main component
 */

export function SuperAdminOrderStatusChart() {
    const { orderStatusData } = useSuperAdminCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Card className="col-span-1 flex min-h-fit flex-col lg:col-span-3">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Status Pesanan</CardTitle>
                <CardDescription>Distribusi status pesanan bulan ini</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <StatusPieChart data={orderStatusData} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
