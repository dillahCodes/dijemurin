import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ChartsGrid } from '@/components/features/dashboard/charts-grid';
import { RecentOrdersSection } from '@/components/features/dashboard/recent-orders-section';
import { SummaryCardGrid } from '@/components/features/dashboard/summary-card-grid';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Dashboard" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <SummaryCardGrid />
                <ChartsGrid />
                <RecentOrdersSection />
            </section>
        </AppLayout>
    );
}
