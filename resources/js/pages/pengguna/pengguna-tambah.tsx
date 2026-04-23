import { Head } from '@inertiajs/react';
import { PenggunaTambahSection } from '@/components/feature/pengguna/tambah/pengguna-tambah-section';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import pengguna from '@/routes/pengguna';
import type { BreadcrumbItem } from '@/types';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Pengguna', href: pengguna.index() },
    { title: 'Tambah Pengguna', href: '' },
];

export default function PenggunaTambah() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Tambah Pengguna" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <PenggunaTambahSection />
            </section>
        </AppLayout>
    );
}
