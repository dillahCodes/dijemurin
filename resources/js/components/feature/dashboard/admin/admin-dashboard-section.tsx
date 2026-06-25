import { Greeting } from '../greeting';
import { SummaryCardGrid } from '../summary-card-grid';
import { AdminChartsGrid } from './admin-charts-grid';

export function AdminDashboardSection() {
    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <Greeting />
            <SummaryCardGrid />
            <AdminChartsGrid />
        </section>
    );
}
