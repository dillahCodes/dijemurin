import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { useAdminCharts } from '@/hooks/feature/dashboard/use-admin-charts';
import type { OrderMovementData } from '../dashboard-section';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const BAR_CHART_CONFIG = {
    colors: {
        orderMasuk: { light: '#3b82f6', dark: '#60a5fa' },
        orderSelesai: { light: '#0d9488', dark: '#2dd4bf' },
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
    },
} as const;

interface OrderMovementBarChartProps {
    data: OrderMovementData[];
    height: number;
    isDark: boolean;
}

function OrderMovementBarChart({ data, height, isDark }: OrderMovementBarChartProps) {
    const TICK = isDark ? BAR_CHART_CONFIG.colors.tick.dark : BAR_CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? BAR_CHART_CONFIG.colors.tooltipBg.dark : BAR_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? BAR_CHART_CONFIG.colors.tooltipText.dark : BAR_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? BAR_CHART_CONFIG.colors.border.dark : BAR_CHART_CONFIG.colors.border.light;
    const ORDER_MASUK_COLOR = isDark ? BAR_CHART_CONFIG.colors.orderMasuk.dark : BAR_CHART_CONFIG.colors.orderMasuk.light;
    const ORDER_SELESAI_COLOR = isDark
        ? BAR_CHART_CONFIG.colors.orderSelesai.dark
        : BAR_CHART_CONFIG.colors.orderSelesai.light;

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: TICK }}
                    dy={10}
                    interval="preserveStartEnd"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TICK }} allowDecimals={false} />
                <Tooltip
                    formatter={(value: any, name: any) => [value, name]}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', radius: 4 }}
                />
                <Legend
                    verticalAlign="top"
                    align="left"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                        <span style={{ color: TOOLTIP_TEXT }} className="mr-4 text-xs font-medium select-none">
                            {value}
                        </span>
                    )}
                />
                <Bar
                    dataKey="order_masuk"
                    name="Order Masuk"
                    fill={ORDER_MASUK_COLOR}
                    stackId="a"
                    radius={[0, 0, 4, 4]}
                    barSize={100}
                />
                <Bar
                    dataKey="order_selesai"
                    name="Order Selesai"
                    fill={ORDER_SELESAI_COLOR}
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                    barSize={100}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function AdminOrderMovementChart() {
    const { orderMovementData } = useAdminCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalIncoming = orderMovementData.reduce((acc, item) => acc + item.order_masuk, 0);
    const totalCompleted = orderMovementData.reduce((acc, item) => acc + item.order_selesai, 0);

    return (
        <Card className="col-span-1 flex min-h-fit flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Pergerakan Pesanan Bulan Ini</CardTitle>
                <CardDescription>
                    {totalIncoming} Order Masuk & {totalCompleted} Order Selesai
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <OrderMovementBarChart data={orderMovementData} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
