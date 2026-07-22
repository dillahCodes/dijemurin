import { Head } from '@inertiajs/react';
import { PenggunaSection } from '@/components/feature/pengguna/pengguna-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import pengguna from '@/routes/pengguna';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Pengguna', href: pengguna.index() },
];

export default function PenggunaIndex() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Manajemen Pengguna" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <PenggunaSection />
            </section>
        </AppLayout>
    );
}
