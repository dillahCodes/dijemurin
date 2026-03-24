/**
 * types
 */

export interface RevenueDataPoint {
    name: string;
    total: number;
}

interface RevenueBarChartProps {
    data: RevenueDataPoint[];
    height?: number;
}

/**
 * utils
 */

function formatYAxisTick(value: number): string {
    return `Rp ${(value / 1000000).toFixed(1)}jt`;
}

function formatTooltipValue(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * sub components
 */

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ChartTooltipContentProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-md">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="text-sm font-bold text-foreground">
                {formatTooltipValue(payload[0].value)}
            </p>
        </div>
    );
}

/**
 * main component
 */

export function RevenueBarChart({ data, height = 300 }: RevenueBarChartProps) {
    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={32}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="currentColor"
                        className="text-border opacity-40"
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#888888' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#888888' }}
                        tickFormatter={formatYAxisTick}
                        width={72}
                    />
                    <Tooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'currentColor', className: 'text-muted/30' }}
                    />
                    <Bar dataKey="total" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
