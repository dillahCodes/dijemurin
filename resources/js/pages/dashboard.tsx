import { ChartsGrid } from '@/components/pages/dashboard/charts-grid';
import { RecentOrdersSection } from '@/components/pages/dashboard/recent-orders-section';
import { SummaryCardGrid } from '@/components/pages/dashboard/summary-card-grid';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const BREADCRUMBS: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];

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
