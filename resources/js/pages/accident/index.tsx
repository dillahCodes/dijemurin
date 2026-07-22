import { Head } from '@inertiajs/react';
import { AccidentDataSection } from '@/components/feature/accident/accident-data-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import accidents from '@/routes/accidents';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Laporan Insiden', href: accidents.index() },
];

export default function AccidentIndex() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Insiden Laundry" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <AccidentDataSection />
            </section>
        </AppLayout>
    );
}
