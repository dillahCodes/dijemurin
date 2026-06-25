import { Greeting } from '../greeting';
import { SummaryCardGrid } from '../summary-card-grid';
import { SuperAdminChartsGrid } from './superadmin-charts-grid';

export function SuperAdminDashboardSection() {
    return (
        <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
            <Greeting />
            <SummaryCardGrid />
            <SuperAdminChartsGrid />
        </section>
    );
}

