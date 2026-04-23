import { PenggunaDetailSection } from '@/components/feature/pengguna/detail/pengguna-detail-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import pengguna from '@/routes/pengguna';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Pengguna', href: pengguna.index() },
    { title: 'Detail Pengguna', href: '' },
];

export default function PenggunaDetail() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Detail Pengguna" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <PenggunaDetailSection />
            </section>
        </AppLayout>
    );
}
