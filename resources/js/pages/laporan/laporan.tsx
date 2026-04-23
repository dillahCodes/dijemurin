import { Head } from '@inertiajs/react';
import { LaporanSection } from '@/components/feature/laporan/laporan-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Laporan', href: '#' },
];

export default function LaporanIndex() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Laporan" />
            <section className="flex max-w-3xl flex-1 flex-col gap-6 p-4 xl:p-6">
                <LaporanSection />
            </section>
        </AppLayout>
    );
}
