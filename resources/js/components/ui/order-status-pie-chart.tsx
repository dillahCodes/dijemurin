/**
 * types
 */

export interface OrderStatusDataPoint {
    name: string;
    value: number;
    color: string;
}

interface OrderStatusPieChartProps {
    data: OrderStatusDataPoint[];
    height?: number;
}

/**
 * utils
 */

function formatTotal(data: OrderStatusDataPoint[]): number {
    return data.reduce((sum, d) => sum + d.value, 0);
}

/**
 * sub components
 */

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieTooltipContentProps {
    active?: boolean;
    payload?: { name: string; value: number; payload: { color: string } }[];
}

function PieTooltipContent({ active, payload }: PieTooltipContentProps) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-md">
            <div className="flex items-center gap-2">
                <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.payload.color }}
                />
                <p className="text-xs font-semibold text-muted-foreground">{item.name}</p>
            </div>
            <p className="mt-1 pl-4 text-sm font-bold text-foreground">{item.value} pesanan</p>
        </div>
    );
}

interface ChartLegendProps {
    data: OrderStatusDataPoint[];
}

function ChartLegend({ data }: ChartLegendProps) {
    return (
        <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                    <div
                        className="h-2.5 w-2.5 flex-none rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-xs text-muted-foreground">{item.name}</span>
                    <span className="ml-auto text-xs font-semibold text-foreground">{item.value}</span>
                </div>
            ))}
        </div>
    );
}

interface DonutCenterLabelProps {
    total: number;
}

function DonutCenterLabel({ total }: DonutCenterLabelProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
        </div>
    );
}

/**
 * main component
 */

export function OrderStatusPieChart({ data, height = 220 }: OrderStatusPieChartProps) {
    const total = formatTotal(data);

    return (
        <div>
            <div className="relative" style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="75%"
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<PieTooltipContent />} />
                    </PieChart>
                </ResponsiveContainer>
                <DonutCenterLabel total={total} />
            </div>
            <ChartLegend data={data} />
        </div>
    );
}
