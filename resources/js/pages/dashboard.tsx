import { Head } from '@inertiajs/react';
import { DashboardSection } from '@/components/feature/dashboard/dashboard-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BREADCRUMBS: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Dashboard" />
            <DashboardSection />
        </AppLayout>
    );
}
