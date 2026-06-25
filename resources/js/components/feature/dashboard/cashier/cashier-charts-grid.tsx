import { TrendingUp } from 'lucide-react';
import { CashierHourlyOrdersChart } from './cashier-hourly-orders-chart';
import { CashierPaymentMethodChart } from './cashier-payment-method-chart';

export function CashierChartsGrid() {
    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" />
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Statistik</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                <CashierHourlyOrdersChart />
                <CashierPaymentMethodChart />
            </div>
        </div>
    );
}
