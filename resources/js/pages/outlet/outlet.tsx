import { Head } from '@inertiajs/react';
import { OutletSection } from '@/components/feature/outlet/outlet-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import outlet from '@/routes/outlet';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Outlet', href: outlet.index() },
];

export default function OutletIndex() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Outlet" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <OutletSection />
            </section>
        </AppLayout>
    );
}
