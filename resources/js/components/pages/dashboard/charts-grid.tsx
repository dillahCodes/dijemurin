import type { OrderStatusDataPoint } from '@/components/ui/order-status-pie-chart';
import type { RevenueDataPoint } from '@/components/ui/revenue-bar-chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { OrderStatusPieChart } from '@/components/ui/order-status-pie-chart';
import { RevenueBarChart } from '@/components/ui/revenue-bar-chart';

const REVENUE_DATA: RevenueDataPoint[] = [
    { name: 'Senin', total: 1500000 },
    { name: 'Selasa', total: 1200000 },
    { name: 'Rabu', total: 1800000 },
    { name: 'Kamis', total: 1400000 },
    { name: 'Jumat', total: 2000000 },
    { name: 'Sabtu', total: 2800000 },
    { name: 'Minggu', total: 3200000 },
];

const ORDER_STATUS_DATA: OrderStatusDataPoint[] = [
    { name: 'Pending', value: 25, color: '#3b82f6' },
    { name: 'Selesai', value: 1495, color: '#22c55e' },
    { name: 'Diproses', value: 12, color: '#eab308' },
    { name: 'Batal', value: 5, color: '#ef4444' },
];

/**
 * sub components
 */

function RevenueChartCard() {
    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    Pendapatan 7 Hari Terakhir
                </CardTitle>
                <CardDescription>
                    Total minggu ini mencapai Rp 13.900.000
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RevenueBarChart data={REVENUE_DATA} height={280} />
            </CardContent>
        </Card>
    );
}

function OrderStatusChartCard() {
    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                    Status Pesanan
                </CardTitle>
                <CardDescription>
                    Distribusi status pesanan bulan ini
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OrderStatusPieChart data={ORDER_STATUS_DATA} height={200} />
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
