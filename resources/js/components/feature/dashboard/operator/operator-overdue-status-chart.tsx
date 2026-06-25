import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { useOperatorCharts } from '@/hooks/feature/dashboard/use-operator-charts';
import { router } from '@inertiajs/react';
import orderRoutes from '@/routes/order';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CHART_CONFIG = {
    colors: {
        almostOverdue: { light: '#ea580c', dark: '#fb923c' }, // Orange
        overdue: { light: '#e11d48', dark: '#fb7185' },       // Rose
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
    },
} as const;

interface OverdueBarChartProps {
    almostOverdueCount: number;
    overdueCount: number;
    height: number;
    isDark: boolean;
}

function OverdueBarChart({ almostOverdueCount, overdueCount, height, isDark }: OverdueBarChartProps) {
    const TICK = isDark ? CHART_CONFIG.colors.tick.dark : CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? CHART_CONFIG.colors.tooltipBg.dark : CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? CHART_CONFIG.colors.tooltipText.dark : CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? CHART_CONFIG.colors.border.dark : CHART_CONFIG.colors.border.light;

    const chartData = [
        {
            name: 'Hampir Terlambat',
            count: almostOverdueCount,
            valueKey: 'almost_overdue',
            fill: isDark ? CHART_CONFIG.colors.almostOverdue.dark : CHART_CONFIG.colors.almostOverdue.light,
        },
        {
            name: 'Terlambat',
            count: overdueCount,
            valueKey: 'overdue',
            fill: isDark ? CHART_CONFIG.colors.overdue.dark : CHART_CONFIG.colors.overdue.light,
        },
    ];

    const handleClickBar = (dataObj: any) => {
        if (!dataObj) return;
        router.get(orderRoutes.index({
            query: {
                timeStatus: dataObj.valueKey,
            }
        }).url);
    };

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: TICK }}
                    dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TICK }} allowDecimals={false} />
                <Tooltip
                    formatter={(value: any) => [value, 'Total']}
                    contentStyle={{
                        borderRadius: '8px',
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: TOOLTIP_BG,
                        color: TOOLTIP_TEXT,
                    }}
                    cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', radius: 4 }}
                />
                <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    barSize={45}
                    onClick={(state: any) => {
                        if (state && state.valueKey) {
                            handleClickBar(state);
                        } else if (state && state.activePayload && state.activePayload.length > 0) {
                            handleClickBar(state.activePayload[0].payload);
                        }
                    }}
                    className="cursor-pointer"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function OperatorOverdueStatusChart() {
    const { almostOverdueCount, overdueCount } = useOperatorCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalTracked = almostOverdueCount + overdueCount;

    return (
        <Card className="col-span-1 flex min-h-fit flex-col lg:col-span-3">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Status Keterlambatan</CardTitle>
                <CardDescription>
                    {totalTracked} order perlu diperhatikan terkait estimasi waktu pengerjaan
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <OverdueBarChart
                    almostOverdueCount={almostOverdueCount}
                    overdueCount={overdueCount}
                    height={280}
                    isDark={isDark}
                />
            </CardContent>
        </Card>
    );
}
