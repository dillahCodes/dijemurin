import { router } from '@inertiajs/react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCashierCharts } from '@/hooks/feature/dashboard/use-cashier-charts';
import { useAppearance } from '@/hooks/use-appearance';
import { OrderDateTypeEnglish } from '@/types/feature/order/order';
import type { PaymentMethodData } from '../dashboard-section';
import orderRoutes from '@/routes/order';

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const PIE_CHART_STATUS_CONFIG: Record<string, { light: string; dark: string }> = {
    cash: { light: '#d97706', dark: '#fbbf24' }, // Cash (Amber)
    qris: { light: '#4f46e5', dark: '#818cf8' }, // QRIS (Indigo)
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

interface PaymentMethodPieChartProps {
    data: PaymentMethodData[];
    height: number;
    isDark: boolean;
}

function PaymentMethodPieChart({ data, height, isDark }: PaymentMethodPieChartProps) {
    const TOOLTIP_BG = isDark ? PIE_CHART_CONFIG.colors.tooltipBg.dark : PIE_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? PIE_CHART_CONFIG.colors.tooltipText.dark : PIE_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? PIE_CHART_CONFIG.colors.border.dark : PIE_CHART_CONFIG.colors.border.light;

    const chartData = data.map((entry) => {
        const color = PIE_CHART_CONFIG.colors.status[entry.label.value];
        const fallback = isDark ? PIE_CHART_CONFIG.colors.pieFallback.dark : PIE_CHART_CONFIG.colors.pieFallback.light;
        const fill = color ? (isDark ? color.dark : color.light) : fallback;

        return { ...entry, name: entry.label.name, fill };
    });

    const handleClickLegend = (name: string) => () => {
        const paymentMethod = name.toLowerCase() === 'cash' ? 'cash' : 'qris';

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        router.get(
            orderRoutes.index({
                query: {
                    dateType: OrderDateTypeEnglish.STATUS_CHANGED,
                    startDate: todayStr,
                    endDate: todayStr,
                    paymentMethod: paymentMethod,
                },
            }).url,
        );
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
                    formatter={(value: TooltipValue) => [typeof value === 'object' ? String(value) : value, 'Transaksi']}
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
                        <span
                            style={{ color: TOOLTIP_TEXT }}
                            onClick={handleClickLegend(value)}
                            className="cursor-pointer hover:underline"
                        >
                            {value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function CashierPaymentMethodChart() {
    const { todayPaymentMethods } = useCashierCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalCompletedToday = todayPaymentMethods.reduce((acc, item) => acc + item.value, 0);

    return (
        <Card className="col-span-1 flex min-h-fit flex-col xl:col-span-3">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Cash vs QRIS Hari Ini</CardTitle>
                <CardDescription>
                    Distribusi metode pembayaran untuk {totalCompletedToday} order selesai hari ini
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <PaymentMethodPieChart data={todayPaymentMethods} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
