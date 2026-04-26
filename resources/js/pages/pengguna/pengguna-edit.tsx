import { Head } from '@inertiajs/react';
import { PenggunaEditSection } from '@/components/feature/pengguna/edit/pengguna-edit-section';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import pengguna from '@/routes/pengguna';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Pengguna', href: pengguna.index() },
    { title: 'Edit Pengguna', href: '' },
];

export default function PenggunaEdit() {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Edit Pengguna" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <PenggunaEditSection />
            </section>
        </AppLayout>
    );
}
