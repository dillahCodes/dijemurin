import { Head, usePage } from '@inertiajs/react';
import type { LayananItemTambahSectionProps } from '@/components/feature/layanan/items/tambah/layanan-item-tambah-section';
import { LayananItemTambahSection } from '@/components/feature/layanan/items/tambah/layanan-item-tambah-section';
import AppLayout from '@/layouts/app-layout';
import layanan from '@/routes/layanan';

export default function LayananItemTambah() {
    const { service } = usePage<LayananItemTambahSectionProps>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Layanan', href: layanan.index() },
                { title: `Price List ${service.name}`, href: layanan.items.index({ id: service.id }) },
                { title: 'Tambah Price List', href: '' },
            ]}
        >
            <Head title={`Tambah Price List ${service.name}`} />
            <section className="flex flex-1 flex-col gap-6 p-4 xl:p-6">
                <LayananItemTambahSection />
            </section>
        </AppLayout>
    );
}
