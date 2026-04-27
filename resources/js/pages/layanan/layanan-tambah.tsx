import { Head } from '@inertiajs/react';
import { LayananTambahSection } from '@/components/feature/layanan/tambah/layanan-tambah-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananTambah() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layanan.index() },
                { title: 'Tambah Layanan', href: '' },
            ]}
        >
            <Head title="Tambah Layanan" />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananTambahSection />
            </section>
        </AppLayout>
    );
}
