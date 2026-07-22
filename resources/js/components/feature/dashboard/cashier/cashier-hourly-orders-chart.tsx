import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCashierCharts } from '@/hooks/feature/dashboard/use-cashier-charts';
import { useAppearance } from '@/hooks/use-appearance';
import type { HourlyOrderData } from '../dashboard-section';

const BAR_CHART_CONFIG = {
    colors: {
        orderToday: { light: '#3b82f6', dark: '#60a5fa' },
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
    },
} as const;

interface HourlyOrdersBarChartProps {
    data: HourlyOrderData[];
    height: number;
    isDark: boolean;
}

function HourlyOrdersBarChart({ data, height, isDark }: HourlyOrdersBarChartProps) {
    const TICK = isDark ? BAR_CHART_CONFIG.colors.tick.dark : BAR_CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? BAR_CHART_CONFIG.colors.tooltipBg.dark : BAR_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? BAR_CHART_CONFIG.colors.tooltipText.dark : BAR_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? BAR_CHART_CONFIG.colors.border.dark : BAR_CHART_CONFIG.colors.border.light;
    const BAR_COLOR = isDark ? BAR_CHART_CONFIG.colors.orderToday.dark : BAR_CHART_CONFIG.colors.orderToday.light;

    // Filter data to only show hours with orders to prevent overloading the visual space,
    // or show all hours from 00:00 to 23:00 but interval preserveStartEnd.
    // Let's filter to only show active hours or range where there are actual orders, OR show all 24 hours but with smart interval formatting.
    // Standard approach: show all 24 hours, but preserveStartEnd or only label every 4 hours if empty.
    // Actually, in dashboard we can just pass the data directly and use interval="preserveEnd" or dy.
    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TICK }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TICK }} allowDecimals={false} />
                <Tooltip
                    formatter={(value: any) => [value, 'Order Masuk']}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', radius: 4 }}
                />
                <Bar dataKey="count" name="Jumlah Order" fill={BAR_COLOR} radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function CashierHourlyOrdersChart() {
    const { todayHourlyOrders } = useCashierCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalOrders = todayHourlyOrders.reduce((acc, item) => acc + item.count, 0);

    return (
        <Card className="col-span-1 flex min-h-fit flex-col xl:col-span-4">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Order Masuk per Jam Hari Ini</CardTitle>
                <CardDescription>Total {totalOrders} order masuk hari ini</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <HourlyOrdersBarChart data={todayHourlyOrders} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
