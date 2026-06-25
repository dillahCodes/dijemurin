import { Greeting } from '../greeting';
import { SummaryCardGrid } from '../summary-card-grid';
import { OperatorChartsGrid } from './operator-charts-grid';

export function OperatorDashboardSection() {
    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <Greeting />
            <SummaryCardGrid />
            <OperatorChartsGrid />
        </section>
    );
}
