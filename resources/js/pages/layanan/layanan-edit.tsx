import { Head } from '@inertiajs/react';
import { LayananEditSection } from '@/components/feature/layanan/edit/layanan-edit-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananEdit() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layanan.index() },
                { title: 'Edit Layanan', href: '' },
            ]}
        >
            <Head title="Edit Layanan" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananEditSection />
            </section>
        </AppLayout>
    );
}
