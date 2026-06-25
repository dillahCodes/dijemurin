import { TrendingUp } from 'lucide-react';
import { SuperAdminOrderStatusChart } from './superadmin-order-status-chart';
import { SuperAdminRevenueTrend } from './superadmin-revenue-trend';

export function SuperAdminChartsGrid() {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" />
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Statistik</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <SuperAdminRevenueTrend />
                <SuperAdminOrderStatusChart />
            </div>
        </div>
    );
}
