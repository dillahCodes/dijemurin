import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { useOperatorCharts } from '@/hooks/feature/dashboard/use-operator-charts';
import type { ProcessedVsCompletedData } from '../dashboard-section';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BAR_CHART_CONFIG = {
    colors: {
        diproses: { light: '#9333ea', dark: '#c084fc' },
        selesai: { light: '#0d9488', dark: '#2dd4bf' },
        tick: { light: '#71717a', dark: '#a1a1aa' },
        tooltipBg: { light: '#ffffff', dark: '#09090b' },
        tooltipText: { light: '#09090b', dark: '#f4f4f5' },
        border: { light: '#e4e4e7', dark: '#27272a' },
    },
} as const;

interface HourlyMovementBarChartProps {
    data: ProcessedVsCompletedData[];
    height: number;
    isDark: boolean;
}

function HourlyMovementBarChart({ data, height, isDark }: HourlyMovementBarChartProps) {
    const TICK = isDark ? BAR_CHART_CONFIG.colors.tick.dark : BAR_CHART_CONFIG.colors.tick.light;
    const TOOLTIP_BG = isDark ? BAR_CHART_CONFIG.colors.tooltipBg.dark : BAR_CHART_CONFIG.colors.tooltipBg.light;
    const TOOLTIP_TEXT = isDark ? BAR_CHART_CONFIG.colors.tooltipText.dark : BAR_CHART_CONFIG.colors.tooltipText.light;
    const BORDER = isDark ? BAR_CHART_CONFIG.colors.border.dark : BAR_CHART_CONFIG.colors.border.light;
    const DIPROSES_COLOR = isDark ? BAR_CHART_CONFIG.colors.diproses.dark : BAR_CHART_CONFIG.colors.diproses.light;
    const SELESAI_COLOR = isDark ? BAR_CHART_CONFIG.colors.selesai.dark : BAR_CHART_CONFIG.colors.selesai.light;

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={1} minHeight={1}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER} opacity={0.5} />
                <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: TICK }}
                    dy={10}
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
                    dataKey="diproses"
                    name="Order Diproses"
                    fill={DIPROSES_COLOR}
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                />
                <Bar
                    dataKey="selesai"
                    name="Order Selesai"
                    fill={SELESAI_COLOR}
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function OperatorHourlyMovementChart() {
    const { processedVsCompletedData } = useOperatorCharts();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const totalProcessed = processedVsCompletedData.reduce((acc, item) => acc + item.diproses, 0);
    const totalCompleted = processedVsCompletedData.reduce((acc, item) => acc + item.selesai, 0);

    return (
        <Card className="col-span-1 flex min-h-fit flex-col lg:col-span-4">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Order Diproses vs Selesai Hari Ini</CardTitle>
                <CardDescription>
                    {totalProcessed} Order Diproses & {totalCompleted} Order Selesai Hari Ini
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
                <HourlyMovementBarChart data={processedVsCompletedData} height={280} isDark={isDark} />
            </CardContent>
        </Card>
    );
}
