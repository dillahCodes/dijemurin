import { TrendingUp } from 'lucide-react';
import { OperatorHourlyMovementChart } from './operator-hourly-movement-chart';
import { OperatorOverdueStatusChart } from './operator-overdue-status-chart';

export function OperatorChartsGrid() {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" />
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Statistik</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
                <OperatorHourlyMovementChart />
                <OperatorOverdueStatusChart />
            </div>
        </div>
    );
}
