import { Greeting } from '../greeting';
import { SummaryCardGrid } from '../summary-card-grid';
import { CashierChartsGrid } from './cashier-charts-grid';

export function CashierDashboardSection() {
    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <Greeting />
            <SummaryCardGrid />
            <CashierChartsGrid />
        </section>
    );
}
